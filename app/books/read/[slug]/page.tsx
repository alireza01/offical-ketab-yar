import { ReaderWithTracking } from '@/components/reader/reader-with-tracking'
import { getBookBySlug, getBookContent } from '@/lib/supabase/queries/books'
import { notFound } from 'next/navigation'

export default async function ReadBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const book = await getBookBySlug(slug)

    if (!book) {
      notFound()
    }

    const content = await getBookContent(book.id, 'en')

    // Transform book data to match MockBook interface
    const bookWithContent = {
      ...book,
      content: content.map(c => c.content)
    }

    return <ReaderWithTracking book={bookWithContent} />
  } catch (error) {
    console.error('Error loading book:', error)
    notFound()
  }
}
