import { createServerClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

export async function HighestRatedBooks() {
    try {
        const supabase = await createServerClient()

        const { data: books } = await supabase
            .from('books')
            .select('*')
            .eq('is_active', true)
            .not('rating', 'is', null)
            .order('rating', { ascending: false })
            .limit(12)

        if (!books || books.length === 0) {
            return null
        }

        return (
            <BookCarouselSection
                title="بالاترین امتیازها"
                description="کتاب‌هایی که بیشترین امتیاز را از خوانندگان دریافت کرده‌اند"
                books={books}
                icon={<Star className="w-8 h-8 text-gold-500 fill-gold-500" />}
                viewAllLink="/library?sort=rating"
                viewAllText="مشاهده همه کتاب‌های برتر"
                showRating
                bgClass="bg-muted/30"
            />
        )
    } catch (error) {
        console.error('Error loading highest rated books:', error)
        return null
    }
}
