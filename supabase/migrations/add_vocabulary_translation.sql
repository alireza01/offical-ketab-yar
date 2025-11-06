-- Add translation column to vocabulary table if it doesn't exist
ALTER TABLE vocabulary 
ADD COLUMN IF NOT EXISTS translation TEXT;

-- Add index for faster word lookups
CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON vocabulary(word);

-- Add index for user vocabulary queries
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_word ON vocabulary(user_id, word);

-- Update RLS policies to ensure users can only access their own vocabulary
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own vocabulary
CREATE POLICY IF NOT EXISTS "Users can view own vocabulary"
ON vocabulary FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own vocabulary
CREATE POLICY IF NOT EXISTS "Users can insert own vocabulary"
ON vocabulary FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own vocabulary
CREATE POLICY IF NOT EXISTS "Users can update own vocabulary"
ON vocabulary FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own vocabulary
CREATE POLICY IF NOT EXISTS "Users can delete own vocabulary"
ON vocabulary FOR DELETE
USING (auth.uid() = user_id);
