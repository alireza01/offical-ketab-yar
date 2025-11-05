/**
 * UNIFIED DATA API
 * 
 * This module provides a single interface for data access that automatically
 * switches between mock data (development) and Supabase (production).
 * 
 * Usage:
 * - Set NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local for mock data
 * - Set NEXT_PUBLIC_USE_MOCK_DATA=false or omit for Supabase
 * 
 * All functions return the same data structure regardless of source.
 */

import { mockAuthors, mockBooks, mockReviews, type MockAuthor, type MockBook, type MockReadingProgress, type MockReview } from '@/lib/dev/mock-data'

// Detect if we should use mock data
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// Type exports
export type { MockAuthor as Author, MockBook as Book, MockReadingProgress as ReadingProgress, MockReview as Review }

/**
 * Get all published books
 */
export async function getBooks(): Promise<MockBook[]> {
    if (USE_MOCK_DATA) {
        return mockBooks.filter(book => book.status === 'published' && book.is_active)
    }

    try {
        const { getBooks: getSupabaseBooks } = await import('@/lib/supabase/queries/books')
        return await getSupabaseBooks()
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockBooks.filter(book => book.status === 'published' && book.is_active)
    }
}

/**
 * Get book by slug
 */
export async function getBookBySlug(slug: string): Promise<MockBook | null> {
    if (USE_MOCK_DATA) {
        const book = mockBooks.find(b => b.slug === slug && b.status === 'published')
        if (book) {
            // Attach author data
            const author = mockAuthors.find(a => a.id === book.author_id)
            return { ...book, authors: author }
        }
        return null
    }

    try {
        const { getBookBySlug: getSupabaseBookBySlug } = await import('@/lib/supabase/queries/books')
        return await getSupabaseBookBySlug(slug)
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        const book = mockBooks.find(b => b.slug === slug && b.status === 'published')
        if (book) {
            const author = mockAuthors.find(a => a.id === book.author_id)
            return { ...book, authors: author }
        }
        return null
    }
}

/**
 * Get book by ID
 */
export async function getBookById(id: string): Promise<MockBook | null> {
    if (USE_MOCK_DATA) {
        const book = mockBooks.find(b => b.id === id)
        if (book) {
            const author = mockAuthors.find(a => a.id === book.author_id)
            return { ...book, authors: author }
        }
        return null
    }

    try {
        const { getBookById: getSupabaseBookById } = await import('@/lib/supabase/queries/books')
        return await getSupabaseBookById(id)
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        const book = mockBooks.find(b => b.id === id)
        if (book) {
            const author = mockAuthors.find(a => a.id === book.author_id)
            return { ...book, authors: author }
        }
        return null
    }
}

/**
 * Get book content (pages)
 */
export async function getBookContent(bookId: string, language: string = 'en'): Promise<Array<{ content: string; page_number: number }>> {
    if (USE_MOCK_DATA) {
        const book = mockBooks.find(b => b.id === bookId)
        if (book && book.content) {
            return book.content.map((content, index) => ({
                content,
                page_number: index + 1
            }))
        }
        return []
    }

    try {
        const { getBookContent: getSupabaseBookContent } = await import('@/lib/supabase/queries/books')
        return await getSupabaseBookContent(bookId, language)
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        const book = mockBooks.find(b => b.id === bookId)
        if (book && book.content) {
            return book.content.map((content, index) => ({
                content,
                page_number: index + 1
            }))
        }
        return []
    }
}

/**
 * Get recently added books
 */
export async function getRecentlyAddedBooks(limit: number = 12): Promise<MockBook[]> {
    if (USE_MOCK_DATA) {
        return mockBooks
            .filter(book => book.status === 'published' && book.is_active)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit)
    }

    try {
        const { createServerClient } = await import('@/lib/supabase/server')
        const supabase = await createServerClient()
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('is_active', true)
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockBooks
            .filter(book => book.status === 'published' && book.is_active)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit)
    }
}

/**
 * Get highest rated books
 */
