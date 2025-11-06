import type { PortableTextBlock } from '@portabletext/types'

// ============================================
// CORE TYPES
// ============================================

export interface BilingualText {
    en: string
    fa: string
}

export interface BilingualPortableText {
    en: PortableTextBlock[]
    fa: PortableTextBlock[]
}

// ============================================
// BILINGUAL PARAGRAPH
// ============================================

export interface BilingualParagraph {
    _type: 'bilingualParagraph'
    _key: string
    english: PortableTextBlock[]
    farsi: PortableTextBlock[]
    alignment?: 'left' | 'center' | 'right' | 'justify'
    pageBreakAfter?: boolean
}

// ============================================
// CHAPTER
// ============================================

export interface Chapter {
    title: BilingualText
    chapterNumber: number
    content: (BilingualParagraph | SanityImage)[]
}

// ============================================
// BOOK
// ============================================

export interface SanityBook {
    _id: string
    _type: 'book'
    slug: string
    title: BilingualText
    subtitle?: BilingualText
    coverImage: string
    coverImageAlt?: string
    author: Author
    publishYear?: number
    isbn?: string
    publisher?: string
    summary?: BilingualText
    genres?: Genre[]
    level?: 'beginner' | 'intermediate' | 'advanced'
    chapters: Chapter[]
    freePreviewPages: number
    isPremium: boolean
    featured: boolean
    status: 'draft' | 'published' | 'archived'
    publishedAt?: string
    seoTitle?: BilingualText
    seoDescription?: BilingualText
    seoKeywords?: string[]
}

export interface SanityBookListItem {
    _id: string
    slug: string
    title: BilingualText
    coverImage: string
    coverImageAlt?: string
    author: {
        _id: string
        name: string
        slug: string
    }
    publishYear?: number
    summary?: BilingualText
    genres?: string[]
    level?: string
    isPremium: boolean
    featured: boolean
}

// ============================================
// AUTHOR
// ============================================

export interface Author {
    _id: string
    _type: 'author'
    name: string
    slug: string
    bio?: BilingualPortableText
    photo?: string
    image?: string // Alias for photo
    photoAlt?: string
    birthYear?: number
    born?: number // Alias for birthYear
    nationality?: string
    website?: string
    socialMedia?: {
        twitter?: string
        instagram?: string
        facebook?: string
    }
    books?: SanityBookListItem[] // Books by this author
}

// ============================================
// GENRE
// ============================================

export interface Genre {
    _id: string
    _type: 'genre'
    name: string
    slug: string
    description?: string
}

// ============================================
// BLOG POST
// ============================================

export interface BlogPost {
    _id: string
    _type: 'blogPost'
    slug: string
    title: BilingualText
    excerpt?: BilingualText
    mainImage?: string
    mainImageAlt?: string
    body: PortableTextBlock[]
    author?: Author
    categories?: string[]
    relatedBooks?: SanityBookListItem[]
    publishedAt?: string
    featured: boolean
    status: 'draft' | 'published'
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string[]
}

// ============================================
// IMAGE
// ============================================

export interface SanityImage {
    _type: 'image'
    _key: string
    url: string
    alt?: string
    caption?: BilingualText
}

// ============================================
// READER TYPES
// ============================================

export interface BookReaderData {
    _id: string
    slug: string
    title: BilingualText
    coverImage: string
    author: {
        _id: string
        name: string
        slug: string
    }
    publishYear?: number
    totalChapters: number
    firstChapter: Chapter
}

export interface ChapterData {
    title: BilingualText
    chapterNumber: number
    content: (BilingualParagraph | SanityImage)[]
}
