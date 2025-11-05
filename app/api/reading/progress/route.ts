/**
 * Reading Progress API
 * Track user's reading progress for books
 * 
 * MVP Feature - Phase 1
 */

import { rateLimit, requireAuth } from '@/lib/api/middleware'
import { updateProgressSchema, validateRequest } from '@/lib/api/schemas'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

/**
 * GET /api/reading/progress?bookId=xxx
 * Get user's reading progress for a specific book
 */
export async function GET(request: Request) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        const { searchParams } = new URL(request.url)
        const bookId = searchParams.get('bookId')

        if (!bookId) {
            return NextResponse.json(
                { error: 'Book ID is required' },
                { status: 400 }
            )
        }

        // Rate limiting
        const { success } = await rateLimit(`progress-get-${user!.id}`, 100)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        const { data, error: dbError } = await supabase!
            .from('user_library')
            .select('*')
            .eq('user_id', user!.id)
            .eq('book_id', bookId)
            .single()

        if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = no rows
            throw dbError
        }

        return NextResponse.json({
            progress: data || null
        })
    } catch (error) {
        logger.error('Failed to fetch reading progress', error, {
            context: 'GET /api/reading/progress',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to fetch progress' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/reading/progress
 * Update user's reading progress
 */
export async function POST(request: Request) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        // Rate limiting
        const { success } = await rateLimit(`progress-post-${user!.id}`, 200)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        // Validate request
        const validation = await validateRequest(request, updateProgressSchema)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            )
        }

        const { bookId, currentPage, progressPercentage } = validation.data

        // Check if book exists
        const { data: book, error: bookError } = await supabase!
            .from('books')
            .select('id, title')
            .eq('id', bookId)
            .single()

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            )
        }

        // Upsert progress
        const now = new Date().toISOString()
        const { data, error: upsertError } = await supabase!
            .from('user_library')
            .upsert({
                user_id: user!.id,
                book_id: bookId,
                current_page: currentPage,
                progress_percentage: progressPercentage,
                status: progressPercentage >= 100 ? 'completed' : 'reading',
                started_at: now, // Will be ignored if record exists
                completed_at: progressPercentage >= 100 ? now : null,
                updated_at: now
            }, {
                onConflict: 'user_id,book_id'
            })
            .select()
            .single()

        if (upsertError) {
            throw upsertError
        }

        logger.info('Reading progress updated', {
            context: 'POST /api/reading/progress',
            metadata: {
                userId: user!.id,
                bookId,
                progress: progressPercentage
            }
        })

        return NextResponse.json({
            success: true,
            progress: data
        })
    } catch (error) {
        logger.error('Failed to update reading progress', error, {
            context: 'POST /api/reading/progress',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to update progress' },
            { status: 500 }
        )
    }
}
