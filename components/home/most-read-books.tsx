import { createServerClient } from '@/lib/supabase/server'
import { TrendingUp } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

export async function MostReadBooks() {
    try {
        const supabase = await createServerClient()

        // Get books with most completions in the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: recentCompletions } = await supabase
            .from('book_completions')
            .select('book_id')
            .gte('completed_at', thirtyDaysAgo.toISOString())

        if (!recentCompletions || recentCompletions.length === 0) {
            // Fallback to all-time most read if no recent data
            const { data: books } = await supabase
                .from('books')
                .select('*')
                .eq('is_active', true)
                .order('read_count', { ascending: false })
                .limit(12)

            if (!books || books.length === 0) {
                return null
            }

            return (
                <BookCarouselSection
                    title="پرخواننده‌ترین کتاب‌ها"
                    description="کتاب‌هایی که بیشترین تعداد خواننده را داشته‌اند"
                    books={books}
                    icon={<TrendingUp className="w-8 h-8 text-gold-500" />}
                    viewAllLink="/library?sort=popular"
                    viewAllText="مشاهده همه کتاب‌های محبوب"
                    showReadCount
                />
            )
        }

        // Count completions per book
        const bookCounts = recentCompletions.reduce((acc: Record<string, number>, item) => {
            acc[item.book_id] = (acc[item.book_id] || 0) + 1
            return acc
        }, {})

        // Get top book IDs
        const topBookIds = Object.entries(bookCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 12)
            .map(([bookId]) => bookId)

        // Fetch book details
        const { data: books } = await supabase
            .from('books')
            .select('*')
            .in('id', topBookIds)
            .eq('is_active', true)

        if (!books || books.length === 0) {
            return null
        }

        // Sort books by completion count
        const sortedBooks = books.sort((a, b) => {
            return (bookCounts[b.id] || 0) - (bookCounts[a.id] || 0)
        })

        return (
            <BookCarouselSection
                title="پرخواننده‌ترین این ماه"
                description="کتاب‌هایی که در 30 روز گذشته بیشترین خواننده را داشته‌اند"
                books={sortedBooks}
                icon={<TrendingUp className="w-8 h-8 text-gold-500" />}
                viewAllLink="/library?sort=popular"
                viewAllText="مشاهده همه کتاب‌های محبوب"
                showReadCount
            />
        )
    } catch (error) {
        console.error('Error loading most read books:', error)
        return null
    }
}
