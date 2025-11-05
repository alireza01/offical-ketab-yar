import { getUserReadingProgress } from '@/lib/data'
import { BookOpen } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

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
        const { createServerClient } = await import('@/lib/supabase/server')
        const supabase = await createServerClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return null
        }

        const readingProgress = await getUserReadingProgress(user.id)

        if (!readingProgress || readingProgress.length === 0) {
            return null
        }

        // Extract books and progress
        const books = readingProgress.map((p) => p.books).filter((b): b is NonNullable<typeof b> => b !== null && b !== undefined)
        const progressMap = readingProgress.reduce(
            (acc: Record<string, number>, p) => {
                if (p.books?.id) {
                    acc[p.books.id] = p.progress_percentage
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
