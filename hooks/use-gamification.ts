"use client"

import { logger } from '@/lib/logger'
import { createBrowserClient } from '@/lib/supabase/client'
import { useGamificationStore } from '@/stores/gamification-store'
import {
    calculateLevel,
    calculateReadingXP,
    isStreakActive,
    type UserGamification
} from '@/types/gamification'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

/**
 * Enhanced hook for managing user gamification data (XP, streaks, levels)
 * Implements Agent 3's psychology strategy with immediate feedback
 * Implements Agent 2's performance optimizations
 */
export function useGamification(userId: string | undefined) {
    const queryClient = useQueryClient()
    const { showXPReward, updateStreak } = useGamificationStore()
    const [isInitialized, setIsInitialized] = useState(false)

    // 🔥 AGENT 2 FIX: Use singleton client directly (no useMemo needed)
    // createBrowserClient() now returns the same instance every time
    const supabase = createBrowserClient()

    // Fetch user gamification data
    const { data: gamificationData, isLoading, error } = useQuery({
        queryKey: ['gamification', userId],
        queryFn: async (): Promise<UserGamification | null> => {
            console.log('🎮 useGamification query running for userId:', userId)
            if (!userId) return null
            const { data, error } = await supabase
                .from('users')
                .select('xp, current_streak, last_read_at')
                .eq('id', userId)
                .single()

            if (error) {
                logger.error('Failed to fetch gamification data', error)
                throw error
            }

            const xp = data.xp || 0
            const levelInfo = calculateLevel(xp)
            const streakActive = isStreakActive(data.last_read_at)

            return {
                xp,
                current_streak: streakActive ? (data.current_streak || 0) : 0,
                last_read_at: data.last_read_at,
                level: levelInfo.current,
                xp_to_next_level: levelInfo.xp_required,
                xp_progress_percentage: levelInfo.progress_percentage,
            }
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    // Initialize store with data
    useEffect(() => {
        if (gamificationData && !isInitialized) {
            updateStreak(gamificationData.current_streak)
            setIsInitialized(true)
        }
    }, [gamificationData, isInitialized, updateStreak])

    // Add XP mutation with optimistic updates (Agent 2 + Agent 3)
    const addXPMutation = useMutation({
        mutationFn: async ({ amount, reason }: { amount: number; reason: string }) => {
            if (!userId) throw new Error('User not authenticated')

            // Call database function to add XP
            const { data, error } = await supabase.rpc('add_user_xp', {
                p_user_id: userId,
                p_xp_amount: amount,
            })

            if (error) throw error

            return { newXP: data, amount, reason }
        },
        onSuccess: ({ newXP, amount, reason }) => {
            // Show XP reward animation (Agent 3 psychology)
            showXPReward(amount, reason)

            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['gamification', userId] })

            logger.info('XP added successfully', {
                context: 'useGamification',
                metadata: { amount, reason, newXP }
            })
        },
        onError: (error) => {
            logger.error('Failed to add XP', error, { context: 'useGamification' })
        },
    })

    // Update streak mutation with optimistic updates
    const updateStreakMutation = useMutation({
        mutationFn: async () => {
            if (!userId) throw new Error('User not authenticated')

            // Call database function to update streak
            const { data, error } = await supabase.rpc('update_user_streak', {
                p_user_id: userId,
            })

            if (error) throw error

            return data as number
        },
        onSuccess: (newStreak) => {
            // Update store for immediate UI feedback
            updateStreak(newStreak)

            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['gamification', userId] })

            logger.info('Streak updated', {
                context: 'useGamification',
                metadata: { newStreak }
            })
        },
        onError: (error) => {
            logger.error('Failed to update streak', error, { context: 'useGamification' })
        },
    })

    // Record reading session with proper error handling
    const recordReadingSession = useMutation({
        mutationFn: async ({
            bookId,
            pagesRead,
            durationMinutes,
        }: {
            bookId: string
            pagesRead: number
            durationMinutes: number
        }) => {
            if (!userId) throw new Error('User not authenticated')

            const xpEarned = calculateReadingXP(pagesRead, durationMinutes)

            // Insert reading session
            const { error } = await supabase
                .from('reading_sessions')
                .insert({
                    user_id: userId,
                    book_id: bookId,
                    pages_read: pagesRead,
                    duration_minutes: durationMinutes,
                    xp_earned: xpEarned,
                })

            if (error) throw error

            return { xpEarned, pagesRead }
        },
        onSuccess: ({ xpEarned, pagesRead }) => {
            // Add XP
            addXPMutation.mutate({
                amount: xpEarned,
                reason: `${pagesRead} صفحه مطالعه`,
            })

            // Update streak
            updateStreakMutation.mutate()
        },
        onError: (error) => {
            logger.error('Failed to record reading session', error, {
                context: 'useGamification'
            })
        },
    })

    return {
        gamificationData,
        isLoading,
        error,
        addXP: addXPMutation.mutate,
        updateStreak: updateStreakMutation.mutate,
        recordReadingSession: recordReadingSession.mutate,
        isAddingXP: addXPMutation.isPending,
        isUpdatingStreak: updateStreakMutation.isPending,
    }
}

/**
 * Enhanced hook for fetching reading statistics
 * Implements Agent 2's performance optimization with singleton client
 */
export function useReadingStats(userId: string | undefined) {
    // 🔥 AGENT 2 FIX: Use singleton client directly
    const supabase = createBrowserClient()

    return useQuery({
        queryKey: ['reading-stats', userId],
        queryFn: async () => {
            if (!userId) return null

            // Get user library stats
            const { data: libraryData } = await supabase
                .from('user_library')
                .select('status, current_page, books:book_id(page_count)')
                .eq('user_id', userId)

            const totalBooks = libraryData?.length || 0
            const completedBooks = libraryData?.filter(b => b.status === 'completed').length || 0
            const readingBooks = libraryData?.filter(b => b.status === 'reading').length || 0
            const totalPages = libraryData?.reduce((sum, b) => sum + (b.current_page || 0), 0) || 0

            // Get recent reading sessions
            const { data: sessions } = await supabase
                .from('reading_sessions')
                .select('xp_earned, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(7)

            return {
                totalBooks,
                completedBooks,
                readingBooks,
                totalPages,
                recentSessions: sessions || [],
            }
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
