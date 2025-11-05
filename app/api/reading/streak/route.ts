/**
 * Reading Streak API
 * Track user's daily reading streak
 * 
 * MVP Feature - Phase 1 (Gamification - Loss Aversion Psychology)
 */

import { rateLimit, requireAuth } from '@/lib/api/middleware'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

/**
 * GET /api/reading/streak
 * Get user's current streak
 */
export async function GET() {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        // Rate limiting
        const { success } = await rateLimit(`streak-get-${user!.id}`, 100)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        const { data, error: dbError } = await supabase!
            .from('users')
            .select('current_streak, last_read_at')
            .eq('id', user!.id)
            .single()

        if (dbError) {
            throw dbError
        }

        const currentStreak = data?.current_streak || 0
        const lastReadAt = data?.last_read_at

        // Check if streak is still valid (read within last 24 hours)
        let isStreakActive = false
        if (lastReadAt) {
            const lastRead = new Date(lastReadAt)
            const now = new Date()
            const hoursSinceLastRead = (now.getTime() - lastRead.getTime()) / (1000 * 60 * 60)
            isStreakActive = hoursSinceLastRead < 24
        }

        return NextResponse.json({
            currentStreak,
            lastReadAt,
            isStreakActive,
            streakStatus: isStreakActive ? 'active' : currentStreak > 0 ? 'at_risk' : 'none'
        })
    } catch (error) {
        logger.error('Failed to fetch streak', error, {
            context: 'GET /api/reading/streak',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to fetch streak' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/reading/streak
 * Update user's streak (called when user reads)
 */
export async function POST() {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        // Rate limiting (prevent spam)
        const { success } = await rateLimit(`streak-post-${user!.id}`, 20)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        // Get current streak data
        const { data: userData, error: userError } = await supabase!
            .from('users')
            .select('current_streak, last_read_at')
            .eq('id', user!.id)
            .single()

        if (userError) {
            throw userError
        }

        const currentStreak = userData?.current_streak || 0
        const lastReadAt = userData?.last_read_at
        const now = new Date()
        const today = now.toISOString().split('T')[0] // YYYY-MM-DD

        let newStreak = currentStreak
        let streakIncreased = false
        let streakBroken = false

        if (!lastReadAt) {
            // First time reading
            newStreak = 1
            streakIncreased = true
        } else {
            const lastRead = new Date(lastReadAt)
            const lastReadDate = lastRead.toISOString().split('T')[0]

            if (lastReadDate === today) {
                // Already read today, no change
                newStreak = currentStreak
            } else {
                const daysSinceLastRead = Math.floor(
                    (now.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24)
                )

                if (daysSinceLastRead === 1) {
                    // Read yesterday, increment streak
                    newStreak = currentStreak + 1
                    streakIncreased = true
                } else if (daysSinceLastRead > 1) {
                    // Missed a day, reset streak
                    newStreak = 1
                    streakBroken = true
                }
            }
        }

        // Update user streak
        const { error: updateError } = await supabase!
            .from('users')
            .update({
                current_streak: newStreak,
                last_read_at: now.toISOString(),
                updated_at: now.toISOString()
            })
            .eq('id', user!.id)

        if (updateError) {
            throw updateError
        }

        logger.info('Streak updated', {
            context: 'POST /api/reading/streak',
            metadata: {
                userId: user!.id,
                oldStreak: currentStreak,
                newStreak,
                streakIncreased,
                streakBroken
            }
        })

        return NextResponse.json({
            success: true,
            currentStreak: newStreak,
            streakIncreased,
            streakBroken,
            lastReadAt: now.toISOString()
        })
    } catch (error) {
        logger.error('Failed to update streak', error, {
            context: 'POST /api/reading/streak',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to update streak' },
            { status: 500 }
        )
    }
}
