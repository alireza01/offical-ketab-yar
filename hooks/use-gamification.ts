/**
 * Gamification Hook
 * Agent 2 (Performance): Debounced updates, client-side calculations
 * Agent 3 (Psychology): Immediate feedback, celebration triggers
 */

'use client'

import {
    getAchievementsWithProgress,
    getStreakInfo,
    getUserStats,
    updateUserStats,
} from '@/lib/supabase/queries/gamification'
import type {
    AchievementWithProgress,
    GamificationUpdate,
    StreakInfo,
    UserStats,
    XPGainResult,
} from '@/types/gamification'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseGamificationOptions {
    autoLoad?: boolean
    debounceMs?: number
}

export function useGamification(options: UseGamificationOptions = {}) {
    const { autoLoad = true, debounceMs = 5000 } = options

    const [stats, setStats] = useState<UserStats | null>(null)
    const [achievements, setAchievements] = useState<AchievementWithProgress[]>([])
    const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Pending updates (Agent 2: Batch updates)
    const pendingUpdates = useRef<GamificationUpdate>({})
    const updateTimeout = useRef<NodeJS.Timeout | null>(null)

    // Celebration triggers (Agent 3: Psychology)
    const [xpReward, setXPReward] = useState<number | null>(null)
    const [levelUpData, setLevelUpData] = useState<XPGainResult | null>(null)
    const [newAchievements, setNewAchievements] = useState<
        AchievementWithProgress[]
    >([])

    // Load initial data
    const loadData = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const [statsResult, achievementsResult, streakResult] = await Promise.all([
                getUserStats(),
                getAchievementsWithProgress(),
                getStreakInfo(),
            ])

            if (statsResult.success && statsResult.stats) {
                setStats(statsResult.stats)
            }

            if (achievementsResult.success && achievementsResult.achievements) {
                setAchievements(achievementsResult.achievements)
            }

            if (streakResult.success && streakResult.streak) {
                setStreakInfo(streakResult.streak)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (autoLoad) {
            loadData()
        }
    }, [autoLoad, loadData])

    // Flush pending updates to database
    const flushUpdates = useCallback(async () => {
        if (Object.keys(pendingUpdates.current).length === 0) return

        const updates = { ...pendingUpdates.current }
        pendingUpdates.current = {}

        const result = await updateUserStats(updates)

        if (result.success) {
            // Update local state
            if (result.stats) {
                setStats(result.stats)
            }

            if (result.streak_info) {
                setStreakInfo(result.streak_info)
            }

            // Trigger celebrations (Agent 3)
            if (result.xp_result) {
                setXPReward(result.xp_result.xp_gained)

                if (result.xp_result.level_up) {
                    setLevelUpData(result.xp_result)
                }
            }

            if (result.new_achievements && result.new_achievements.length > 0) {
                // Reload achievements to get updated progress
                const achievementsResult = await getAchievementsWithProgress()
                if (achievementsResult.success && achievementsResult.achievements) {
                    setAchievements(achievementsResult.achievements)

                    // Find the newly earned achievements
                    const newlyEarned = achievementsResult.achievements.filter((a) =>
                        result.new_achievements?.some((na) => na.id === a.id)
                    )
                    setNewAchievements(newlyEarned)
                }
            }
        } else {
            setError(result.error || 'Failed to update stats')
        }
    }, [])

    // Add update to pending queue (Agent 2: Debouncing)
    const queueUpdate = useCallback(
        (update: GamificationUpdate) => {
            // Merge with pending updates
            pendingUpdates.current = {
                xp_gained:
                    (pendingUpdates.current.xp_gained || 0) + (update.xp_gained || 0),
                pages_read:
                    (pendingUpdates.current.pages_read || 0) + (update.pages_read || 0),
                reading_time:
                    (pendingUpdates.current.reading_time || 0) +
                    (update.reading_time || 0),
                book_completed:
                    pendingUpdates.current.book_completed || update.book_completed,
            }

            // Clear existing timeout
            if (updateTimeout.current) {
                clearTimeout(updateTimeout.current)
            }

            // Set new timeout
            updateTimeout.current = setTimeout(() => {
                flushUpdates()
            }, debounceMs)
        },
        [debounceMs, flushUpdates]
    )

    // Immediate update (for important events like book completion)
    const updateImmediately = useCallback(
        async (update: GamificationUpdate) => {
            // Clear pending updates
            if (updateTimeout.current) {
                clearTimeout(updateTimeout.current)
            }

            // Merge with pending
            const finalUpdate = {
                xp_gained:
                    (pendingUpdates.current.xp_gained || 0) + (update.xp_gained || 0),
                pages_read:
                    (pendingUpdates.current.pages_read || 0) + (update.pages_read || 0),
                reading_time:
                    (pendingUpdates.current.reading_time || 0) +
                    (update.reading_time || 0),
                book_completed:
                    pendingUpdates.current.book_completed || update.book_completed,
            }

            pendingUpdates.current = {}

            const result = await updateUserStats(finalUpdate)

            if (result.success) {
                if (result.stats) setStats(result.stats)
                if (result.streak_info) setStreakInfo(result.streak_info)

                if (result.xp_result) {
                    setXPReward(result.xp_result.xp_gained)
                    if (result.xp_result.level_up) {
                        setLevelUpData(result.xp_result)
                    }
                }

                if (result.new_achievements && result.new_achievements.length > 0) {
                    const achievementsResult = await getAchievementsWithProgress()
                    if (achievementsResult.success && achievementsResult.achievements) {
                        setAchievements(achievementsResult.achievements)
                        const newlyEarned = achievementsResult.achievements.filter((a) =>
                            result.new_achievements?.some((na) => na.id === a.id)
                        )
                        setNewAchievements(newlyEarned)
                    }
                }
            } else {
                setError(result.error || 'Failed to update stats')
            }

            return result
        },
        [flushUpdates]
    )

    // Track page read (debounced)
    const trackPageRead = useCallback(
        (pages: number = 1) => {
            queueUpdate({ pages_read: pages })
        },
        [queueUpdate]
    )

    // Track reading time (debounced)
    const trackReadingTime = useCallback(
        (minutes: number) => {
            queueUpdate({ reading_time: minutes })
        },
        [queueUpdate]
    )

    // Track book completion (immediate)
    const trackBookCompletion = useCallback(async () => {
        return await updateImmediately({ book_completed: true })
    }, [updateImmediately])

    // Clear celebration states
    const clearXPReward = useCallback(() => setXPReward(null), [])
    const clearLevelUp = useCallback(() => setLevelUpData(null), [])
    const clearNewAchievements = useCallback(() => setNewAchievements([]), [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (updateTimeout.current) {
                clearTimeout(updateTimeout.current)
                flushUpdates()
            }
        }
    }, [flushUpdates])

    return {
        // Data
        stats,
        achievements,
        streakInfo,
        isLoading,
        error,

        // Actions
        loadData,
        trackPageRead,
        trackReadingTime,
        trackBookCompletion,
        updateImmediately,

        // Celebrations (Agent 3)
        xpReward,
        levelUpData,
        newAchievements,
        clearXPReward,
        clearLevelUp,
        clearNewAchievements,

        // Computed values
        level: stats?.level || 1,
        xp: stats?.xp || 0,
        currentStreak: stats?.current_streak || 0,
        longestStreak: stats?.longest_streak || 0,
        totalBooksCompleted: stats?.total_books_completed || 0,
        totalPagesRead: stats?.total_pages_read || 0,
    }
}
