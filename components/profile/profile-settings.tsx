'use client'

import { ProfileForm } from './profile-form'

interface ProfileSettingsProps {
    user: any
    profile: any
}

export default function ProfileSettings({ user, profile }: ProfileSettingsProps) {
    return (
        <div className="max-w-2xl">
            <ProfileForm user={user} profile={profile} />
        </div>
    )
}
