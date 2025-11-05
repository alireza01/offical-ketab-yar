import { ReaderClient } from '@/components/reader/reader-client'
import { getBookBySlug } from '@/lib/supabase/queries/books'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

interface ReadBookPageProps {
  params: Promise<{ slug: string }>
}

export default async function ReadBookPage({ params }: ReadBookPageProps) {
  const { slug } = await params

  // ✅ AGENT 3 (PSYCHOLOGY): Allow guest mode for free books
  // Check authentication (optional for guest mode)
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Guest users can read, but with limitations
  const isGuest = !user

  try {
    const book = await getBookBySlug(slug)

    if (!book) {
      notFound()
    }

    // ✅ AGENT 2 (PERFORMANCE): Load content from Storage (not database)
    // Check if book has content URLs (new Storage-based approach)
    let contentEn: string[] = []
    let contentFa: string[] = []

    if (book.content_json_url_en || book.content_json_url_fa) {
      // New approach: Load from Supabase Storage
      const storage = supabase.storage.from('book-content')

      if (book.content_json_url_en) {
        const { data: enData, error: enError } = await storage.download(book.content_json_url_en)
        if (enData && !enError) {
          const text = await enData.text()
          const parsed = JSON.parse(text)
          contentEn = Array.isArray(parsed) ? parsed : parsed.pages || []
        }
      }

      if (book.content_json_url_fa) {
        const { data: faData, error: faError } = await storage.download(book.content_json_url_fa)
        if (faData && !faError) {
          const text = await faData.text()
          const parsed = JSON.parse(text)
          contentFa = Array.isArray(parsed) ? parsed : parsed.pages || []
        }
      }
    } else {
      // Fallback: Load from database (old approach - will be deprecated)
      const { data: dbContent } = await supabase
        .from('book_content')
        .select('content, language, page_number')
        .eq('book_id', book.id)
        .order('page_number', { ascending: true })

      if (dbContent) {
        contentEn = dbContent
          .filter((c: { language: string }) => c.language === 'en')
          .map((c: { content: string }) => c.content)
        contentFa = dbContent
          .filter((c: { language: string }) => c.language === 'fa')
          .map((c: { content: string }) => c.content)
      }
    }

    // Get user's subscription tier for freemium logic (only if logged in)
    let isPremium = false
    let progress: { current_page: number; progress_percentage: number } | null = null

    if (!isGuest) {
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', user!.id)
        .single()

      isPremium = userData?.subscription_tier === 'premium' ||
        userData?.subscription_tier === 'admin'

      // Get user's reading progress
      const { data: progressData } = await supabase
        .from('user_library')
        .select('current_page, progress_percentage')
        .eq('user_id', user!.id)
        .eq('book_id', book.id)
        .single()

      progress = progressData
    }

    // Transform book data for reader
    const bookWithContent = {
      id: book.id,
      slug: book.slug,
      title: book.title,
      subtitle: book.subtitle,
      author: typeof book.authors === 'object' && book.authors !== null ? book.authors.name : book.author,
      coverImage: book.cover_url,
      totalPages: book.total_pages,
      freePreviewPages: book.free_preview_pages,
      isPremium: book.is_premium,
      contentEn,
      contentFa,
      genres: book.genres || [],
      // User-specific data
      userIsPremium: isPremium,
      currentPage: progress?.current_page || 0,
      progressPercentage: progress?.progress_percentage || 0,
    }

    return <ReaderClient book={bookWithContent} userId={user?.id || ''} />
  } catch (error) {
    console.error('Error loading book for reading:', error)
    notFound()
  }
}
