-- Create highlights table for storing user highlights
CREATE TABLE IF NOT EXISTS highlights (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  page INTEGER NOT NULL,
  text TEXT NOT NULL,
  color TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_highlights_user_id ON highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_book_slug ON highlights(book_slug);
CREATE INDEX IF NOT EXISTS idx_highlights_user_book ON highlights(user_id, book_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own highlights
CREATE POLICY "Users can view their own highlights"
  ON highlights
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own highlights"
  ON highlights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own highlights"
  ON highlights
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights"
  ON highlights
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE highlights IS 'Stores user text highlights from book reader';
