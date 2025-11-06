import { BookGrid } from '@/components/books/book-grid'
import { LibraryHeader } from '@/components/library/library-header'
import { BookGridSkeleton } from '@/components/skeletons/book-card-skeleton'
import type { Metadata } from 'next'
import { Suspense } from 'react'

// Force dynamic rendering (contains client components)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'کتابخانه کتاب‌های انگلیسی | بیش از 1000 کتاب رایگان | کتاب‌یار',
  description: 'مرور بیش از 1000 کتاب انگلیسی با ترجمه فارسی. دسته‌بندی بر اساس ژانر، نویسنده، و سطح دشواری. شروع رایگان بدون نیاز به ثبت‌نام.',
  keywords: [
    'کتابخانه',
    'کتاب انگلیسی',
    'کتاب رایگان',
    'دانلود کتاب',
    'کتاب دوزبانه',
    'library',
    'English books',
    'free books',
    'bilingual books',
  ],
  alternates: {
    canonical: 'https://ketabyar.ir/library',
  },
  openGraph: {
    title: 'کتابخانه کتاب‌یار - بیش از 1000 کتاب انگلیسی رایگان',
    description: 'مرور و خواندن بیش از 1000 کتاب انگلیسی با ترجمه فارسی',
    url: 'https://ketabyar.ir/library',
    type: 'website',
    images: ['/og-library.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'کتابخانه کتاب‌یار - 1000+ کتاب رایگان',
    description: 'مرور و خواندن کتاب‌های انگلیسی با ترجمه فارسی',
    images: ['/og-library.png'],
  },
}

// Mock categories data
const categories = [
  { id: 1, name: 'داستانی', slug: 'fiction' },
  { id: 2, name: 'خودیاری', slug: 'self-help' },
  { id: 3, name: 'کسب‌وکار', slug: 'business' },
  { id: 4, name: 'عاشقانه', slug: 'romance' },
  { id: 5, name: 'بیوگرافی', slug: 'biography' },
  { id: 6, name: 'کلاسیک', slug: 'classic' },
  { id: 7, name: 'علمی تخیلی', slug: 'sci-fi' },
  { id: 8, name: 'تاریخی', slug: 'historical' },
]

export default function LibraryPage() {
  // JSON-LD CollectionPage Schema for SEO (Agent 1)
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'کتابخانه کتاب‌یار',
    description: 'مجموعه بیش از 1000 کتاب انگلیسی با ترجمه فارسی',
    url: 'https://ketabyar.ir/library',
    publisher: {
      '@type': 'Organization',
      name: 'کتاب‌یار',
      logo: 'https://ketabyar.ir/logo.png',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'کتاب‌های موجود',
      description: 'لیست کتاب‌های انگلیسی با ترجمه فارسی',
    },
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen">
        <LibraryHeader categories={categories} />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<BookGridSkeleton />}>
            <BookGrid />
          </Suspense>
        </div>
      </div>
    </>
  )
}
