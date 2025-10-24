/**
 * Book Tracking Utilities
 * 
 * This module provides utilities for tracking book reading behavior:
 * 
 * 1. READ COUNT: Incremented when user reaches 90%+ progress (only once per user)
 * 2. VIEWS COUNT: Incremented each time book detail page is opened
 * 3. PROGRESS: Tracked continuously as user reads
 * 4. COMPLETION: Marked when user reaches 90%+ (triggers read_count increment)
 */

import { createServerClient } from '@/lib/supabase/server'

/**
 * Calculate progress percentage from current page and total pages
 */
export function calculateProgress(currentPage: number, totalPages: number): number {
    if (totalPages === 0) return 0
    return Math.min(Math.round((currentPage / totalPages) * 100 * 100) / 100, 100)
}

/**
 * Check if a book should be marked as completed
 * Completion threshold: 90% progress
 */
export function isBookCompleted(progressPercentage: number): boolean {
    return progressPercentage >= 90
}

/**
 * Format reading time (minutes to human readable)
 */
export function formatReadingTime(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} دقیقه`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
        return `${hours} ساعت`
    }

    return `${hours} ساعت و ${remainingMinutes} دقیقه`
}

/**
 * Estimate reading time based on page count
 * Average reading speed: 2 minutes per page
 */
export function estimateReadingTime(totalPages: number): string {
    const minutes = totalPages * 2
    return formatReadingTime(minutes)
}

/**
 * Calculate reading streak from activity dates
 */
export function calculateReadingStreak(activityDates: Date[]): number {
    if (activityDates.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sortedDates = activityDates
        .map(d => {
            const date = new Date(d)
            date.setHours(0, 0, 0, 0)
            return date.getTime()
        })
        .sort((a, b) => b - a)

    const uniqueDates = [...new Set(sortedDates)]

    let streak = 0
    let currentDate = today.getTime()

    for (const date of uniqueDates) {
        if (date === currentDate) {
            streak++
            currentDate -= 24 * 60 * 60 * 1000 // Go back one day
        } else if (date < currentDate) {
            break // Streak is broken
        }
    }

    return streak
}

/**
 * Get book popularity score (for sorting/recommendations)
 * Combines views, reads, and ratings
 */
export function calculatePopularityScore(
    viewsCount: number,
    readCount: number,
    rating: number | null
): number {
    const viewsScore = viewsCount * 0.1
    const readsScore = readCount * 10
    const ratingScore = (rating || 0) * 20

    return viewsScore + readsScore + ratingScore
}

/**
 * Get trending score (recent activity weighted more)
 * Used for "trending books" section
 */
export function calculateTrendingScore(
    recentViews: number,
    recentReads: number,
    rating: number | null
): number {
    const viewsScore = recentViews * 0.5
    const readsScore = recentReads * 15
    const ratingScore = (rating || 0) * 10

    return viewsScore + readsScore + ratingScore
}

/**
 * Track book view (call this when user opens book detail page)
 */
export async function trackBookView(bookId: string, userId?: string) {
    try {
        const supabase = await createServerClient()

        // Generate session ID if not provided
        const sessionId = typeof window !== 'undefined'
            ? window.sessionStorage.getItem('session_id') || generateSessionId()
            : null

        if (sessionId && typeof window !== 'undefined') {
            window.sessionStorage.setItem('session_id', sessionId)
        }

        // Track detailed view
        await supabase.rpc('track_book_view', {
            p_book_id: bookId,
            p_user_id: userId || null,
            p_session_id: sessionId,
        })

        return { success: true }
    } catch (error) {
        console.error('Error tracking book view:', error)
        return { success: false, error }
    }
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get reading statistics for analytics
 */
export async function getBookAnalytics(bookId: string) {
    try {
        const supabase = await createServerClient()

        const { data, error } = await supabase
            .from('book_analytics')
            .select('*')
            .eq('id', bookId)
            .single()

        if (error) {
            console.error('Error getting book analytics:', error)
            return { success: false, error: error.message }
        }

        return { success: true, analytics: data }
    } catch (error) {
        console.error('Error in getBookAnalytics:', error)
        return { success: false, error: 'Failed to get analytics' }
    }
}

/**
 * Get trending books (based on recent activity)
 */
export async function getTrendingBooks(limit: number = 12) {
    try {
        const supabase = await createServerClient()

        const { data, error } = await supabase
            .from('book_analytics')
            .select('*')
            .order('views_last_7_days', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error getting trending books:', error)
            return { success: false, error: error.message }
        }

        return { success: true, books: data }
    } catch (error) {
        console.error('Error in getTrendingBooks:', error)
        return { success: false, error: 'Failed to get trending books' }
    }
}
