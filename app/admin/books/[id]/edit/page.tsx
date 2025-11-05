import { SimpleBookForm } from '@/components/admin/simple-book-form'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Edit Book | Admin',
    description: 'Edit book details',
}

export const dynamic = 'force-dynamic'

async function getBook(id: string) {
    const supabase = await createServerClient()

    const { data: book, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !book) {
        return null
    }

    return book
}

export default async function EditBookPage({
    params,
}: {
    params: { id: string }
}) {
    const book = await getBook(params.id)

    if (!book) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
                <p className="text-muted-foreground">
                    Update book content and metadata
                </p>
            </div>

            <SimpleBookForm bookId={book.id} initialData={book} />
        </div>
    )
}
