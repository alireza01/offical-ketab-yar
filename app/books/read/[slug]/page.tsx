import { ReaderWithTracking } from '@/components/reader/reader-with-tracking'
import { getBookBySlug, getBookContent } from '@/lib/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Force CSR for reader (Agent 2 - Performance)
// This is a private, interactive page - no SEO needed
export const dynamic = 'force-dynamic'

interface ReadBookPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ReadBookPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const book = await getBookBySlug(slug)

    if (!book) {
      return {
        title: 'Book Not Found | کتاب‌یار',
      }
    }

    return {
      title: `Reading: ${book.title} | کتاب‌یار`,
      description: 'Immersive book reading experience',
      robots: {
        index: false, // Don't index reader pages (Agent 1 - SEO)
        follow: false,
      },
    }
  } catch {
    return {
      title: 'Book Not Found | کتاب‌یار',
    }
  }
}

export default async function ReadBookPage({ params }: ReadBookPageProps) {
  const { slug } = await params

  try {
    const book = await getBookBySlug(slug)

    if (!book) {
      notFound()
    }

    // Load content (Agent 2 - Performance: This happens on server, then hydrates on client)
    const content = await getBookContent(book.id, 'en')

    // Transform book data to match expected interface
    const bookWithContent = {
      ...book,
      content: content.map(c => c.content)
    }

    return <ReaderWithTracking book={bookWithContent} />
  } catch (error) {
    console.error('[Reader Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug,
      timestamp: new Date().toISOString(),
    })
    notFound()
  }
}
