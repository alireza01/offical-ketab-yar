'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

interface Book {
  id: string
  slug: string
  title: string
  subtitle: string | null
  author: string
  coverImage: string | null
  totalPages: number | null
  freePreviewPages: number
  isPremium: boolean
  contentEnUrl: string | null
  contentFaUrl: string | null
  currentPage: number
  status: string
  progressPercentage: number
}

interface ReaderWithTrackingProps {
  book: Book
  userId: string
}

export function ReaderWithTracking({ book, userId }: ReaderWithTrackingProps) {
  useEffect(() => {
    // Track reading session
    console.log('Reading session started for book:', book.id)
  }, [book.id])

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          {book.subtitle && (
            <p className="text-xl text-muted-foreground mb-8">{book.subtitle}</p>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p>Book content will be loaded here...</p>
            <p>Current page: {book.currentPage}</p>
            <p>Progress: {book.progressPercentage}%</p>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" size="lg">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <span className="text-muted-foreground">
              Page {book.currentPage} of {book.totalPages || 0}
            </span>
            <Button variant="outline" size="lg">
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
