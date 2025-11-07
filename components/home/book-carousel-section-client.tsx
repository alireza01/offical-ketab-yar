'use client'

import { BookOpen, Sparkles, Star, TrendingUp } from 'lucide-react'
import { BookCarouselSection } from './book-carousel-section'

interface Book {
    id?: string
    _id?: string
    slug: string
    title: string | { en: string; fa: string }
    author?: string | { name: string; slug: string }
    author_id?: string
    authors?: { name: string }
    cover_image?: string | null
    coverImage?: string | null
    rating?: number | null
    read_count?: number
    genre?: string[]
    genres?: string[]
}

interface BookCarouselSectionClientProps {
    title: string
    description: string
    books: Book[]
    iconType?: 'sparkles' | 'trending' | 'star' | 'book-open'
    viewAllLink: string
    viewAllText?: string
    showReadCount?: boolean
    progress?: Record<string, number>
    bgClass?: string
    autoScrollDirection?: 'left' | 'right'
}

export function BookCarouselSectionClient({
    iconType = 'sparkles',
    ...props
}: BookCarouselSectionClientProps) {
    const icons = {
        sparkles: <Sparkles className="w-8 h-8 text-gold-500" />,
        trending: <TrendingUp className="w-8 h-8 text-gold-500" />,
        star: <Star className="w-8 h-8 text-gold-500 fill-gold-500" />,
        'book-open': <BookOpen className="w-8 h-8 text-gold-500" />,
    }

    return <BookCarouselSection {...props} icon={icons[iconType]} />
}
