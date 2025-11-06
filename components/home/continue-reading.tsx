import { getUserReadingProgress } from '@/lib/supabase/queries/reading-progress'
import { BookOpen } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

interface ReadingProgressItem {
    book_id: string
    progress_percentage: number
    book: {
        id: string
        title: string
        author: string
        cover_url: string | null
        slug: string
        genres: string[] | null
    } | null
}

export async function ContinueReading() {
    try {
        // In mock mode, this will return empty array (no auth)
        // In production, this requires authentication
        const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

        if (USE_MOCK_DATA) {
            // Skip this section in mock mode (requires auth)
            return null
        }

        // Try to get user from Supabase
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return null
        }

        const readingProgress = await getUserReadingProgress(user.id) as ReadingProgressItem[]

        if (!readingProgress || readingProgress.length === 0) {
            return null
        }

        // Extract books and progress
        const books = readingProgress
            .map((p: ReadingProgressItem) => p.book)
            .filter((b): b is NonNullable<typeof b> => b !== null && b !== undefined)
            .map(book => ({
                ...book,
                genres: book.genres || undefined
            }))

        const progressMap = readingProgress.reduce(
            (acc: Record<string, number>, p: ReadingProgressItem) => {
                if (p.book?.id) {
                    acc[p.book.id] = p.progress_percentage
                }
                return acc
            },
            {}
        )

        return (
            <BookCarouselSection
                title="ادامه مطالعه"
                description="کتاب‌هایی که در حال خواندن آن‌ها هستید"
                books={books}
                icon={<BookOpen className="w-8 h-8 text-gold-500" />}
                viewAllLink="/dashboard"
                viewAllText="مشاهده داشبورد"
                progress={progressMap}
                bgClass="bg-muted/30"
            />
        )
    } catch (error) {
        console.error('Error loading continue reading:', error)
        return null
    }
}
