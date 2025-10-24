import { createServerClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

export async function ContinueReading() {
    try {
        const supabase = await createServerClient()

        // Get current user
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return null
        }

        // Get user's reading progress
        const { data: readingProgress } = await supabase
            .from('reading_progress')
            .select(
                `
        *,
        books (*)
      `
            )
            .eq('user_id', user.id)
            .lt('progress_percentage', 100)
            .order('last_read_at', { ascending: false })
            .limit(8)

        if (!readingProgress || readingProgress.length === 0) {
            return null
        }

        // Extract books and progress
        const books = readingProgress.map((p: any) => p.books).filter(Boolean)
        const progressMap = readingProgress.reduce(
            (acc: Record<string, number>, p: any) => {
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
