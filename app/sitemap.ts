import { getBooks } from '@/lib/supabase/queries/books'
import type { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generation
 * ✅ AGENT 1 (SEO): Automatically includes all published books
 * Updates on every build
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ketabyar.com'

    // Static pages (high priority)
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/subscription`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/help`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/support`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    // Dynamic book pages (SEO weapons - highest priority)
    try {
        const books = await getBooks()

        const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
            url: `${baseUrl}/books/${book.slug}`,
            lastModified: book.updated_at ? new Date(book.updated_at) : new Date(),
            changeFrequency: 'daily' as const, // Changed to daily for better crawl frequency
            priority: 0.95, // HIGHEST priority - these are our money pages
        }))

        // Add library page (important for SEO)
        const libraryPage: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}/library`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.85,
            }
        ]

        return [...staticPages, ...bookPages, ...libraryPage]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return static pages only if book fetch fails
        return staticPages
    }
}
