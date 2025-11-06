// Sanity CMS Type Definitions

export interface BilingualText {
    en: string
    fa: string
}

export interface BilingualParagraph {
    _type: 'bilingualParagraph'
    english: any[] // Portable Text blocks
    farsi: any[] // Portable Text blocks
}

export interface ChapterImage {
    _type: 'image'
    url: string
    alt: string
    caption?: BilingualText
}

export interface Chapter {
    title: BilingualText
    chapterNumber: number
    content: (BilingualParagraph | ChapterImage)[]
}

export interface Author {
    _id: string
    name: string
    slug: string
    image?: string
    imageAlt?: string
    nationality?: string
    born?: string
    bio?: {
        en: any[] // Portable Text
        fa: any[] // Portable Text
    }
    website?: string
    socialMedia?: {
        twitter?: string
        instagram?: string
        goodreads?: string
    }
    books?: SanityBook[]
}

export interface SanityBook {
    _id: string
    slug: string
    title: BilingualText
    coverImage: string
    coverImageAlt: string
    author: Author
    publishYear: number
    isbn?: string
    publisher?: string
    summary: BilingualText
    genres: string[]
    level: 'beginner' | 'intermediate' | 'advanced'
    chapters: Chapter[]
    freePreviewPages: number
    isPremium: boolean
    featured: boolean
    publishedAt: string
}

export interface BlogPost {
    _id: string
    slug: string
    title: BilingualText
    mainImage: string
    mainImageAlt: string
    author: Author
    summary: BilingualText
    body: {
        en: any[] // Portable Text
        fa: any[] // Portable Text
    }
    categories: string[]
    relatedBooks?: SanityBook[]
    publishedAt: string
    featured: boolean
}

// Helper type for book list items (without full content)
export interface SanityBookListItem {
    _id: string
    slug: string
    title: BilingualText
    coverImage: string
    coverImageAlt: string
    author: {
        name: string
        slug: string
    }
    publishYear: number
    summary: BilingualText
    genres: string[]
    level: string
    isPremium: boolean
    featured?: boolean
}
