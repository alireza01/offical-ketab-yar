-- Create user_words table (for vocabulary management)
CREATE TABLE IF NOT EXISTS user_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  context TEXT,
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  page_number INTEGER,
  
  -- Spaced Repetition (SM-2 Algorithm)
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'reviewing', 'mastered')),
  ease_factor DECIMAL(3,2) DEFAULT 2.5, -- SM-2: 1.3 to 2.5+
  interval_days INTEGER DEFAULT 1, -- Days until next review
  repetitions INTEGER DEFAULT 0, -- Number of successful reviews
  next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, word)
);

-- Create vocabulary_sessions table (for tracking review sessions)
CREATE TABLE IF NOT EXISTS vocabulary_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT DEFAULT 'quiz' CHECK (session_type IN ('quiz', 'flashcard', 'review')),
  
  -- Session stats
  words_reviewed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  perfect_score BOOLEAN DEFAULT FALSE,
  
  -- Gamification
  xp_earned INTEGER DEFAULT 0,
  streak_bonus INTEGER DEFAULT 0,
  
  -- Metadata
  session_date DATE DEFAULT CURRENT_DATE,
  duration_seconds INTEGER,
  review_mode TEXT, -- 'all', 'due', 'difficult', 'new'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_quiz_completions table (for tracking daily quiz streak)
CREATE TABLE IF NOT EXISTS daily_quiz_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completion_date DATE DEFAULT CURRENT_DATE NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  perfect_score BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, completion_date)
);

-- Add quiz streak to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS quiz_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_quiz_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_quiz_date DATE;

-- SM-2 Spaced Repetition Algorithm Function
CREATE OR REPLACE FUNCTION calculate_next_review_sm2(
  current_ease_factor DECIMAL,
  current_interval INTEGER,
  current_repetitions INTEGER,
  quality INTEGER -- 0-5 (0=complete blackout, 5=perfect response)
)
RETURNS TABLE(
  new_ease_factor DECIMAL,
  new_interval INTEGER,
  new_repetitions INTEGER,
  new_status TEXT
) AS $$
DECLARE
  ef DECIMAL := current_ease_factor;
  interval_val INTEGER := current_interval;
  reps INTEGER := current_repetitions;
BEGIN
  -- Update ease factor
  ef := ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  -- Minimum ease factor is 1.3
  IF ef < 1.3 THEN
    ef := 1.3;
  END IF;
  
  -- Update repetitions and interval
  IF quality < 3 THEN
    -- Incorrect answer - reset
    reps := 0;
    interval_val := 1;
  ELSE
    -- Correct answer
    reps := reps + 1;
    
    IF reps = 1 THEN
      interval_val := 1;
    ELSIF reps = 2 THEN
      interval_val := 6;
    ELSE
      interval_val := ROUND(interval_val * ef);
    END IF;
  END IF;
  
  -- Determine status
  DECLARE
    status_val TEXT;
  BEGIN
    IF reps = 0 THEN
      status_val := 'learning';
    ELSIF reps < 3 THEN
      status_val := 'reviewing';
    ELSE
      status_val := 'mastered';
    END IF;
    
    RETURN QUERY SELECT ef, interval_val, reps, status_val;
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to update word after review
CREATE OR REPLACE FUNCTION update_word_after_review(
  p_word_id UUID,
  p_quality INTEGER -- 0-5
)
RETURNS VOID AS $$
DECLARE
  word_record RECORD;
  sm2_result RECORD;
BEGIN
  -- Get current word data
  SELECT * INTO word_record FROM user_words WHERE id = p_word_id;
  
  -- Calculate new SM-2 values
  SELECT * INTO sm2_result FROM calculate_next_review_sm2(
    word_record.ease_factor,
    word_record.interval_days,
    word_record.repetitions,
    p_quality
  );
  
  -- Update word
  UPDATE user_words
  SET
    ease_factor = sm2_result.new_ease_factor,
    interval_days = sm2_result.new_interval,
    repetitions = sm2_result.new_repetitions,
    status = sm2_result.new_status,
    next_review_at = NOW() + (sm2_result.new_interval || ' days')::INTERVAL,
    last_reviewed_at = NOW(),
    review_count = review_count + 1,
    correct_count = correct_count + CASE WHEN p_quality >= 3 THEN 1 ELSE 0 END,
    incorrect_count = incorrect_count + CASE WHEN p_quality < 3 THEN 1 ELSE 0 END,
    updated_at = NOW()
  WHERE id = p_word_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get words due for review
