import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { createServerClient } from '@/lib/supabase/server'
import { BookOpen, Plus, Search } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Manage Books | Admin',
    description: 'Manage all books in the library',
}

export const dynamic = 'force-dynamic'

interface Author {
    name: string
}

interface BookFromDB {
    id: string
    title: string
    slug: string
    author_id: string
    status: string
    created_at: string
    total_pages: number | null
    genres: string[] | null
    authors: Author | Author[] | null
}

interface BookWithAuthor {
    id: string
    title: string
    slug: string
    author_id: string
    status: string
    created_at: string
    total_pages: number | null
    genres: string[] | null
    authorName: string
}

async function getBooks(searchQuery?: string): Promise<BookWithAuthor[]> {
    const supabase = await createServerClient()

    let query = supabase
        .from('books')
        .select(`
      id,
      title,
      slug,
      author_id,
      status,
      created_at,
      total_pages,
      genres,
      authors (
        name
      )
    `)
        .order('created_at', { ascending: false })

    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`)
    }

    const { data: books, error } = await query

    if (error) {
        console.error('Error fetching books:', error)
        return []
    }

    // Transform the data to handle authors array
    return (books || []).map((book: BookFromDB) => {
        const authors = book.authors
        const authorName = Array.isArray(authors)
            ? authors[0]?.name || 'Unknown'
            : authors?.name || 'Unknown'

        return {
            ...book,
            authorName
        }
    })
}

function BooksTableSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
        </div>
    )
}

async function BooksTable({ searchQuery }: { searchQuery?: string }) {
    const books = await getBooks(searchQuery)

    if (books.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No books found</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'Get started by adding your first book'}
                    </p>
                    <Button asChild>
                        <Link href="/admin/books/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Books ({books.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pages</TableHead>
                            <TableHead>Genres</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell className="font-medium">{book.title}</TableCell>
                                <TableCell>
                                    {book.authorName}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${book.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : book.status === 'draft'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {book.status}
                                    </span>
                                </TableCell>
                                <TableCell>{book.total_pages || 'N/A'}</TableCell>
                                <TableCell>
                                    {book.genres?.slice(0, 2).join(', ') || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {new Date(book.created_at).toLocaleDateString('fa-IR')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/books/${book.id}/edit`}>Edit</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function BooksPage({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Books</h1>
                    <p className="text-muted-foreground">
                        Manage all books in your library
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/books/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Book
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action="/admin/books" method="get">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                name="q"
                                placeholder="Search books by title or slug..."
                                className="pl-10"
                                defaultValue={searchParams.q}
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Suspense fallback={<BooksTableSkeleton />}>
                <BooksTable searchQuery={searchParams.q} />
            </Suspense>
        </div>
    )
}
