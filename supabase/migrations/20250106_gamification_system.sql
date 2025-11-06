-- Gamification System Migration
-- Agent 2 (Performance): Minimal, optimized schema
-- Agent 3 (Psychology): Complete feature support

-- User Statistics Table (XP, Level, Streak)
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_read_date DATE,
    total_books_completed INTEGER NOT NULL DEFAULT 0,
    total_pages_read INTEGER NOT NULL DEFAULT 0,
    total_reading_time INTEGER NOT NULL DEFAULT 0, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement Definitions Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '🏆',
    xp_reward INTEGER NOT NULL DEFAULT 50,
    requirement_type TEXT NOT NULL, -- 'books_completed', 'pages_read', 'streak_days', 'reading_time'
    requirement_value INTEGER NOT NULL,
    tier TEXT NOT NULL DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table (Earned Achievements)
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Indexes for Performance (Agent 2)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(level);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned_at ON user_achievements(earned_at DESC);

-- Row Level Security (RLS)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own stats"
    ON user_stats FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
    ON user_stats FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
    ON user_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view their own earned achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own earned achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level formula: level = floor(xp / 100) + 1
    -- Level 1: 0-99 XP, Level 2: 100-199 XP, etc.
    RETURN FLOOR(xp / 100.0) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get XP needed for next level
CREATE OR REPLACE FUNCTION xp_for_next_level(current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN current_level * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user stats (called from app)
CREATE OR REPLACE FUNCTION update_user_stats(
    p_user_id UUID,
    p_xp_gained INTEGER DEFAULT 0,
    p_pages_read INTEGER DEFAULT 0,
    p_reading_time INTEGER DEFAULT 0,
    p_book_completed BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
    new_xp INTEGER,
    new_level INTEGER,
    level_up BOOLEAN,
    new_streak INTEGER,
    streak_broken BOOLEAN
) AS $$
DECLARE
    v_old_level INTEGER;
    v_new_level INTEGER;
    v_old_streak INTEGER;
    v_new_streak INTEGER;
    v_last_read DATE;
    v_today DATE := CURRENT_DATE;
BEGIN
    -- Get or create user stats
    INSERT INTO user_stats (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Get current stats
    SELECT level, current_streak, last_read_date
    INTO v_old_level, v_old_streak, v_last_read
    FROM user_stats
    WHERE user_id = p_user_id;

    -- Calculate new streak
    IF v_last_read IS NULL OR v_last_read = v_today THEN
        -- First read or same day
        v_new_streak := COALESCE(v_old_streak, 0);
    ELSIF v_last_read = v_today - INTERVAL '1 day' THEN
        -- Consecutive day
        v_new_streak := v_old_streak + 1;
    ELSE
        -- Streak broken
        v_new_streak := 1;
    END IF;

    -- Update stats
    UPDATE user_stats
    SET
        xp = xp + p_xp_gained,
        level = calculate_level(xp + p_xp_gained),
        current_streak = v_new_streak,
        longest_streak = GREATEST(longest_streak, v_new_streak),
        last_read_date = v_today,
        total_pages_read = total_pages_read + p_pages_read,
        total_reading_time = total_reading_time + p_reading_time,
        total_books_completed = total_books_completed + CASE WHEN p_book_completed THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING xp, level INTO new_xp, v_new_level;

    -- Check for level up
    level_up := v_new_level > v_old_level;

    -- Check for streak broken
    streak_broken := v_new_streak < v_old_streak AND v_old_streak > 0;

    new_level := v_new_level;
    new_streak := v_new_streak;

    RETURN QUERY SELECT new_xp, new_level, level_up, new_streak, streak_broken;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed Initial Achievements (Agent 3 - Psychology)
INSERT INTO achievements (name, description, icon, xp_reward, requirement_type, requirement_value, tier) VALUES
    -- Reading Achievements
    ('اولین قدم', 'اولین کتاب خود را تمام کنید', '📖', 50, 'books_completed', 1, 'bronze'),
    ('کتابخوان', '5 کتاب را تمام کنید', '📚', 100, 'books_completed', 5, 'silver'),
    ('کتابخوان حرفه‌ای', '10 کتاب را تمام کنید', '🎓', 200, 'books_completed', 10, 'gold'),
    ('استاد کتاب', '25 کتاب را تمام کنید', '👑', 500, 'books_completed', 25, 'platinum'),
    
    -- Page Reading Achievements
    ('صفحه‌خوان', '100 صفحه بخوانید', '📄', 50, 'pages_read', 100, 'bronze'),
    ('خواننده پرشور', '500 صفحه بخوانید', '📃', 100, 'pages_read', 500, 'silver'),
    ('خواننده افسانه‌ای', '1000 صفحه بخوانید', '📜', 200, 'pages_read', 1000, 'gold'),
    ('غول کتابخوانی', '5000 صفحه بخوانید', '🦁', 500, 'pages_read', 5000, 'platinum'),
    
    -- Streak Achievements
    ('استریک 7 روزه', '7 روز متوالی مطالعه کنید', '🔥', 100, 'streak_days', 7, 'bronze'),
    ('استریک 30 روزه', '30 روز متوالی مطالعه کنید', '⚡', 300, 'streak_days', 30, 'silver'),
    ('استریک 100 روزه', '100 روز متوالی مطالعه کنید', '💎', 1000, 'streak_days', 100, 'gold'),
    ('استریک 365 روزه', 'یک سال متوالی مطالعه کنید', '🌟', 5000, 'streak_days', 365, 'platinum'),
    
    -- Time Achievements
    ('زمان‌سنج', '60 دقیقه مطالعه کنید', '⏱️', 50, 'reading_time', 60, 'bronze'),
    ('خواننده پایدار', '10 ساعت مطالعه کنید', '⏰', 200, 'reading_time', 600, 'silver'),
    ('استاد زمان', '50 ساعت مطالعه کنید', '🕐', 500, 'reading_time', 3000, 'gold'),
    ('افسانه زمان', '100 ساعت مطالعه کنید', '⌛', 1000, 'reading_time', 6000, 'platinum')
ON CONFLICT DO NOTHING;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_stats TO authenticated;
GRANT SELECT ON achievements TO authenticated;
GRANT ALL ON user_achievements TO authenticated;
