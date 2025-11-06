-- ============================================
-- GEMINI API KEYS MANAGEMENT
-- ============================================
-- Table to store multiple Gemini API keys for rotation and fallback

CREATE TABLE IF NOT EXISTS gemini_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT, -- Optional name/label for the key
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT -- Optional notes about the key
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_gemini_keys_active ON gemini_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_gemini_keys_usage ON gemini_api_keys(usage_count);
CREATE INDEX IF NOT EXISTS idx_gemini_keys_errors ON gemini_api_keys(error_count);

-- RLS Policies (Admin only)
ALTER TABLE gemini_api_keys ENABLE ROW LEVEL SECURITY;

-- Only admins can view API keys
CREATE POLICY "Admins can view API keys" ON gemini_api_keys
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only admins can insert API keys
CREATE POLICY "Admins can insert API keys" ON gemini_api_keys
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only admins can update API keys
CREATE POLICY "Admins can update API keys" ON gemini_api_keys
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only admins can delete API keys
CREATE POLICY "Admins can delete API keys" ON gemini_api_keys
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gemini_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS gemini_keys_updated_at ON gemini_api_keys;
CREATE TRIGGER gemini_keys_updated_at
  BEFORE UPDATE ON gemini_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_gemini_keys_updated_at();

-- Comments
COMMENT ON TABLE gemini_api_keys IS 'Stores multiple Gemini API keys for rotation and fallback';
COMMENT ON COLUMN gemini_api_keys.key IS 'The actual Gemini API key (encrypted in production)';
COMMENT ON COLUMN gemini_api_keys.is_active IS 'Whether this key is currently active';
COMMENT ON COLUMN gemini_api_keys.usage_count IS 'Number of times this key has been used';
COMMENT ON COLUMN gemini_api_keys.error_count IS 'Number of errors encountered with this key';
COMMENT ON COLUMN gemini_api_keys.last_used_at IS 'Last time this key was used';
