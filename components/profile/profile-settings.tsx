'use client'

import type { User } from '@supabase/supabase-js'
import { ProfileForm } from './profile-form'

interface Profile {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
}

interface ProfileSettingsProps {
    user: User
    profile: Profile
}

export default function ProfileSettings({ user, profile }: ProfileSettingsProps) {
    // Convert partial profile to full profile with defaults
    const fullProfile: Profile = {
        id: profile.id,
        username: profile.username || null,
        full_name: profile.full_name || null,
        avatar_url: profile.avatar_url || null,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString(),
    }

    return (
        <div className="max-w-2xl">
            <ProfileForm user={user} profile={fullProfile} />
        </div>
    )
}
