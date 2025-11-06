-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'test_user'));

-- Add banned status
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_reason TEXT;

-- Add admin tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS made_admin_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS made_admin_at TIMESTAMP WITH TIME ZONE;

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON profiles(is_banned);

-- Create admin_actions table for audit log
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action_type TEXT NOT NULL, -- 'ban_user', 'unban_user', 'make_admin', 'remove_admin', 'create_test_user'
    target_user_id UUID REFERENCES auth.users(id),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- RLS Policies
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all actions" ON admin_actions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert actions" ON admin_actions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Update profiles RLS to allow admins to manage users
CREATE POLICY "Admins can update any profile" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles AS admin_profile
            WHERE admin_profile.id = auth.uid()
            AND admin_profile.role = 'admin'
        )
    );

-- Create gemini_api_keys table if not exists (for AI keys management)
CREATE TABLE IF NOT EXISTS gemini_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    name TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gemini_keys_active ON gemini_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_gemini_keys_usage ON gemini_api_keys(usage_count);

-- RLS for API keys
ALTER TABLE gemini_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage API keys" ON gemini_api_keys
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_action_type TEXT,
    p_target_user_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_action_id UUID;
BEGIN
    INSERT INTO admin_actions (admin_id, action_type, target_user_id, details)
    VALUES (auth.uid(), p_action_type, p_target_user_id, p_details)
    RETURNING id INTO v_action_id;
    
    RETURN v_action_id;
END;
$$;
