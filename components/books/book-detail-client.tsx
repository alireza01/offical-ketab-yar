'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface BookDetailClientProps {
  book: any
  author: any
  reviews: any[]
  relatedBooks: any[]
}

export function BookDetailClient({ book, author, reviews, relatedBooks }: BookDetailClientProps) {
  return (
    <div className="container py-8">
      <Card className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-[2/3] bg-muted rounded-lg" />
          <div>
            <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
            <p className="text-muted-foreground mb-6">by {typeof author === 'object' ? author.name : book.author}</p>
            <p className="mb-6">{book.description || book.summary || 'No description available'}</p>
            <Link href={`/library/read/${book.slug}`}>
              <Button className="bg-[#D4AF37] hover:bg-[#C9A961]">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Reading
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
