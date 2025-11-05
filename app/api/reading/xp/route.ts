/**
 * XP (Experience Points) API
 * Award XP to users for reading activities
 * 
 * MVP Feature - Phase 1 (Gamification)
 */

import { rateLimit, requireAuth } from '@/lib/api/middleware'
import { awardXpSchema, validateRequest } from '@/lib/api/schemas'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

/**
 * GET /api/reading/xp
 * Get user's current XP and level
 */
export async function GET() {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        // Rate limiting
        const { success } = await rateLimit(`xp-get-${user!.id}`, 100)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        const { data, error: dbError } = await supabase!
            .from('users')
            .select('xp')
            .eq('id', user!.id)
            .single()

        if (dbError) {
            throw dbError
        }

        const xp = data?.xp || 0
        const level = Math.floor(xp / 100) + 1 // Simple level calculation: 100 XP per level

        return NextResponse.json({
            xp,
            level,
            xpToNextLevel: (level * 100) - xp
        })
    } catch (error) {
        logger.error('Failed to fetch XP', error, {
            context: 'GET /api/reading/xp',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to fetch XP' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/reading/xp
 * Award XP to user
 */
export async function POST(request: Request) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        // Rate limiting (stricter for XP awards to prevent abuse)
        const { success } = await rateLimit(`xp-post-${user!.id}`, 50)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        // Validate request
        const validation = await validateRequest(request, awardXpSchema)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            )
        }

        const { bookId, xpAmount, reason } = validation.data

        // Get current XP
        const { data: userData, error: userError } = await supabase!
            .from('users')
            .select('xp')
            .eq('id', user!.id)
            .single()

        if (userError) {
            throw userError
        }

        const currentXp = userData?.xp || 0
        const newXp = currentXp + xpAmount

        // Update user XP
        const { error: updateError } = await supabase!
            .from('users')
            .update({
                xp: newXp,
                updated_at: new Date().toISOString()
            })
            .eq('id', user!.id)

        if (updateError) {
            throw updateError
        }

        // Calculate level
        const oldLevel = Math.floor(currentXp / 100) + 1
        const newLevel = Math.floor(newXp / 100) + 1
        const leveledUp = newLevel > oldLevel

        logger.info('XP awarded', {
            context: 'POST /api/reading/xp',
            metadata: {
                userId: user!.id,
                bookId,
                xpAmount,
                reason,
                newXp,
                leveledUp
            }
        })

        return NextResponse.json({
            success: true,
            xp: newXp,
            xpAwarded: xpAmount,
            level: newLevel,
            leveledUp,
            reason
        })
    } catch (error) {
        logger.error('Failed to award XP', error, {
            context: 'POST /api/reading/xp',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to award XP' },
            { status: 500 }
        )
    }
}
