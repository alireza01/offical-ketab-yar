-- Add gamification columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_read_date DATE;

-- Add completion_percentage to user_progress if not exists
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS completion_percentage DECIMAL(5,2) DEFAULT 0;

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL, -- 'books_completed', 'streak_days', 'pages_read', 'xp_earned'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Create function to calculate XP reward
CREATE OR REPLACE FUNCTION calculate_xp_reward(pages_read INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN pages_read * 10; -- 10 XP per page
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level_val INTEGER := 1;
  xp_needed INTEGER := 100;
  remaining_xp INTEGER := total_xp;
BEGIN
  WHILE remaining_xp >= xp_needed LOOP
    remaining_xp := remaining_xp - xp_needed;
    level_val := level_val + 1;
    xp_needed := level_val * 100; -- Each level requires level * 100 XP
  END LOOP;
  
  RETURN level_val;
END;
$$ LANGUAGE plpgsql;

-- Create function to update reading streak
CREATE OR REPLACE FUNCTION update_reading_streak(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  last_date DATE;
  today DATE := CURRENT_DATE;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
BEGIN
  SELECT last_read_date, current_streak, longest_streak 
  INTO last_date, current_streak_val, longest_streak_val
  FROM profiles WHERE id = user_uuid;
  
  -- If never read before or last read was not yesterday or today
  IF last_date IS NULL THEN
    -- First time reading
    UPDATE profiles 
    SET current_streak = 1,
        longest_streak = GREATEST(COALESCE(longest_streak, 0), 1),
        last_read_date = today
    WHERE id = user_uuid;
  ELSIF last_date = today THEN
    -- Already read today, do nothing
    RETURN;
  ELSIF last_date = today - INTERVAL '1 day' THEN
    -- Continue streak (read yesterday, reading today)
    UPDATE profiles 
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(COALESCE(longest_streak, 0), current_streak + 1),
        last_read_date = today
    WHERE id = user_uuid;
  ELSE
    -- Streak broken (last read was more than 1 day ago)
    UPDATE profiles 
    SET current_streak = 1,
        last_read_date = today
    WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to add XP and update level
CREATE OR REPLACE FUNCTION add_xp_to_user(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Add XP
  UPDATE profiles 
  SET xp = xp + xp_amount
  WHERE id = user_uuid
  RETURNING xp INTO new_xp;
  
  -- Calculate and update level
  new_level := calculate_level_from_xp(new_xp);
  
  UPDATE profiles 
  SET level = new_level
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update streak and XP when user reads
CREATE OR REPLACE FUNCTION trigger_update_gamification()
RETURNS TRIGGER AS $$
BEGIN
  -- Update streak
  PERFORM update_reading_streak(NEW.user_id);
  
  -- Add XP if page progressed
  IF (TG_OP = 'INSERT') OR (NEW.current_page > OLD.current_page) THEN
    DECLARE
      pages_read INTEGER;
    BEGIN
      IF TG_OP = 'INSERT' THEN
        pages_read := NEW.current_page;
      ELSE
        pages_read := NEW.current_page - OLD.current_page;
      END IF;
      
      -- Add XP (10 XP per page)
      PERFORM add_xp_to_user(NEW.user_id, pages_read * 10);
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS gamification_trigger ON user_progress;
CREATE TRIGGER gamification_trigger
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_gamification();

-- Insert default achievements
INSERT INTO achievements (name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
  ('خواننده تازه‌کار', 'اولین کتاب خود را تمام کنید', '📖', 50, 'books_completed', 1),
  ('کتابخوان', '5 کتاب را تمام کنید', '📚', 100, 'books_completed', 5),
  ('کتابخوان حرفه‌ای', '10 کتاب را تمام کنید', '🎓', 200, 'books_completed', 10),
  ('استاد کتاب', '25 کتاب را تمام کنید', '👑', 500, 'books_completed', 25),
  ('افسانه کتاب', '50 کتاب را تمام کنید', '🏆', 1000, 'books_completed', 50),
  
  ('استریک 7 روزه', '7 روز متوالی مطالعه کنید', '🔥', 100, 'streak_days', 7),
  ('استریک 30 روزه', '30 روز متوالی مطالعه کنید', '⚡', 300, 'streak_days', 30),
  ('استریک 100 روزه', '100 روز متوالی مطالعه کنید', '💎', 1000, 'streak_days', 100),
  ('استریک سالانه', '365 روز متوالی مطالعه کنید', '👑', 5000, 'streak_days', 365),
  
  ('صفحه‌خوان', '100 صفحه بخوانید', '📄', 50, 'pages_read', 100),
  ('صفحه‌خوان حرفه‌ای', '500 صفحه بخوانید', '📑', 200, 'pages_read', 500),
  ('صفحه‌خوان افسانه‌ای', '1000 صفحه بخوانید', '📚', 500, 'pages_read', 1000),
  
  ('مبتدی', 'به سطح 5 برسید', '⭐', 50, 'xp_earned', 500),
  ('متوسط', 'به سطح 10 برسید', '🌟', 100, 'xp_earned', 5500),
  ('پیشرفته', 'به سطح 25 برسید', '✨', 500, 'xp_earned', 32500),
  ('استاد', 'به سطح 50 برسید', '💫', 2000, 'xp_earned', 127500)
ON CONFLICT DO NOTHING;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completion ON user_progress(user_id, completion_percentage);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles(current_streak DESC);

-- Add RLS policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can read achievements
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- Users can only see their own earned achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert achievements (via triggers/functions)
CREATE POLICY "System can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE achievements IS 'Gamification achievements that users can earn';
COMMENT ON TABLE user_achievements IS 'Junction table tracking which achievements users have earned';
COMMENT ON COLUMN profiles.xp IS 'Total experience points earned by user';
COMMENT ON COLUMN profiles.level IS 'Current level calculated from XP';
COMMENT ON COLUMN profiles.current_streak IS 'Current consecutive days of reading';
COMMENT ON COLUMN profiles.longest_streak IS 'Longest streak ever achieved';
COMMENT ON COLUMN profiles.last_read_date IS 'Last date user read (for streak tracking)';
