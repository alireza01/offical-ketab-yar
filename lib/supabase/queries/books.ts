import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'

// Server-side queries
export async function getBooks() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
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

  if (error) throw error
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

  if (error) throw error
  return data
}

export async function getBookContent(bookId: string, language: string = 'en') {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('book_content')
    .select('*')
    .eq('book_id', bookId)
    .eq('language', language)
    .order('page_number', { ascending: true })

  if (error) throw error
  return data
}

export async function getBooksByGenre(genre: string, limit: number = 10) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .contains('genres', [genre])
    .eq('status', 'published')
    .limit(limit)

  if (error) throw error
  return data
}

export async function getBooksByAuthor(authorId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('publication_year', { ascending: false })

  if (error) throw error
  return data
}

export async function getFeaturedBooks(limit: number = 6) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getTrendingBooks(limit: number = 6) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getRelatedBooks(bookId: string, genres: string[], limit: number = 4) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .neq('id', bookId)
    .overlaps('genres', genres)
    .eq('status', 'published')
    .limit(limit)

  if (error) throw error
  return data
}

export async function searchBooks(query: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%`)
    .eq('status', 'published')
    .limit(20)

  if (error) throw error
  return data
}

// Client-side queries
export async function getBooksByGenreClient(genre: string, limit: number = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .contains('genres', [genre])
    .eq('status', 'published')
    .limit(limit)

  if (error) throw error
  return data
}

export async function searchBooksClient(query: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%`)
    .eq('status', 'published')
    .limit(20)

  if (error) throw error
  return data
}

// Author queries
export async function getAuthorById(id: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getAuthors() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

// Review queries
export async function getReviewsByBookId(bookId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('book_id', bookId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
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

// Increment view count
export async function incrementBookViewCount(bookId: string) {
  const supabase = createClient()
  const { error } = await supabase.rpc('increment_book_views', {
    book_id: bookId
  })

  if (error) console.error('Failed to increment view count:', error)
}