export async function getHighestRatedBooks(limit: number = 12): Promise<MockBook[]> {
    if (USE_MOCK_DATA) {
        return mockBooks
            .filter(book => book.status === 'published' && book.is_active && book.rating !== null)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit)
    }

    try {
        const { createServerClient } = await import('@/lib/supabase/server')
        const supabase = await createServerClient()
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('is_active', true)
            .eq('status', 'published')
            .not('rating', 'is', null)
            .order('rating', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockBooks
            .filter(book => book.status === 'published' && book.is_active && book.rating !== null)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, limit)
    }
}

/**
 * Get most read books
 */
export async function getMostReadBooks(limit: number = 12): Promise<MockBook[]> {
    if (USE_MOCK_DATA) {
        return mockBooks
            .filter(book => book.status === 'published' && book.is_active)
            .sort((a, b) => b.read_count - a.read_count)
            .slice(0, limit)
    }

    try {
        const { createServerClient } = await import('@/lib/supabase/server')
        const supabase = await createServerClient()
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('is_active', true)
            .eq('status', 'published')
            .order('read_count', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data || []
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockBooks
            .filter(book => book.status === 'published' && book.is_active)
            .sort((a, b) => b.read_count - a.read_count)
            .slice(0, limit)
    }
}

/**
 * Get related books by genre
 */
export async function getRelatedBooks(bookId: string, genres: string[], limit: number = 4): Promise<MockBook[]> {
    if (USE_MOCK_DATA) {
        return mockBooks
            .filter(book =>
                book.id !== bookId &&
                book.status === 'published' &&
                book.is_active &&
                book.genres.some(g => genres.includes(g))
            )
            .slice(0, limit)
    }

    try {
        const { getRelatedBooks: getSupabaseRelatedBooks } = await import('@/lib/supabase/queries/books')
        return await getSupabaseRelatedBooks(bookId, genres, limit)
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockBooks
            .filter(book =>
                book.id !== bookId &&
                book.status === 'published' &&
                book.is_active &&
                book.genres.some(g => genres.includes(g))
            )
            .slice(0, limit)
    }
}

/**
 * Get reviews for a book
 */
export async function getReviewsByBookId(bookId: string): Promise<MockReview[]> {
    if (USE_MOCK_DATA) {
        return mockReviews
            .filter(review => review.book_id === bookId)
            .map(review => ({
                ...review,
                profiles: {
                    id: review.user_id,
                    full_name: `User ${review.user_id}`,
                    avatar_url: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=100`
                }
            }))
    }

    try {
        const { getReviewsByBookId: getSupabaseReviewsByBookId } = await import('@/lib/supabase/queries/books')
        return await getSupabaseReviewsByBookId(bookId)
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockReviews
            .filter(review => review.book_id === bookId)
            .map(review => ({
                ...review,
                profiles: {
                    id: review.user_id,
                    full_name: `User ${review.user_id}`,
                    avatar_url: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=100`
                }
            }))
    }
}

/**
 * Get user's reading progress (requires authentication)
 */
export async function getUserReadingProgress(userId: string): Promise<MockReadingProgress[]> {
    if (USE_MOCK_DATA) {
        // Return empty array in mock mode (no auth)
        return []
    }

    try {
        const { createServerClient } = await import('@/lib/supabase/server')
        const supabase = await createServerClient()
        const { data, error } = await supabase
            .from('reading_progress')
            .select(`
        *,
        books (*)
      `)
            .eq('user_id', userId)
            .lt('progress_percentage', 100)
            .order('last_read_at', { ascending: false })
            .limit(8)

        if (error) throw error
        return data || []
    } catch (error) {
        console.warn('Failed to get reading progress:', error)
        return []
    }
}

/**
 * Get author by ID
 */
export async function getAuthorById(id: string): Promise<MockAuthor | null> {
    if (USE_MOCK_DATA) {
        return mockAuthors.find(a => a.id === id) || null
    }

    try {
        const { getAuthorById: getSupabaseAuthorById } = await import('@/lib/supabase/queries/books')
        return await getSupabaseAuthorById(id)
    } catch (error) {
        console.warn('Supabase failed, falling back to mock data:', error)
        return mockAuthors.find(a => a.id === id) || null
    }
}
