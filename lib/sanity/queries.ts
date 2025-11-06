import { groq } from 'next-sanity'

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
    }
  }
`
