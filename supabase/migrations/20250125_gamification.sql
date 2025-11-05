-- Gamification System Migration
-- Achievements, Leagues, Streaks

-- Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  name_fa TEXT,
  description TEXT NOT NULL,
  description_fa TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  is_secret BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_achievements_category ON public.achievements(category);

-- User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned ON public.user_achievements(earned_at DESC);

-- Leagues Table
CREATE TABLE IF NOT EXISTS public.leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  name_fa TEXT,
  tier INTEGER NOT NULL UNIQUE,
  min_xp INTEGER NOT NULL,
  max_xp INTEGER,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly League Standings
CREATE TABLE IF NOT EXISTS public.league_standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  weekly_xp INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_league_standings_week ON public.league_standings(week_start, weekly_xp DESC);
CREATE INDEX idx_league_standings_user ON public.league_standings(user_id);

-- Streak History
CREATE TABLE IF NOT EXISTS public.streak_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  streak_count INTEGER NOT NULL,
  started_at DATE NOT NULL,
  ended_at DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streak_history_user ON public.streak_history(user_id);
CREATE INDEX idx_streak_history_active ON public.streak_history(user_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Achievements public" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "User achievements own" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Leagues public" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "League standings public" ON public.league_standings FOR SELECT USING (true);
CREATE POLICY "Streak history own" ON public.streak_history FOR SELECT USING (auth.uid() = user_id);

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS 
DECLARE
  v_last_read DATE;
  v_current_streak INTEGER;
BEGIN
  SELECT last_read_at, current_streak INTO v_last_read, v_current_streak
  FROM public.users WHERE id = p_user_id;
  
  IF v_last_read IS NULL OR v_last_read < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Streak broken, start new
    UPDATE public.users SET current_streak = 1, last_read_at = CURRENT_DATE WHERE id = p_user_id;
    INSERT INTO public.streak_history (user_id, streak_count, started_at, ended_at, is_active)
    VALUES (p_user_id, v_current_streak, v_last_read, CURRENT_DATE - INTERVAL '1 day', false)
    ON CONFLICT DO NOTHING;
  ELSIF v_last_read = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Continue streak
    UPDATE public.users 
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_read_at = CURRENT_DATE
    WHERE id = p_user_id;
  END IF;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_user_streak(UUID) TO authenticated;

-- Function to get user league
CREATE OR REPLACE FUNCTION get_user_league(p_user_id UUID)
RETURNS JSON AS 
DECLARE
  v_xp INTEGER;
  result JSON;
BEGIN
  SELECT xp INTO v_xp FROM public.users WHERE id = p_user_id;
  
  SELECT json_build_object(
    'id', l.id,
    'name', l.name,
    'tier', l.tier,
    'icon', l.icon,
    'color', l.color,
    'user_xp', v_xp,
    'min_xp', l.min_xp,
    'max_xp', l.max_xp
  ) INTO result
  FROM public.leagues l
  WHERE v_xp >= l.min_xp AND (l.max_xp IS NULL OR v_xp < l.max_xp)
  ORDER BY l.tier DESC
  LIMIT 1;
  
  RETURN result;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_league(UUID) TO authenticated;
