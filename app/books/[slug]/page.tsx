import { BookDetailClient } from '@/components/books/book-detail-client'
import { getBookBySlug, getRelatedBooks, getReviewsByBookId } from '@/lib/supabase/queries/books'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface BookPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const book = await getBookBySlug(slug)
    
    return {
      title: `${book.title} | کتاب‌یار`,
      description: book.summary || `Read ${book.title} on Ketab Yar`,
      openGraph: {
        title: book.title,
        description: book.summary || '',
        images: [book.cover_image || ''],
      },
    }
  } catch {
    return {
      title: 'Book Not Found | کتاب‌یار',
    }
  }
}

export default async function BookPage({ params }: BookPageProps) {
  try {
    const { slug } = await params
    const book = await getBookBySlug(slug)
    
    const [reviews, relatedBooks] = await Promise.all([
      getReviewsByBookId(slug).catch(() => []),
      getRelatedBooks(slug, book?.genres || [], 4).catch(() => []),
    ])

    if (!book) {
      notFound()
    }

    return (
      <BookDetailClient
        book={book}
        author={book.authors}
        reviews={reviews}
        relatedBooks={relatedBooks}
      />
    )
  } catch (error) {
    console.error('Error loading book:', error)
    notFound()
  }
}
