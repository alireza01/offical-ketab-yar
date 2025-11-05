import { BookDetailClient } from '@/components/books/book-detail-client'
import { getBookBySlug, getBooks, getRelatedBooks, getReviewsByBookId } from '@/lib/supabase/queries/books'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface BookPageProps {
  params: Promise<{
    slug: string
  }>
}

// ✅ AGENT 1 (SEO): Generate static params for all published books
export async function generateStaticParams() {
  try {
    const books = await getBooks()
    return books.map((book) => ({
      slug: book.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// ✅ AGENT 1 (SEO): Optimized metadata with SEO formula
export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const book = await getBookBySlug(slug)

    if (!book) {
      return {
        title: 'کتاب یافت نشد | کتاب‌یار',
        description: 'کتاب مورد نظر یافت نشد',
      }
    }

    const author = book.authors
    const authorName = typeof author === 'object' && author !== null ? author.name : book.author

    // Agent 1's ENHANCED SEO Formula: Action + Book + Author + "Free Download" + Brand
    const title = `دانلود رایگان کتاب ${book.title} اثر ${authorName} | مطالعه آنلاین | کتاب‌یار`

    // Agent 1's ENHANCED Description Formula: Optimized for Persian search queries
    const description = book.description || book.subtitle
      ? `دانلود و مطالعه رایگان کتاب ${book.title} نوشته ${authorName}. ${book.description || book.subtitle} - ${book.free_preview_pages} صفحه اول را رایگان و دوزبانه (فارسی/انگلیسی) در پلتفرم کتاب‌یار بخوانید و واژگان آن را یاد بگیرید.`
      : `دانلود رایگان کتاب ${book.title} اثر ${authorName}. مطالعه آنلاین به صورت دوزبانه. ${book.free_preview_pages} صفحه رایگان در کتاب‌یار.`

    // Agent 1's ENHANCED Keywords: Optimized for Persian search patterns
    const keywords = [
      // Primary keywords (exact match for searches)
      `دانلود کتاب ${book.title}`,
      `دانلود رایگان کتاب ${book.title}`,
      `مطالعه آنلاین ${book.title}`,
      `کتاب ${book.title}`,
      `کتاب ${book.title} pdf`,

      // Author-based keywords
      `کتاب ${authorName}`,
      `آثار ${authorName}`,
      authorName,

      // Generic high-volume keywords
      'دانلود کتاب',
      'دانلود رایگان کتاب',
      'مطالعه آنلاین کتاب',
      'کتاب آنلاین',
      'پلتفرم کتاب',
      'کتاب رایگان',

      // Bilingual & learning keywords
      'کتاب دوزبانه',
      'کتاب انگلیسی فارسی',
      'یادگیری زبان انگلیسی',
      'یادگیری با کتاب',

      // Brand
      'کتاب‌یار',
      book.title,

      // Genres (if available)
      ...(book.genres || []),
    ]

    return {
      title,
      description,
      keywords,
      authors: [{ name: authorName }],
      openGraph: {
        title: book.title,
        description: description,
        type: 'book',
        images: book.cover_url ? [
          {
            url: book.cover_url,
            width: 300,
            height: 450,
            alt: `جلد کتاب ${book.title}`,
          }
        ] : [],
        siteName: 'کتاب‌یار',
      },
      twitter: {
        card: 'summary_large_image',
        title: book.title,
        description: description,
        images: book.cover_url ? [book.cover_url] : [],
      },
      alternates: {
        canonical: `https://ketabyar.com/books/${slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'خطا | کتاب‌یار',
      description: 'خطا در بارگذاری اطلاعات کتاب',
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

    // Parallel data fetching for performance
    const [reviews, relatedBooksData] = await Promise.all([
      getReviewsByBookId(book.id).catch(() => []),
      getRelatedBooks(book.id, book.genres || [], 4).catch(() => []),
    ])

    // Transform related books to match MockBook interface
    const relatedBooks = relatedBooksData.map(b => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      subtitle: b.subtitle || '',
      author: b.author,
      authorId: b.author_id || '',
      coverImage: b.cover_url || b.cover_image || '',
      genre: b.genres || [],
      rating: b.rating || 0,
      reviewCount: 0, // Will be populated from reviews
      pageCount: b.total_pages || 0,
      publicationYear: b.publication_year || 2024,
      language: [b.language || 'en'],
      summary: b.description || b.summary || '',
      isbn: b.isbn || '',
      publisher: b.publisher || '',
      freePreviewPages: b.free_preview_pages || 20,
      status: (b.status as 'published' | 'draft') || 'published',
      content: [], // Not needed for card display
    }))

    // ✅ AGENT 1 (SEO): ENHANCED JSON-LD Structured Data for Google Rich Results
    // Optimized for Persian search queries and rich snippets
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      alternateName: `کتاب ${book.title}`,
      author: {
        '@type': 'Person',
        name: typeof book.authors === 'object' && book.authors !== null ? book.authors.name : book.author,
      },
      url: `https://ketabyar.com/books/${slug}`,
      image: book.cover_url,
      description: book.description || book.subtitle,
      isbn: book.isbn,
      bookFormat: 'https://schema.org/EBook',
      numberOfPages: book.total_pages,
      inLanguage: [book.language, 'fa', 'en'],
      genre: book.genres?.join(', '),
      publisher: {
        '@type': 'Organization',
        name: book.publisher || 'کتاب‌یار',
        url: 'https://ketabyar.com',
      },
      datePublished: book.publication_year?.toString(),
      aggregateRating: book.rating ? {
        '@type': 'AggregateRating',
        ratingValue: book.rating,
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0.00',
        priceCurrency: 'IRR',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        description: `دانلود رایگان - ${book.free_preview_pages} صفحه رایگان`,
        seller: {
          '@type': 'Organization',
          name: 'کتاب‌یار',
        },
      },
      // Additional properties for better SEO
      keywords: `دانلود کتاب ${book.title}, دانلود رایگان کتاب ${book.title}, مطالعه آنلاین ${book.title}`,
      about: book.genres?.map((genre: string) => ({
        '@type': 'Thing',
        name: genre,
      })),
    }

    // ✅ AGENT 1 (SEO): BreadcrumbList for better navigation and SEO
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'خانه',
          item: 'https://ketabyar.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'کتاب‌ها',
          item: 'https://ketabyar.com/books',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: book.title,
          item: `https://ketabyar.com/books/${slug}`,
        },
      ],
    }

    return (
      <>
        {/* ✅ AGENT 1: Book Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ✅ AGENT 1: Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
