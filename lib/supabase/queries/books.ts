import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

type Book = Database['public']['Tables']['books']['Row']
type Author = Database['public']['Tables']['authors']['Row']

// ============================================================================
// SERVER-SIDE QUERIES (for SSG/SSR pages)
// ============================================================================

export async function getBooks(): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching books:', error)
    throw error
  }
  return data || []
}

export async function getBookBySlug(slug: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      authors (
        id,
        name,
        bio,
        photo_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching book by slug:', error)
    throw error
  }
  return data
}

export async function getBookById(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      authors (
        id,
        name,
        bio,
        photo_url
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching book by ID:', error)
    throw error
  }
  return data
}

/**
 * Get book content from Supabase Storage (JSON files)
 * This follows Agent 2's performance strategy: Storage instead of Database
 */
export async function getBookContent(bookId: string, language: string = 'en') {
  const supabase = await createServerClient()

  try {
    // Download JSON file from Storage
    const fileName = `${bookId}-${language}.json`
    const { data, error } = await supabase.storage
      .from('book-content')
      .download(fileName)

    if (error) {
      console.error('Error fetching book content from storage:', error)
      return null
    }

    // Parse JSON content
    const text = await data.text()
    const content = JSON.parse(text)

    return content
  } catch (error) {
    console.error('Error parsing book content:', error)
    return null
  }
}

export async function getBooksByGenre(genre: string, limit: number = 10): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .contains('genres', [genre])
    .eq('status', 'published')
    .limit(limit)

  if (error) {
    console.error('Error fetching books by genre:', error)
    return []
  }
  return data || []
}

export async function getBooksByAuthor(authorId: string): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('publication_year', { ascending: false })

  if (error) {
    console.error('Error fetching books by author:', error)
    return []
  }
  return data || []
}

export async function getFeaturedBooks(limit: number = 6): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured books:', error)
    return []
  }
  return data || []
}

export async function getTrendingBooks(limit: number = 6): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching trending books:', error)
    return []
  }
  return data || []
}

export async function getRecentBooks(limit: number = 6): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent books:', error)
    return []
  }
  return data || []
}

export async function getHighestRatedBooks(limit: number = 6): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching highest rated books:', error)
    return []
  }
  return data || []
}

export async function getRelatedBooks(
  bookId: string,
  genres: string[],
  limit: number = 4
): Promise<Book[]> {
  const supabase = await createServerClient()

  if (!genres || genres.length === 0) {
    return getRecentBooks(limit)
  }

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .neq('id', bookId)
    .overlaps('genres', genres)
    .eq('status', 'published')
    .limit(limit)

  if (error) {
    console.error('Error fetching related books:', error)
    return []
  }
  return data || []
}

export async function searchBooks(query: string): Promise<Book[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,author.ilike.%${query}%`)
    .eq('status', 'published')
    .limit(20)

  if (error) {
    console.error('Error searching books:', error)
    return []
  }
  return data || []
}

// CLIENT-SIDE QUERIES
export async function getBooksByGenreClient(genre: string, limit: number = 10): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .contains('genres', [genre])
    .eq('status', 'published')
    .limit(limit)

  if (error) {
    console.error('Error fetching books by genre (client):', error)
    return []
  }
  return data || []
}

export async function searchBooksClient(query: string): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,author.ilike.%${query}%`)
    .eq('status', 'published')
    .limit(20)

  if (error) {
    console.error('Error searching books (client):', error)
    return []
  }
  return data || []
}

// AUTHOR QUERIES
export async function getAuthorById(id: string): Promise<Author | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching author:', error)
    return null
  }
  return data
}

export async function getAuthors(): Promise<Author[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching authors:', error)
    return []
  }
  return data || []
}

// REVIEW QUERIES
export async function getReviewsByBookId(bookId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
  return data || []
}

export async function createReview(review: {
  book_id: string
  rating: number
  comment: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...review,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ANALYTICS
export async function incrementBookViewCount(bookId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.rpc('increment_book_views', {
      book_id: bookId
    })

    if (error) {
      const { data: book } = await supabase
        .from('books')
        .select('view_count')
        .eq('id', bookId)
        .single()

      if (book) {
        await supabase
          .from('books')
          .update({ view_count: (book.view_count || 0) + 1 })
          .eq('id', bookId)
      }
    }
  } catch (error) {
    console.error('Failed to increment view count:', error)
  }
}
