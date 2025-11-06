'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProfileHeader } from './profile-header'
import { ProfileTabs } from './profile-tabs'

interface Profile {
    id: string
    username?: string
    full_name?: string
    avatar_url?: string
    bio?: string
    website?: string
    level?: string
    created_at: string
}

interface UserStats {
    xp: number
    level: number
    current_streak: number
    longest_streak: number
    total_books_read: number
    total_pages_read: number
    total_reading_time: number
}

export default function ProfileClient() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [userStats, setUserStats] = useState<UserStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user
                const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()

                if (userError || !authUser) {
                    router.push('/auth/login')
                    return
                }

                setUser(authUser)

                // Get profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                if (profileError) {
                    console.error('Profile error:', profileError)
                    setError('خطا در بارگذاری پروفایل')
                } else {
                    setProfile(profileData)
                }

                // Get user stats (mock data for now - will be real when table exists)
                // TODO: Replace with real query when user_stats table is created
                setUserStats({
                    xp: 1250,
                    level: 7,
                    current_streak: 15,
                    longest_streak: 21,
                    total_books_read: 5,
                    total_pages_read: 1234,
                    total_reading_time: 754, // minutes
                })

            } catch (err) {
                console.error('Error fetching data:', err)
                setError('خطا در بارگذاری اطلاعات')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [router, supabase])

    if (isLoading) {
        return null // Skeleton is shown by parent
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!user || !profile) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Agent 3: Hero section with gamification */}
            <ProfileHeader
                user={user}
                profile={profile}
                userStats={userStats || { xp: 0, level: 1, current_streak: 0, longest_streak: 0, total_books_read: 0, total_pages_read: 0, total_reading_time: 0 }}
            />

            {/* Agent 3: Tabbed interface for organization */}
            <ProfileTabs
                user={user}
                profile={profile}
                userStats={userStats || { xp: 0, level: 1, current_streak: 0, longest_streak: 0, total_books_read: 0, total_pages_read: 0, total_reading_time: 0 }}
            />
        </div>
    )
}
