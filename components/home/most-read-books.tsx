import { getTrendingBooks } from '@/lib/data'
import { TrendingUp } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

export async function MostReadBooks() {
    try {
        const books = await getTrendingBooks(12)

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
                autoScrollDirection="left"
            />
        )
    } catch (error) {
        console.error('Error loading most read books:', error)
        return null
    }
}
