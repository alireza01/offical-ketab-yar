-- ============================================
-- COMPLETE PERSISTENCE SYSTEM FOR KETAB-YAR
-- Everything persists: progress, settings, highlights, vocabulary
-- ============================================

-- 1. READING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  current_page INTEGER NOT NULL DEFAULT 0,
  total_pages INTEGER,
  progress_percentage INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_slug)
);

-- 2. READER SETTINGS TABLE (per book)
CREATE TABLE IF NOT EXISTS reader_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  font_size INTEGER DEFAULT 20,
  line_height DECIMAL DEFAULT 1.8,
  letter_spacing DECIMAL DEFAULT 0,
  theme TEXT DEFAULT 'sepia', -- 'light', 'sepia', 'dark'
  physics_page_turn BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_slug)
);

-- 3. HIGHLIGHTS TABLE
CREATE TABLE IF NOT EXISTS highlights (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  page INTEGER NOT NULL,
  text TEXT NOT NULL,
  color TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VOCABULARY TABLE
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  definition TEXT,
  translation TEXT,
  book_slug TEXT,
  page INTEGER,
  context TEXT,
  mastery_level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, word, book_slug)
);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  page INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_slug, page)
);

-- 6. GLOBAL USER PREFERENCES
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_theme TEXT DEFAULT 'sepia',
  default_font_size INTEGER DEFAULT 20,
  default_line_height DECIMAL DEFAULT 1.8,
  default_letter_spacing DECIMAL DEFAULT 0,
  physics_page_turn_enabled BOOLEAN DEFAULT false,
  sound_effects_enabled BOOLEAN DEFAULT true,
  auto_save_enabled BOOLEAN DEFAULT true,
  language_preference TEXT DEFAULT 'fa', -- 'en' or 'fa'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book ON reading_progress(book_slug);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_book ON reading_progress(user_id, book_slug);

CREATE INDEX IF NOT EXISTS idx_reader_settings_user ON reader_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_reader_settings_book ON reader_settings(book_slug);

CREATE INDEX IF NOT EXISTS idx_highlights_user ON highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_book ON highlights(book_slug);
CREATE INDEX IF NOT EXISTS idx_highlights_user_book ON highlights(user_id, book_slug);

CREATE INDEX IF NOT EXISTS idx_vocabulary_user ON vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON vocabulary(word);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_book ON bookmarks(book_slug);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Reading Progress
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON reading_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON reading_progress FOR DELETE USING (auth.uid() = user_id);

-- Reader Settings
ALTER TABLE reader_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own settings" ON reader_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON reader_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON reader_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own settings" ON reader_settings FOR DELETE USING (auth.uid() = user_id);

-- Highlights
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own highlights" ON highlights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own highlights" ON highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own highlights" ON highlights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own highlights" ON highlights FOR DELETE USING (auth.uid() = user_id);

-- Vocabulary
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own vocabulary" ON vocabulary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vocabulary" ON vocabulary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vocabulary" ON vocabulary FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vocabulary" ON vocabulary FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- User Preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON user_preferences FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS FOR AUTO-UPDATE
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reader_settings_updated_at BEFORE UPDATE ON reader_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE reading_progress IS 'Tracks user reading progress per book';
COMMENT ON TABLE reader_settings IS 'Stores per-book reader settings (font, theme, etc.)';
COMMENT ON TABLE highlights IS 'User text highlights from books';
COMMENT ON TABLE vocabulary IS 'User saved vocabulary words';
COMMENT ON TABLE bookmarks IS 'User bookmarks in books';
COMMENT ON TABLE user_preferences IS 'Global user preferences across all books';
