import { BookReader } from '@/components/reader/book-reader'
import { sanityClient } from '@/lib/sanity/client'
import { bookWithFirstChapterQuery } from '@/lib/sanity/queries'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'

interface ReaderPageProps {
  params: Promise<{
    slug: string
  }>
}

// Force CSR for reader (Agent 2 - Performance)
export const dynamic = 'force-dynamic'

// Generate static params for all books (for build optimization)
export async function generateStaticParams() {
  try {
    const books = await sanityClient.fetch<Array<{ slug: string }>>(
      groq`*[_type == "book" && !(_id in path("drafts.**"))] { "slug": slug.current }`
    )
    return books.map((book) => ({ slug: book.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  try {
    const { slug } = await params

    // Fetch book with ONLY first chapter (Agent 2 - Performance optimization)
    const book = await sanityClient.fetch(bookWithFirstChapterQuery, { slug })

    if (!book || !book.firstChapter) {
      notFound()
    }

    return <BookReader book={book} />
  } catch (error) {
    console.error('Error loading book:', error)
    notFound()
  }
}
