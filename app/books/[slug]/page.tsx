import { BookDetailClient } from '@/components/books/book-detail-client'
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
    return books.map((book) => ({
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
        title: 'کتاب یافت نشد | Book Not Found | کتاب‌یار',
        description: 'کتاب مورد نظر یافت نشد. به کتابخانه بازگردید و کتاب دیگری انتخاب کنید.',
      }
    }

    const authorName = book.author?.name || 'Unknown Author'
    const bookTitle = typeof book.title === 'string' ? book.title : book.title.en
    const bookTitleFa = typeof book.title === 'string' ? book.title : (book.title.fa || book.title.en)
    const bookSummary = typeof book.summary === 'string' ? book.summary : (book.summary?.en || '')
    const bookSummaryFa = typeof book.summary === 'string' ? book.summary : (book.summary?.fa || book.summary?.en || '')

    // Agent 1 (SEO): Persian-optimized title for Google.fa rankings
    const seoTitle = `دانلود رایگان کتاب ${bookTitleFa} | ${bookTitle} | خلاصه و نقد | کتاب‌یار`
    const seoDescription = `خلاصه کامل کتاب ${bookTitleFa} (${bookTitle}) نوشته ${authorName}. مطالعه رایگان ${book.freePreviewPages || 20} صفحه اول به صورت دوزبانه (فارسی/انگلیسی). یادگیری زبان انگلیسی با کتاب در کتاب‌یار.`

    // Convert genres to string array
    const genreStrings = book.genres?.map((g: string | { name?: string; title?: string }) => typeof g === 'string' ? g : g.name || g.title || '') || []

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [
        // Persian keywords (Agent 1: Critical for Google.fa)
        'دانلود رایگان کتاب',
        'کتاب انگلیسی',
        'خلاصه کتاب',
        'نقد کتاب',
        'مطالعه آنلاین',
        'یادگیری زبان انگلیسی',
        bookTitleFa,
        bookTitle,
        authorName,
        // English keywords
        'free book download',
        'read online',
        'bilingual book',
        'English learning',
        'کتاب',
        'کتاب‌یار',
        ...genreStrings,
      ],
      alternates: {
        canonical: `https://ketabyar.ir/books/${slug}`,
        languages: {
          'fa': `https://ketabyar.ir/books/${slug}`,
          'en': `https://ketabyar.ir/books/${slug}`,
        },
      },
      openGraph: {
        title: `${bookTitleFa} | ${bookTitle} - ${authorName}`,
        description: bookSummaryFa || bookSummary || `مطالعه رایگان کتاب ${bookTitleFa} در کتاب‌یار`,
        images: [
          {
            url: book.coverImage || '/og-book-default.png',
            width: 1200,
            height: 630,
            alt: `جلد کتاب ${bookTitleFa} - ${bookTitle}`,
          },
        ],
        type: 'book',
        url: `https://ketabyar.ir/books/${slug}`,
        siteName: 'کتاب‌یار - Ketab-Yar',
        locale: 'fa_IR',
        alternateLocale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${bookTitleFa} | ${bookTitle}`,
        description: bookSummaryFa || bookSummary || '',
        images: [book.coverImage || '/og-book-default.png'],
        site: '@ketabyar',
        creator: '@ketabyar',
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  } catch {
    return {
      title: 'کتاب یافت نشد | Book Not Found | کتاب‌یار',
      description: 'کتاب مورد نظر یافت نشد. به کتابخانه بازگردید و کتاب دیگری انتخاب کنید.',
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

    // Agent 3 (Psychology): Check premium status for paywall
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isPremiumUser = false
    if (user) {
      const { checkPremiumStatus } = await import('@/lib/subscription/subscription-manager')
      isPremiumUser = await checkPremiumStatus(user.id)
    }

    const [reviews, relatedBooks] = await Promise.all([
      getReviewsByBookId(book._id).catch(() => []),
      getRelatedBooks(book._id, (book.genres || []).map((g: string | { name?: string; title?: string }) => typeof g === 'string' ? g : g.name || g.title || ''), 4).catch(() => []),
    ])

    const bookTitle = typeof book.title === 'string' ? book.title : book.title.en
    const bookTitleFa = typeof book.title === 'string' ? book.title : (book.title.fa || book.title.en)
    const bookSummary = typeof book.summary === 'string' ? book.summary : (book.summary?.en || '')
    const bookSummaryFa = typeof book.summary === 'string' ? book.summary : (book.summary?.fa || book.summary?.en || '')

    // Convert genres to string array
    const genreStrings = book.genres?.map((g: string | { name?: string; title?: string }) => typeof g === 'string' ? g : g.name || g.title || '') || []

    // Calculate average rating from reviews (Agent 1: Critical for Google stars)
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

    // JSON-LD Book Schema for SEO (Agent 1 - ENHANCED)
    const bookSchema = {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: bookTitle,
      alternateName: bookTitleFa,
      author: {
        '@type': 'Person',
        name: book.author?.name || 'Unknown Author',
        url: book.author?.slug ? `https://ketabyar.ir/authors/${book.author.slug}` : undefined,
      },
      isbn: book.isbn || undefined,
      numberOfPages: book.chapters?.length || undefined,
      inLanguage: ['en', 'fa'],
      description: bookSummaryFa || bookSummary,
      image: book.coverImage,
      aggregateRating: avgRating ? {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1',
      } : undefined,
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'IRR',
        url: `https://ketabyar.ir/books/${slug}`,
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      genre: genreStrings.join(', '),
      datePublished: book.publishYear?.toString(),
      publisher: {
        '@type': 'Organization',
        name: 'کتاب‌یار',
        url: 'https://ketabyar.ir',
      },
    }

    // Breadcrumb Schema (Agent 1: For Google breadcrumb display)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'خانه',
          item: 'https://ketabyar.ir',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'کتاب‌ها',
          item: 'https://ketabyar.ir/library',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: bookTitleFa,
          item: `https://ketabyar.ir/books/${slug}`,
        },
      ],
    }

    // Review Schema (Agent 1: For Google star ratings)
    const reviewSchemas = reviews.slice(0, 5).map((review, index) => ({
      '@context': 'https://schema.org',
      '@type': 'Review',
      '@id': `https://ketabyar.ir/books/${slug}#review-${index + 1}`,
      itemReviewed: {
        '@type': 'Book',
        name: bookTitle,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
      author: {
        '@type': 'Person',
        name: review.profiles?.full_name || 'کاربر کتاب‌یار',
      },
      reviewBody: review.comment,
      datePublished: new Date(review.created_at).toISOString(),
    }))

    return (
      <>
        {/* JSON-LD Structured Data (Agent 1: Complete SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {reviewSchemas.map((schema, index) => (
          <script
            key={`review-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        <BookDetailClient
          book={{
            _id: book._id,
            slug: book.slug,
            title: book.title,
            title_fa: typeof book.title === 'string' ? book.title : book.title.fa,
            subtitle: typeof book.subtitle === 'string' ? book.subtitle : book.subtitle?.en,
            cover_image: book.coverImage,
            rating: avgRating ? parseFloat(avgRating) : 0,
            review_count: reviews.length,
            page_count: book.chapters?.length || 0,
            publication_year: book.publishYear || 0,
            genres: genreStrings,
            languages: ['English', 'Persian'],
            isPremium: book.isPremium,
            free_preview_pages: book.freePreviewPages || 20,
            summary: typeof book.summary === 'string' ? book.summary : (book.summary?.en || ''),
            isbn: book.isbn,
            publisher: book.publisher,
          }}
          author={book.author ? {
            id: book.author._id,
            name: book.author.name,
            bio: typeof book.author.bio === 'string' ? book.author.bio : undefined,
            photo_url: book.author.photo || book.author.image,
          } : undefined}
          reviews={reviews}
          relatedBooks={relatedBooks}
          isPremiumUser={isPremiumUser}
        />
      </>
    )
  } catch (error) {
    console.error('Error loading book:', error)
    notFound()
  }
}
