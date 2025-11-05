'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface SimpleBookFormProps {
  bookId?: string
  initialData?: {
    title?: string
    author?: string
    summary?: string
  }
}

export function SimpleBookForm({ initialData }: SimpleBookFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [author, setAuthor] = useState(initialData?.author || '')
  const [summary, setSummary] = useState(initialData?.summary || '')

  return (
    <Card className="p-6">
      <form className="space-y-6">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book title"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Author</label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Summary</label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Book summary"
            rows={6}
          />
        </div>
        <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C9A961]">
          Save Book
        </Button>
      </form>
    </Card>
  )
}
