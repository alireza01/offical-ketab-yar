'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { getBooks } from '@/lib/data'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { BookCard } from './book-card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// Agent 2 (Performance): TanStack Query for caching and optimistic updates
// Agent 0 (Investigation): Using unified data API that handles mock/real data automatically
async function fetchBooks() {
  const books = await getBooks()
  return books
}

export function BookGrid() {
  // Agent 2: Cache for 5 minutes, stale-while-revalidate strategy
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', 'published'],
    queryFn: fetchBooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })

  // Agent 3 (Psychology): Skeleton loading for better perceived performance
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-muted rounded-lg mb-3" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  // Agent 3: Helpful error message
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          خطا در بارگذاری کتاب‌ها. لطفاً صفحه را رفرش کنید.
        </AlertDescription>
      </Alert>
    )
  }

  // Agent 3: Empty state
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2">هنوز کتابی اضافه نشده</h3>
        <p className="text-muted-foreground">به زودی کتاب‌های جدید اضافه می‌شوند</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
    >
      {books.map((book) => (
        <motion.div key={book.id} variants={item}>
          <BookCard book={book} />
        </motion.div>
      ))}
    </motion.div>
  )
}
