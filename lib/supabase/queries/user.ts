/**
 * User Profile Queries
 * Handles fetching and updating user profile data
 * Merges data from users and profiles tables
 */

import type { Database } from '@/types/database.types'
import { createBrowserClient } from '../client'

type User = Database['public']['Tables']['users']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export interface UserProfile {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    username: string | null
    full_name: string | null
    bio: string | null
    website: string | null
    level: 'beginner' | 'intermediate' | 'advanced'
    language_preference: string
    xp: number
    current_streak: number
    last_read_at: string | null
    subscription_tier: string
    subscription_expires_at: string | null
    created_at: string
    updated_at: string
}

/**
 * Get complete user profile (merged from users + profiles tables)
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createBrowserClient()

    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized')
        }

        // Fetch from both tables in parallel
        const [
            { data: userData, error: userError },
            { data: profileData, error: _profileError }
        ] = await Promise.all([
            supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single(),
            supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
        ])

        if (userError && userError.code !== 'PGRST116') throw userError

        // Merge data (users table is source of truth)
        const mergedProfile: UserProfile = {
            id: userId,
            email: userData?.email || '',
            name: userData?.name || null,
            avatar_url: userData?.avatar_url || profileData?.avatar_url || null,
            username: profileData?.username || null,
            full_name: profileData?.full_name || userData?.name || null,
            bio: profileData?.bio || null,
            website: profileData?.website || null,
            level: profileData?.level || 'beginner',
            language_preference: profileData?.language_preference || 'fa',
            xp: userData?.xp || 0,
            current_streak: userData?.current_streak || 0,
            last_read_at: userData?.last_read_at || null,
            subscription_tier: userData?.subscription_tier || 'free',
            subscription_expires_at: userData?.subscription_expires_at || null,
            created_at: userData?.created_at || profileData?.created_at || new Date().toISOString(),
            updated_at: userData?.updated_at || profileData?.updated_at || new Date().toISOString(),
        }

        return mergedProfile
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return null
    }
}

/**
 * Update user profile (updates both users and profiles tables)
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<{
        name: string
        avatar_url: string
        username: string
        full_name: string
        bio: string
        website: string
        level: 'beginner' | 'intermediate' | 'advanced'
        language_preference: string
    }>
): Promise<{ success: boolean; error?: string }> {
    const supabase = createBrowserClient()

    try {
        const now = new Date().toISOString()

        // Separate updates for each table
        const userUpdates: Partial<User> = {}
        const profileUpdates: Partial<Profile> = {}

        // Map fields to correct tables
        if (updates.name !== undefined) userUpdates.name = updates.name
        if (updates.avatar_url !== undefined) {
            userUpdates.avatar_url = updates.avatar_url
            profileUpdates.avatar_url = updates.avatar_url
        }
        if (updates.username !== undefined) profileUpdates.username = updates.username
        if (updates.full_name !== undefined) profileUpdates.full_name = updates.full_name
        if (updates.bio !== undefined) profileUpdates.bio = updates.bio
        if (updates.website !== undefined) profileUpdates.website = updates.website
        if (updates.level !== undefined) profileUpdates.level = updates.level
        if (updates.language_preference !== undefined) profileUpdates.language_preference = updates.language_preference

        // Update users table if needed
        if (Object.keys(userUpdates).length > 0) {
            const { error: userError } = await supabase
                .from('users')
                .update({ ...userUpdates, updated_at: now })
                .eq('id', userId)

            if (userError) throw userError
        }

        // Update profiles table if needed
        if (Object.keys(profileUpdates).length > 0) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    ...profileUpdates,
                    updated_at: now,
                })

            if (profileError) throw profileError
        }

        return { success: true }
    } catch (error) {
        console.error('Error updating user profile:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'خطا در به‌روزرسانی پروفایل'
        }
    }
}

/**
 * Get user's reading statistics
 */
export async function getUserStats(userId: string) {
    const supabase = createBrowserClient()

    try {
        const [
            { data: libraryData },
            { data: sessionsData },
            { data: vocabularyData },
            { data: highlightsData },
        ] = await Promise.all([
            supabase
                .from('user_library')
                .select('status, current_page')
                .eq('user_id', userId),
            supabase
                .from('reading_sessions')
                .select('pages_read, duration_minutes, created_at')
                .eq('user_id', userId),
            supabase
                .from('vocabulary')
                .select('id')
                .eq('user_id', userId),
            supabase
                .from('highlights')
                .select('id')
                .eq('user_id', userId),
        ])

        type LibraryItem = { status: string; current_page: number }
        type SessionItem = { pages_read: number; duration_minutes: number; created_at: string }

        return {
            totalBooks: libraryData?.length || 0,
            completedBooks: libraryData?.filter((b: LibraryItem) => b.status === 'completed').length || 0,
            readingBooks: libraryData?.filter((b: LibraryItem) => b.status === 'reading').length || 0,
            totalPages: sessionsData?.reduce((sum: number, s: SessionItem) => sum + (s.pages_read || 0), 0) || 0,
            vocabularyCount: vocabularyData?.length || 0,
            highlightsCount: highlightsData?.length || 0,
            recentSessions: sessionsData?.slice(0, 7) || [],
        }
    } catch (error) {
        console.error('Error fetching user stats:', error)
        return null
    }
}