CREATE OR REPLACE FUNCTION get_words_due_for_review(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  word TEXT,
  definition TEXT,
  context TEXT,
  level TEXT,
  status TEXT,
  review_count INTEGER,
  next_review_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uw.id,
    uw.word,
    uw.definition,
    uw.context,
    uw.level,
    uw.status,
    uw.review_count,
    uw.next_review_at
  FROM user_words uw
  WHERE uw.user_id = p_user_id
    AND uw.next_review_at <= NOW()
    AND uw.status != 'mastered'
  ORDER BY uw.next_review_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to update quiz streak
CREATE OR REPLACE FUNCTION update_quiz_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_date DATE;
  today DATE := CURRENT_DATE;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
BEGIN
  SELECT last_quiz_date, quiz_streak, longest_quiz_streak 
  INTO last_date, current_streak_val, longest_streak_val
  FROM profiles WHERE id = p_user_id;
  
  IF last_date IS NULL THEN
    -- First quiz
    UPDATE profiles 
    SET quiz_streak = 1,
        longest_quiz_streak = GREATEST(COALESCE(longest_quiz_streak, 0), 1),
        last_quiz_date = today
    WHERE id = p_user_id;
  ELSIF last_date = today THEN
    -- Already completed today
    RETURN;
  ELSIF last_date = today - INTERVAL '1 day' THEN
    -- Continue streak
    UPDATE profiles 
    SET quiz_streak = quiz_streak + 1,
        longest_quiz_streak = GREATEST(COALESCE(longest_quiz_streak, 0), quiz_streak + 1),
        last_quiz_date = today
    WHERE id = p_user_id;
  ELSE
    -- Streak broken
    UPDATE profiles 
    SET quiz_streak = 1,
        last_quiz_date = today
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update quiz streak on completion
CREATE OR REPLACE FUNCTION trigger_update_quiz_streak()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_quiz_streak(NEW.user_id);
  
  -- Add XP for quiz completion
  DECLARE
    base_xp INTEGER := 50;
    perfect_bonus INTEGER := 50;
    streak_bonus INTEGER := 0;
    total_xp INTEGER;
    current_streak INTEGER;
  BEGIN
    -- Get current streak
    SELECT quiz_streak INTO current_streak FROM profiles WHERE id = NEW.user_id;
    
    -- Calculate streak bonus (10 XP per day of streak)
    streak_bonus := current_streak * 10;
    
    -- Calculate total XP
    total_xp := base_xp + (CASE WHEN NEW.perfect_score THEN perfect_bonus ELSE 0 END) + streak_bonus;
    
    -- Update XP in completion record
    NEW.xp_earned := total_xp;
    
    -- Add XP to user
    PERFORM add_xp_to_user(NEW.user_id, total_xp);
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS quiz_completion_trigger ON daily_quiz_completions;
CREATE TRIGGER quiz_completion_trigger
  BEFORE INSERT ON daily_quiz_completions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_quiz_streak();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_words_user_id ON user_words(user_id);
CREATE INDEX IF NOT EXISTS idx_user_words_next_review ON user_words(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_words_status ON user_words(user_id, status);
CREATE INDEX IF NOT EXISTS idx_vocabulary_sessions_user_date ON vocabulary_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_daily_quiz_completions_user_date ON daily_quiz_completions(user_id, completion_date);

-- RLS Policies
ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_quiz_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own words" ON user_words
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON vocabulary_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON vocabulary_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz completions" ON daily_quiz_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz completions" ON daily_quiz_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE user_words IS 'User vocabulary with SM-2 spaced repetition';
COMMENT ON TABLE vocabulary_sessions IS 'Tracks vocabulary review sessions';
COMMENT ON TABLE daily_quiz_completions IS 'Tracks daily quiz completions and streaks';
COMMENT ON FUNCTION calculate_next_review_sm2 IS 'SM-2 spaced repetition algorithm';
COMMENT ON FUNCTION update_word_after_review IS 'Updates word status after review using SM-2';
COMMENT ON FUNCTION get_words_due_for_review IS 'Gets words that need review today';
