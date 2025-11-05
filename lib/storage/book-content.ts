/**
 * Book Content Storage Manager
 * 
 * Agent 2 (Performance): All book content operations use Supabase Storage
 * This replaces the old book_content table approach
 * 
 * Benefits:
 * - 1 request instead of 500 queries
 * - Zero database load
 * - Perfect for AI integration (full context)
 * - Easy offline download
 */

'use server'

import { logger } from '@/lib/logger'
import { createServerClient } from '@/lib/supabase/server'

export interface BookContent {
    bookId: string
    language: 'en' | 'fa'
    pages: string[]
    metadata?: {
        totalPages: number
        wordsPerPage: number
        estimatedReadingTime: number
    }
}

/**
 * Upload book content to Supabase Storage
 * Used by admin panel when publishing books
 */
export async function uploadBookContent(
    bookId: string,
    language: 'en' | 'fa',
    content: BookContent
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createServerClient()

        // Convert to JSON
        const jsonContent = JSON.stringify(content, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })

        // Upload to Storage
        const fileName = `${bookId}-${language}.json`
        const { error } = await supabase.storage
            .from('book-content')
            .upload(fileName, blob, {
                contentType: 'application/json',
                upsert: true, // Overwrite if exists
            })

        if (error) {
            logger.error('Failed to upload book content', error, { context: 'uploadBookContent', bookId })
            return { success: false, error: error.message }
        }

        logger.info('Book content uploaded successfully', { context: 'uploadBookContent', bookId, language })
        return { success: true }
    } catch (error) {
        logger.error('Error uploading book content', error, { context: 'uploadBookContent' })
        return { success: false, error: 'Failed to upload book content' }
    }
}

/**
 * Download book content from Supabase Storage
 * Used by reader page
 */
export async function downloadBookContent(
    bookId: string,
    language: 'en' | 'fa'
): Promise<BookContent | null> {
    try {
        const supabase = await createServerClient()

        const fileName = `${bookId}-${language}.json`
        const { data, error } = await supabase.storage
            .from('book-content')
            .download(fileName)

        if (error) {
            logger.error('Failed to download book content', error, { context: 'downloadBookContent', bookId })
            return null
        }

        const text = await data.text()
        const content = JSON.parse(text) as BookContent

        return content
    } catch (error) {
        logger.error('Error downloading book content', error, { context: 'downloadBookContent' })
        return null
    }
}

/**
 * Get public URL for book content (for client-side download)
 */
export async function getBookContentUrl(
    bookId: string,
    language: 'en' | 'fa'
): Promise<string | null> {
    try {
        const supabase = await createServerClient()

        const fileName = `${bookId}-${language}.json`
        const { data } = supabase.storage
            .from('book-content')
            .getPublicUrl(fileName)

        return data.publicUrl
    } catch (error) {
        logger.error('Error getting book content URL', error, { context: 'getBookContentUrl' })
        return null
    }
}

/**
 * Delete book content from Storage
 */
export async function deleteBookContent(
    bookId: string,
    language: 'en' | 'fa'
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createServerClient()

        const fileName = `${bookId}-${language}.json`
        const { error } = await supabase.storage
            .from('book-content')
            .remove([fileName])

        if (error) {
            logger.error('Failed to delete book content', error, { context: 'deleteBookContent', bookId })
            return { success: false, error: error.message }
        }

        logger.info('Book content deleted successfully', { context: 'deleteBookContent', bookId, language })
        return { success: true }
    } catch (error) {
        logger.error('Error deleting book content', error, { context: 'deleteBookContent' })
        return { success: false, error: 'Failed to delete book content' }
    }
}

/**
 * Get specific pages from book content
 * Useful for preview or pagination
 */
export async function getBookPages(
    bookId: string,
    language: 'en' | 'fa',
    startPage: number,
    endPage: number
): Promise<string[] | null> {
    try {
        const content = await downloadBookContent(bookId, language)

        if (!content) return null

        return content.pages.slice(startPage - 1, endPage)
    } catch (error) {
        logger.error('Error getting book pages', error, { context: 'getBookPages' })
        return null
    }
}

/**
 * Client-side pagination helper
 * Splits raw text into pages based on word count
 */
export function paginateContent(
    text: string,
    wordsPerPage: number = 300
): string[] {
    const words = text.trim().split(/\s+/)
    const pages: string[] = []

    for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageWords = words.slice(i, i + wordsPerPage)
        pages.push(pageWords.join(' '))
    }

    return pages
}

/**
 * Convert TipTap JSON to plain text pages
 * Used when admin uploads content from TipTap editor
 */
export function convertTipTapToPages(
    tiptapJson: Record<string, unknown>,
    wordsPerPage: number = 300
): string[] {
    // Extract text from TipTap JSON structure
    let fullText = ''

    function extractText(node: Record<string, unknown>): void {
        if (node.type === 'text') {
            fullText += node.text + ' '
        }

        if (node.content && Array.isArray(node.content)) {
            node.content.forEach(extractText)
        }
    }

    extractText(tiptapJson)

    return paginateContent(fullText, wordsPerPage)
}

/**
 * Estimate reading time for book
 */
export function estimateReadingTime(totalPages: number, wordsPerPage: number = 300): number {
    const totalWords = totalPages * wordsPerPage
    const wordsPerMinute = 200 // Average reading speed
    return Math.ceil(totalWords / wordsPerMinute)
}

/**
 * Check if book content exists in Storage
 */
export async function bookContentExists(
    bookId: string,
    language: 'en' | 'fa'
): Promise<boolean> {
    try {
        const supabase = await createServerClient()

        const fileName = `${bookId}-${language}.json`
        const { data, error } = await supabase.storage
            .from('book-content')
            .list('', {
                search: fileName,
            })

        if (error) return false

        return data.length > 0
    } catch (error) {
        logger.error('Error checking book content existence', error, { context: 'bookContentExists' })
        return false
    }
}
