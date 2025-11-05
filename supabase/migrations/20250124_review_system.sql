-- Review System Migration
-- Spaced Repetition & Quiz System

-- Review Sessions
CREATE TABLE IF NOT EXISTS public.review_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL,
  words_reviewed INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_review_sessions_user ON public.review_sessions(user_id);
CREATE INDEX idx_review_sessions_completed ON public.review_sessions(completed_at DESC);

-- Quiz Results
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.review_sessions(id) ON DELETE CASCADE,
  word_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_results_session ON public.quiz_results(session_id);
CREATE INDEX idx_quiz_results_word ON public.quiz_results(word_id);

-- Enable RLS
ALTER TABLE public.review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users view own sessions" ON public.review_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create sessions" ON public.review_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own results" ON public.quiz_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.review_sessions WHERE review_sessions.id = quiz_results.session_id AND review_sessions.user_id = auth.uid())
);
CREATE POLICY "Users create results" ON public.quiz_results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.review_sessions WHERE review_sessions.id = quiz_results.session_id AND review_sessions.user_id = auth.uid())
);

-- Helper Functions
CREATE OR REPLACE FUNCTION get_words_due_for_review(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  word TEXT,
  meaning TEXT,
  definition TEXT,
  context TEXT,
  level TEXT,
  ease_factor NUMERIC,
  interval_days INTEGER,
  repetitions INTEGER,
  next_review_at TIMESTAMPTZ
) AS 
BEGIN
  RETURN QUERY
  SELECT v.id, v.word, v.meaning, v.definition, v.context, v.level,
         v.ease_factor, v.interval_days, v.repetitions, v.next_review_at
  FROM public.vocabulary v
  WHERE v.user_id = p_user_id AND v.next_review_at <= NOW()
  ORDER BY v.next_review_at ASC
  LIMIT p_limit;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_review_stats(p_user_id UUID)
RETURNS JSON AS 
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_sessions', COUNT(*),
    'total_words_reviewed', COALESCE(SUM(words_reviewed), 0),
    'total_correct', COALESCE(SUM(correct_answers), 0),
    'total_incorrect', COALESCE(SUM(incorrect_answers), 0),
    'total_xp_earned', COALESCE(SUM(xp_earned), 0),
    'average_accuracy', CASE WHEN SUM(words_reviewed) > 0 
      THEN ROUND((SUM(correct_answers)::NUMERIC / SUM(words_reviewed)::NUMERIC) * 100, 2)
      ELSE 0 END,
    'last_review_date', MAX(completed_at)
  ) INTO result
  FROM public.review_sessions
  WHERE user_id = p_user_id;
  RETURN result;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_words_due_for_review(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_stats(UUID) TO authenticated;
