/**
 * Vocabulary API
 * CRUD operations for user's saved vocabulary words
 * 
 * MVP Feature - Phase 1 (Learning Tools)
 * Free tier: 20 words limit
 */

import { rateLimit, requireAuth } from '@/lib/api/middleware'
import { createVocabularySchema, validateRequest } from '@/lib/api/schemas'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

const FREE_TIER_WORD_LIMIT = 20

/**
 * GET /api/vocabulary
 * Get user's saved vocabulary words
 */
export async function GET(request: Request) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        const { searchParams } = new URL(request.url)
        const bookId = searchParams.get('bookId')
        const limit = parseInt(searchParams.get('limit') || '100')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Rate limiting
        const { success } = await rateLimit(`vocab-get-${user!.id}`, 100)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        let query = supabase!
            .from('vocabulary')
            .select('*, books(title, slug)', { count: 'exact' })
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (bookId) {
            query = query.eq('book_id', bookId)
        }

        const { data, error: dbError, count } = await query

        if (dbError) {
            throw dbError
        }

        // Get user's subscription tier to check limit
        const { data: userData } = await supabase!
            .from('users')
            .select('subscription_tier')
            .eq('id', user!.id)
            .single()

        const isFreeTier = !userData?.subscription_tier || userData.subscription_tier === 'free'
        const wordLimit = isFreeTier ? FREE_TIER_WORD_LIMIT : null

        return NextResponse.json({
            words: data || [],
            total: count || 0,
            limit: wordLimit,
            canAddMore: wordLimit ? (count || 0) < wordLimit : true
        })
    } catch (error) {
        logger.error('Failed to fetch vocabulary', error, {
            context: 'GET /api/vocabulary',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to fetch vocabulary' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/vocabulary
 * Add a new word to vocabulary
 */
export async function POST(request: Request) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        // Rate limiting
        const { success } = await rateLimit(`vocab-post-${user!.id}`, 50)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        // Validate request
        const validation = await validateRequest(request, createVocabularySchema)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            )
        }

        const { word, definition, bookId, context } = validation.data

        // Check user's subscription tier
        const { data: userData } = await supabase!
            .from('users')
            .select('subscription_tier')
            .eq('id', user!.id)
            .single()

        const isFreeTier = !userData?.subscription_tier || userData.subscription_tier === 'free'

        // Check word count for free tier
        if (isFreeTier) {
            const { count } = await supabase!
                .from('vocabulary')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user!.id)

            if (count && count >= FREE_TIER_WORD_LIMIT) {
                return NextResponse.json(
                    {
                        error: 'Word limit reached',
                        message: `Free tier is limited to ${FREE_TIER_WORD_LIMIT} words. Upgrade to Premium for unlimited vocabulary.`,
                        limit: FREE_TIER_WORD_LIMIT,
                        current: count
                    },
                    { status: 403 }
                )
            }
        }

        // Check if word already exists for this user
        const { data: existing } = await supabase!
            .from('vocabulary')
            .select('id')
            .eq('user_id', user!.id)
            .eq('word', word.toLowerCase())
            .maybeSingle()

        if (existing) {
            return NextResponse.json(
                { error: 'Word already in your vocabulary' },
                { status: 409 }
            )
        }

        // Add word
        const { data, error: insertError } = await supabase!
            .from('vocabulary')
            .insert({
                user_id: user!.id,
                word: word.toLowerCase(),
                definition,
                book_id: bookId,
                context,
                mastery_level: 0,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (insertError) {
            throw insertError
        }

        logger.info('Vocabulary word added', {
            context: 'POST /api/vocabulary',
            metadata: { userId: user!.id, word }
        })

        return NextResponse.json({
            success: true,
            word: data
        })
    } catch (error) {
        logger.error('Failed to add vocabulary word', error, {
            context: 'POST /api/vocabulary',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to add word' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/vocabulary?id=xxx
 * Delete a vocabulary word
 */
export async function DELETE(request: Request) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Word ID is required' },
                { status: 400 }
            )
        }

        // Rate limiting
        const { success } = await rateLimit(`vocab-delete-${user!.id}`, 50)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        // Delete word (only if it belongs to the user)
        const { error: deleteError } = await supabase!
            .from('vocabulary')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id)

        if (deleteError) {
            throw deleteError
        }

        logger.info('Vocabulary word deleted', {
            context: 'DELETE /api/vocabulary',
            metadata: { userId: user!.id, wordId: id }
        })

        return NextResponse.json({
            success: true
        })
    } catch (error) {
        logger.error('Failed to delete vocabulary word', error, {
            context: 'DELETE /api/vocabulary',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to delete word' },
            { status: 500 }
        )
    }
}
