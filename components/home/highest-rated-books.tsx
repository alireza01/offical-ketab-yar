import { getTrendingBooks } from '@/lib/data'
import { BookCarouselSectionClient } from './book-carousel-section-client'

export async function HighestRatedBooks() {
    try {
        const books = await getTrendingBooks(12)

        if (!books || books.length === 0) {
            return null
        }

        // Serialize to ensure JSON-safe data for Client Component (Agent 2 - Performance)
        const serializedBooks = JSON.parse(JSON.stringify(books))

        return (
            <BookCarouselSectionClient
                title="بالاترین امتیازها"
                description="کتاب‌هایی که بیشترین امتیاز را از خوانندگان دریافت کرده‌اند"
                books={serializedBooks}
                iconType="star"
                viewAllLink="/library?sort=rating"
                viewAllText="مشاهده همه کتاب‌های برتر"
                bgClass="bg-muted/30"
                autoScrollDirection="right"
            />
        )
    } catch (error) {
        console.error('Error loading highest rated books:', error)
        return null
    }
}
