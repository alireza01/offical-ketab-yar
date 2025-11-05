import { BookDetailClient } from '@/components/books/book-detail-client'
import type { Book } from '@/lib/data'
import { getBookBySlug, getBooks, getRelatedBooks, getReviewsByBookId } from '@/lib/data'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface BookPageProps {
  params: Promise<{
    slug: string
  }>
}

// Force static generation for SEO (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

// Generate static params for all books (Agent 1 - SEO)
export async function generateStaticParams() {
  try {
    const books = await getBooks()
    return books.map((book: Book) => ({
      slug: book.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const book = await getBookBySlug(slug)

    if (!book) {
      return {
        title: 'Book Not Found | کتاب‌یار',
      }
    }

    const authorName = book.authors?.name || 'Unknown Author'

    return {
      title: `${book.title} by ${authorName} | Download & Read Free | کتاب‌یار`,
      description: `${book.summary || `Read ${book.title} by ${authorName}`}. Available in bilingual format (English/Persian). Start reading the first 20 pages free on Ketab-Yar.`,
      keywords: [
        book.title,
        authorName,
        'book',
        'read online',
        'bilingual',
        'English',
        'Persian',
        'کتاب',
        ...(book.genres || []),
      ],
      alternates: {
        canonical: `https://ketabyar.ir/books/${slug}`,
      },
      openGraph: {
        title: `${book.title} by ${authorName}`,
        description: book.summary || `Read ${book.title} on Ketab Yar`,
        images: [
          {
            url: book.cover_image || '/og-book-default.png',
            width: 1200,
            height: 630,
            alt: book.title,
          },
        ],
        type: 'book',
        url: `https://ketabyar.ir/books/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${book.title} by ${authorName}`,
        description: book.summary || '',
        images: [book.cover_image || '/og-book-default.png'],
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

    if (!book) {
      notFound()
    }

    const [reviews, relatedBooks] = await Promise.all([
      getReviewsByBookId(book.id).catch(() => []),
      getRelatedBooks(book.id, book.genres || [], 4).catch(() => []),
    ])

    // JSON-LD Book Schema for SEO (Agent 1 - CRITICAL)
    const bookSchema = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.authors?.name || 'Unknown Author',
      },
      isbn: book.isbn || undefined,
      numberOfPages: book.page_count,
      inLanguage: ['en', 'fa'],
      description: book.summary,
      image: book.cover_image,
      aggregateRating: book.rating
        ? {
          '@type': 'AggregateRating',
          ratingValue: book.rating,
          reviewCount: book.review_count,
          bestRating: 5,
          worstRating: 1,
        }
        : undefined,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0.00',
        priceCurrency: 'IRR',
        url: `https://ketabyar.ir/books/${slug}`,
      },
      genre: book.genres?.join(', '),
      datePublished: book.publication_year?.toString(),
    }

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
        />

        <BookDetailClient
          book={book}
          author={book.authors}
          reviews={reviews}
          relatedBooks={relatedBooks}
        />
      </>
    )
  } catch (error) {
    console.error('Error loading book:', error)
    notFound()
  }
}
