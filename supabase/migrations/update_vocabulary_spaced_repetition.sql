-- Add spaced repetition fields to vocabulary table
ALTER TABLE vocabulary 
ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS context_before TEXT,
ADD COLUMN IF NOT EXISTS context_after TEXT;

-- Add index for efficient spaced repetition queries
CREATE INDEX IF NOT EXISTS idx_vocabulary_next_review 
ON vocabulary(user_id, next_review_at);

CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery 
ON vocabulary(user_id, mastery_level);

-- Update existing records to set initial review dates
UPDATE vocabulary 
SET 
  last_reviewed_at = created_at,
  next_review_at = created_at + INTERVAL '1 day'
WHERE last_reviewed_at IS NULL;
