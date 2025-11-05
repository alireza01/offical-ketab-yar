/**
 * Book Content API
 * Load book content from Supabase Storage (NOT database)
 * 
 * MVP Feature - Phase 1 (Performance Optimization - Agent 2 Strategy)
 * 
 * This endpoint loads book content from Storage as JSON files,
 * following the blueprint's optimization strategy:
 * - 1 Storage request vs 500 database queries
 * - Zero database load
 * - Perfect for client-side pagination
 */

import { rateLimit, requireAuth } from '@/lib/api/middleware'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

interface BookContentPage {
    pageNumber: number
    content: string
}

interface BookContent {
    bookId: string
    language: 'en' | 'fa'
    pages: BookContentPage[]
    totalPages: number
}

/**
 * GET /api/books/content/[id]?language=en
 * Load book content from Storage
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error, user, supabase } = await requireAuth()
    if (error) return error

    try {
        const { id: bookId } = await params
        const { searchParams } = new URL(request.url)
        const language = searchParams.get('language') || 'en'

        if (!['en', 'fa'].includes(language)) {
            return NextResponse.json(
                { error: 'Invalid language. Must be "en" or "fa"' },
                { status: 400 }
            )
        }

        // Rate limiting (generous for reading)
        const { success } = await rateLimit(`content-${user!.id}`, 50)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }

        // Get book metadata
        const { data: book, error: bookError } = await supabase!
            .from('books')
            .select('id, title, slug, content_json_url_en, content_json_url_fa, free_preview_pages, total_pages')
            .eq('id', bookId)
            .single()

        if (bookError || !book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            )
        }

        // Check user's subscription for premium content
        const { data: userData } = await supabase!
            .from('users')
            .select('subscription_tier')
            .eq('id', user!.id)
            .single()

        const isPremium = userData?.subscription_tier === 'premium' ||
            userData?.subscription_tier === 'admin'

        // Get content URL from book metadata
        const contentUrl = language === 'en'
            ? book.content_json_url_en
            : book.content_json_url_fa

        if (!contentUrl) {
            return NextResponse.json(
                { error: `Content not available in ${language === 'en' ? 'English' : 'Persian'}` },
                { status: 404 }
            )
        }

        // Load content from Storage
        // Extract file path from URL (format: https://xxx.supabase.co/storage/v1/object/public/book-content/[path])
        const pathMatch = contentUrl.match(/book-content\/(.+)$/)
        if (!pathMatch) {
            logger.error('Invalid content URL format', null, {
                context: 'GET /api/books/content/[id]',
                metadata: { bookId, contentUrl }
            })
            return NextResponse.json(
                { error: 'Invalid content URL' },
                { status: 500 }
            )
        }

        const filePath = pathMatch[1]
        const { data: fileData, error: storageError } = await supabase!
            .storage
            .from('book-content')
            .download(filePath)

        if (storageError || !fileData) {
            logger.error('Failed to load book content from storage', storageError, {
                context: 'GET /api/books/content/[id]',
                metadata: { bookId, filePath }
            })
            return NextResponse.json(
                { error: 'Failed to load book content' },
                { status: 500 }
            )
        }

        // Parse JSON content
        const text = await fileData.text()
        const content: BookContent = JSON.parse(text)

        // Apply free preview limit for non-premium users
        const freePreviewPages = book.free_preview_pages || 20
        let pages = content.pages

        if (!isPremium && pages.length > freePreviewPages) {
            pages = pages.slice(0, freePreviewPages)
        }

        // Set cache headers (Agent 2 optimization)
        const headers = new Headers()
        headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400') // 1 hour client, 24 hours CDN
        headers.set('Content-Type', 'application/json')

        logger.info('Book content loaded', {
            context: 'GET /api/books/content/[id]',
            metadata: {
                userId: user!.id,
                bookId,
                language,
                totalPages: pages.length,
                isPremium
            }
        })

        return NextResponse.json({
            bookId,
            language,
            pages,
            totalPages: pages.length,
            fullBookPages: content.totalPages,
            isPremium,
            isPreview: !isPremium && content.totalPages > freePreviewPages
        }, { headers })
    } catch (error) {
        logger.error('Failed to load book content', error, {
            context: 'GET /api/books/content/[id]',
            metadata: { userId: user!.id }
        })
        return NextResponse.json(
            { error: 'Failed to load book content' },
            { status: 500 }
        )
    }
}
