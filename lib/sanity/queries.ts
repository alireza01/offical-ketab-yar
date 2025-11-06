import { groq } from 'next-sanity'
import { sanityClient } from './client'
import type { Author, SanityBook, SanityBookListItem } from './types'

// ============================================
// BOOK QUERIES
// ============================================

export const booksQuery = groq`
  *[_type == "book" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->url
    },
    publishYear,
    summary,
    genres,
    level,
    freePreviewPages,
    isPremium,
    featured,
    publishedAt
  }
`

export const bookBySlugQuery = groq`
  *[_type == "book" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->url,
      bio,
      nationality,
      born,
      website,
      socialMedia
    },
    publishYear,
    isbn,
    publisher,
    summary,
    genres,
    level,
    chapters[] {
      title,
      chapterNumber,
      content[] {
        _type,
        _type == "bilingualParagraph" => {
          english,
          farsi
        },
        _type == "image" => {
          "url": asset->url,
          alt,
          caption
        }
      }
    },
    freePreviewPages,
    isPremium,
    featured,
    publishedAt
  }
`

export const bookSlugsQuery = groq`
  *[_type == "book" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`

export const featuredBooksQuery = groq`
  *[_type == "book" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...6] {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "author": author->{
      name,
      "slug": slug.current
    },
    publishYear,
    summary,
    genres,
    level,
    isPremium
  }
`

export const booksByGenreQuery = groq`
  *[_type == "book" && $genre in genres && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "author": author->name,
    genres,
    level
  }
`

// ============================================
// AUTHOR QUERIES
// ============================================

export const authorsQuery = groq`
  *[_type == "author" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    nationality,
    born
  }
`

export const authorBySlugQuery = groq`
  *[_type == "author" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    name,
    "slug": slug.current,
    "image": image.asset->url,
    "imageAlt": image.alt,
    nationality,
    born,
    bio,
    website,
    socialMedia,
    "books": *[_type == "book" && references(^._id) && !(_id in path("drafts.**"))] | order(publishYear desc) {
      _id,
      "slug": slug.current,
      title,
      "coverImage": coverImage.asset->url,
      "coverImageAlt": coverImage.alt,
      publishYear,
      genres,
      summary,
      isPremium
    }
  }
`

// Query to get all books by a specific author ID
export const booksByAuthorIdQuery = groq`
  *[_type == "book" && author._ref == $authorId && !(_id in path("drafts.**"))] | order(publishYear desc) {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    publishYear,
    genres,
    summary,
    isPremium
  }
`

// ============================================
// BLOG POST QUERIES
// ============================================

export const blogPostsQuery = groq`
  *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    "slug": slug.current,
    title,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "author": author->{
      name,
      "slug": slug.current,
      "image": image.asset->url
    },
    summary,
    categories,
    publishedAt,
    featured
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    "slug": slug.current,
    title,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "author": author->{
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->url,
      bio
    },
    summary,
    body,
    categories,
    "relatedBooks": relatedBooks[]->{
      _id,
      "slug": slug.current,
      title,
      "coverImage": coverImage.asset->url,
      "author": author->name
    },
    publishedAt,
    featured
  }
`

export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && !(_id in path("drafts.**"))] {
    "slug": slug.current
  }
`

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
    _id,
    "slug": slug.current,
    title,
    "mainImage": mainImage.asset->url,
    "author": author->name,
    summary,
    publishedAt
  }
`

// ============================================
// READER QUERIES (Optimized for performance)
// ============================================

// Get book with ONLY first chapter (for initial load)
export const bookWithFirstChapterQuery = groq`
  *[_type == "book" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "author": author->{
      _id,
      name,
      "slug": slug.current
    },
    publishYear,
    "totalChapters": count(chapters),
    "firstChapter": chapters[0] {
      title,
      chapterNumber,
      content[] {
        _type,
        _key,
        _type == "bilingualParagraph" => {
          english,
          farsi,
          alignment,
          pageBreakAfter
        },
        _type == "image" => {
          "url": asset->url,
          alt,
          caption
        }
      }
    }
  }
`

// Get specific chapter by number
export const chapterByNumberQuery = groq`
  *[_type == "book" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    "chapter": chapters[$chapterIndex] {
      title,
      chapterNumber,
      content[] {
        _type,
        _key,
        _type == "bilingualParagraph" => {
          english,
          farsi,
          alignment,
          pageBreakAfter
        },
        _type == "image" => {
          "url": asset->url,
          alt,
          caption
        }
      }
    }
  }
`

