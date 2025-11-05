-- Add gamification columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_read_at DATE;

-- Create index for streak calculation
CREATE INDEX IF NOT EXISTS idx_users_last_read_at ON users(last_read_at);

-- Rename user_progress to user_library (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress') THEN
    ALTER TABLE user_progress RENAME TO user_library;
  END IF;
END
$$;

-- Ensure user_library has correct columns
ALTER TABLE user_library
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'reading',
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0;

-- Add constraint for status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_library_status_check'
  ) THEN
    ALTER TABLE user_library
    ADD CONSTRAINT user_library_status_check
    CHECK (status IN ('want_to_read', 'reading', 'completed'));
  END IF;
END
$$;

-- Create reading_sessions table for XP calculation
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  pages_read INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_id ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_sessions_created_at ON reading_sessions(created_at);

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_last_read DATE;
  v_current_streak INTEGER;
  v_new_streak INTEGER;
BEGIN
  -- Get current streak and last read date
  SELECT last_read_at, current_streak
  INTO v_last_read, v_current_streak
  FROM users
  WHERE id = p_user_id;

  -- Calculate new streak
  IF v_last_read IS NULL THEN
    v_new_streak := 1;
  ELSIF v_last_read = CURRENT_DATE THEN
    v_new_streak := v_current_streak; -- Same day, no change
  ELSIF v_last_read = CURRENT_DATE - INTERVAL '1 day' THEN
    v_new_streak := v_current_streak + 1; -- Consecutive day
  ELSE
    v_new_streak := 1; -- Streak broken, restart
  END IF;

  -- Update user
  UPDATE users
  SET current_streak = v_new_streak,
      last_read_at = CURRENT_DATE
  WHERE id = p_user_id;

  RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql;

-- Function to add XP
CREATE OR REPLACE FUNCTION add_user_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_new_xp INTEGER;
BEGIN
  UPDATE users
  SET xp = xp + p_xp_amount
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;

  RETURN v_new_xp;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON COLUMN users.xp IS 'Total experience points earned by user';
COMMENT ON COLUMN users.current_streak IS 'Current consecutive days reading streak';
COMMENT ON COLUMN users.last_read_at IS 'Last date user read any book';
COMMENT ON TABLE reading_sessions IS 'Tracks individual reading sessions for XP calculation';
