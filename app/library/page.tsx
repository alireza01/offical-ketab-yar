import { BookGrid } from '@/components/books/book-grid'
import { LibraryHeader } from '@/components/library/library-header'
import { BookGridSkeleton } from '@/components/skeletons/book-card-skeleton'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'کتابخانه | کتاب‌یار',
  description: 'مرور مجموعه کتاب‌های ما',
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
  return (
    <div className="min-h-screen">
      <LibraryHeader categories={categories} />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<BookGridSkeleton />}>
          <BookGrid />
        </Suspense>
      </div>
    </div>
  )
}
