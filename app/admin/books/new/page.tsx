import { BookEditor } from '@/components/admin/book-editor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add New Book | Admin',
  description: 'Add a new book to the library',
}

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground">
          Create and publish a new book to the library
        </p>
      </div>

      <BookEditor />
    </div>
  )
}