// Get book metadata for reader (without content)
export const bookMetadataQuery = groq`
  *[_type == "book" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    "slug": slug.current,
    title,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    "author": author->{
      _id,
      name,
      "slug": slug.current
    },
    publishYear,
    "totalChapters": count(chapters),
    "chapterTitles": chapters[].title,
    freePreviewPages,
    isPremium
  }
`


// ============================================
// QUERY FUNCTIONS
// ============================================

/**
 * Get all published books
 */
export async function getAllBooks(): Promise<SanityBookListItem[]> {
  try {
    return await sanityClient.fetch(booksQuery)
  } catch (error) {
    console.error('Error fetching all books:', error)
    return []
  }
}

/**
 * Get book by slug
 */
export async function getBookBySlug(slug: string): Promise<SanityBook | null> {
  try {
    return await sanityClient.fetch(bookBySlugQuery, { slug })
  } catch (error) {
    console.error('Error fetching book by slug:', error)
    return null
  }
}

/**
 * Get book by ID
 */
export async function getBookById(id: string): Promise<SanityBook | null> {
  try {
    const query = groq`*[_type == "book" && _id == $id && !(_id in path("drafts.**"))][0]`
    return await sanityClient.fetch(query, { id })
  } catch (error) {
    console.error('Error fetching book by ID:', error)
    return null
  }
}

/**
 * Get recently added books
 */
export async function getRecentlyAddedBooks(limit: number = 12): Promise<SanityBookListItem[]> {
  try {
    const query = groq`
      *[_type == "book" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
        _id,
        "slug": slug.current,
        title,
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt,
        "author": author->{
          name,
          "slug": slug.current
        },
        publishYear,
        summary,
        genres,
        level,
        isPremium,
        featured
      }
    `
    return await sanityClient.fetch(query, { limit })
  } catch (error) {
    console.error('Error fetching recently added books:', error)
    return []
  }
}

/**
 * Get featured books
 */
export async function getFeaturedBooks(limit: number = 6): Promise<SanityBookListItem[]> {
  try {
    const query = groq`
      *[_type == "book" && featured == true && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$limit] {
        _id,
        "slug": slug.current,
        title,
        "coverImage": coverImage.asset->url,
        "coverImageAlt": coverImage.alt,
        "author": author->{
          name,
          "slug": slug.current
        },
        publishYear,
        summary,
        genres,
        level,
        isPremium,
        featured
      }
    `
    return await sanityClient.fetch(query, { limit })
  } catch (error) {
    console.error('Error fetching featured books:', error)
    return []
  }
}

/**
 * Get books by genre
 */
export async function getBooksByGenre(genre: string, limit: number = 12): Promise<SanityBookListItem[]> {
  try {
    return await sanityClient.fetch(booksByGenreQuery, { genre, limit })
  } catch (error) {
    console.error('Error fetching books by genre:', error)
    return []
  }
}

/**
 * Get author by ID
 */
export async function getAuthorById(id: string): Promise<Author | null> {
  try {
    const query = groq`*[_type == "author" && _id == $id && !(_id in path("drafts.**"))][0]`
    return await sanityClient.fetch(query, { id })
  } catch (error) {
    console.error('Error fetching author by ID:', error)
    return null
  }
}

/**
 * Get author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    return await sanityClient.fetch(authorBySlugQuery, { slug })
  } catch (error) {
    console.error('Error fetching author by slug:', error)
    return null
  }
}

/**
 * Get book with first chapter (for reader)
 */
export async function getBookWithFirstChapter(slug: string) {
  try {
    return await sanityClient.fetch(bookWithFirstChapterQuery, { slug })
  } catch (error) {
    console.error('Error fetching book with first chapter:', error)
    return null
  }
}

/**
 * Get specific chapter by number
 */
export async function getChapterByNumber(slug: string, chapterNumber: number) {
  try {
    const chapterIndex = chapterNumber - 1 // Convert to 0-based index
    const result = await sanityClient.fetch(chapterByNumberQuery, { slug, chapterIndex })
    return result?.chapter || null
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNumber}:`, error)
    return null
  }
}

/**
 * Get book metadata (without content)
 */
export async function getBookMetadata(slug: string) {
  try {
    return await sanityClient.fetch(bookMetadataQuery, { slug })
  } catch (error) {
    console.error('Error fetching book metadata:', error)
    return null
  }
}
