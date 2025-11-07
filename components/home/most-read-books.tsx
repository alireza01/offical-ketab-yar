import { getTrendingBooks } from '@/lib/data'
import { BookCarouselSectionClient } from './book-carousel-section-client'

export async function MostReadBooks() {
    try {
        const books = await getTrendingBooks(12)

        if (!books || books.length === 0) {
            return null
        }

        // Serialize to ensure JSON-safe data for Client Component (Agent 2 - Performance)
        const serializedBooks = JSON.parse(JSON.stringify(books))

        return (
            <BookCarouselSectionClient
                title="پرخواننده‌ترین کتاب‌ها"
                description="کتاب‌هایی که بیشترین تعداد خواننده را داشته‌اند"
                books={serializedBooks}
                iconType="trending"
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
