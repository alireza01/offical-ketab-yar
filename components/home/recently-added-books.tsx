import { createServerClient } from '@/lib/supabase/server'
import { Sparkles } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

export async function RecentlyAddedBooks() {
    try {
        const supabase = await createServerClient()

        const { data: books } = await supabase
            .from('books')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(12)

        if (!books || books.length === 0) {
            return null
        }

        return (
            <BookCarouselSection
                title="جدیدترین کتاب‌ها"
                description="تازه‌ترین کتاب‌های اضافه شده به کتابخانه"
                books={books}
                icon={<Sparkles className="w-8 h-8 text-gold-500" />}
                viewAllLink="/library?sort=newest"
                viewAllText="مشاهده همه کتاب‌های جدید"
            />
        )
    } catch (error) {
        console.error('Error loading recently added books:', error)
        return null
    }
}
