import { SimpleBookForm } from '@/components/admin/simple-book-form'
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
          Upload book content as JSON files and add metadata
        </p>
      </div>

      <SimpleBookForm />
    </div>
  )
}
