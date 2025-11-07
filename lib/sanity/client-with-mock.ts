/**
 * SANITY CLIENT WITH MOCK DATA SUPPORT
 * 
 * This wrapper automatically uses mock data when:
 * - NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local
 * - OR Sanity credentials are missing
 * 
 * Perfect for local development without Sanity setup!
 */

import { sanityClient, sanityClientCDN } from './client'

// Check if mock mode is enabled
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

/**
 * Mock Sanity fetch function
 * Simulates Sanity queries with local data
 * Dynamically imports mock data only when needed
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mockFetch(query: string, params?: Record<string, any>): Promise<any> {
    console.log('🎭 Using MOCK DATA (no Sanity required)')
    console.log('Query:', query.substring(0, 100) + '...')
    console.log('Params:', params)

    // Dynamically import mock data (only when actually using it)
    const { mockBook, mockBooks, mockAuthor, mockGenres } = await import('../mock-data/banana-book')

    // Helper to transform Sanity format to flat format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformBook = (book: any) => ({
        ...book,
        slug: typeof book.slug === 'object' ? book.slug.current : book.slug,
        coverImage: book.coverImage || book.cover_image || '/placeholder-book.jpg', // Ensure coverImage is always present
        author: book.author ? {
            ...book.author,
            slug: typeof book.author.slug === 'object' ? book.author.slug.current : book.author.slug,
        } : book.author,
        genres: book.genres?.map((g: unknown) => typeof g === 'string' ? g : (g as { name: string }).name) || [],
    })

    // Book by slug with first chapter (for reader)
    if (query.includes('slug.current == $slug') && query.includes('firstChapter')) {
        if (params?.slug === 'the-great-banana-adventure') {
            const transformed = transformBook(mockBook)
            return {
                ...transformed,
                totalChapters: mockBook.chapters.length,
                firstChapter: mockBook.chapters[0],
            }
        }
        return null
    }

    // Book by slug (general)
    if (query.includes('slug.current == $slug') && query.includes('book')) {
        if (params?.slug === 'the-great-banana-adventure') {
            return transformBook(mockBook)
        }
        return null
    }

    // All books
    if (query.includes('*[_type == "book"') && query.includes('published')) {
        return mockBooks.map(transformBook)
    }

    // Featured books
    if (query.includes('featured == true')) {
        return mockBooks.map(transformBook)
    }

    // Total chapters count
    if (query.includes('count(chapters)')) {
        return { totalChapters: mockBook.chapters.length }
    }

    // Single chapter by index
    const chapterMatch = query.match(/chapters\[(\d+)\]/)
    if (chapterMatch) {
        const chapterIndex = parseInt(chapterMatch[1])
        const chapter = mockBook.chapters[chapterIndex]
        return { chapter }
    }

    // Authors
    if (query.includes('*[_type == "author"')) {
        return [mockAuthor]
    }

    // Genres
    if (query.includes('*[_type == "genre"')) {
        return mockGenres
    }

    console.warn('⚠️ Unhandled mock query:', query)
    return null
}

/**
 * Enhanced Sanity client that falls back to mock data
 */
export const sanityClientWithMock = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch: async (query: string, params?: Record<string, any>) => {
        if (USE_MOCK_DATA) {
            // Simulate network delay for realistic testing
            await new Promise(resolve => setTimeout(resolve, 300))
            return mockFetch(query, params)
        }

        try {
            return await sanityClient.fetch(query, params)
        } catch (error) {
            console.error('❌ Sanity fetch failed, falling back to mock data:', error)
            return mockFetch(query, params)
        }
    },
}

/**
 * CDN client with mock support
 */
export const sanityClientCDNWithMock = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch: async (query: string, params?: Record<string, any>) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200))
            return mockFetch(query, params)
        }

        try {
            return await sanityClientCDN.fetch(query, params)
        } catch (error) {
            console.error('❌ Sanity CDN fetch failed, falling back to mock data:', error)
            return mockFetch(query, params)
        }
    },
}

/**
 * Helper to check if using mock data
 */
export function isUsingMockData(): boolean {
    return USE_MOCK_DATA
}
