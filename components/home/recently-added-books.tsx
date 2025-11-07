import { getBooks } from '@/lib/data'
import { BookCarouselSectionClient } from './book-carousel-section-client'

export async function RecentlyAddedBooks() {
    try {
        const sanityBooks = await getBooks()

        if (!sanityBooks || sanityBooks.length === 0) {
            return null
        }

        // Transform Sanity books to match BookCarouselSection expected format
        const books = sanityBooks.map(book => ({
            _id: book._id,
            slug: book.slug,
            title: typeof book.title === 'string' ? book.title : book.title.en,
            author: typeof book.author === 'string' ? book.author : book.author.name,
            coverImage: book.coverImage,
            genres: book.genres,
            level: book.level,
            isPremium: book.isPremium,
        }))

        // Serialize to ensure JSON-safe data for Client Component (Agent 2 - Performance)
        const serializedBooks = JSON.parse(JSON.stringify(books))

        return (
            <BookCarouselSectionClient
                title="جدیدترین کتاب‌ها"
                description="تازه‌ترین کتاب‌های اضافه شده به کتابخانه"
                books={serializedBooks}
                iconType="sparkles"
                viewAllLink="/library?sort=newest"
                viewAllText="مشاهده همه کتاب‌های جدید"
                autoScrollDirection="left"
            />
        )
    } catch (error) {
        console.error('Error loading recently added books:', error)
        return null
    }
}
