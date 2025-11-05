'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Book {
    id: string
    slug: string
    title: string
    author: string
    coverImage?: string | null
    currentPage?: number
    totalPages?: number | null
    progressPercentage?: number
}

interface LibraryProps {
    books: Book[]
    title?: string
}

export { LibraryClient } from './library-client'

export function Library({ books, title = 'My Library' }: LibraryProps) {
    if (books.length === 0) {
        return (
            <div className="container py-16 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No books yet</h2>
                <p className="text-muted-foreground mb-6">Start reading to build your library</p>
                <Button asChild className="bg-[#D4AF37] hover:bg-[#C9A961]">
                    <Link href="/library">Browse Books</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">{title}</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                    <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <Link href={`/library/read/${book.slug}`}>
                            <CardContent className="p-0">
                                {book.coverImage ? (
                                    <Image
                                        src={book.coverImage}
                                        alt={book.title}
                                        width={300}
                                        height={450}
                                        className="w-full aspect-[2/3] object-cover"
                                    />
                                ) : (
                                    <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                                    {book.progressPercentage !== undefined && book.progressPercentage > 0 && (
                                        <div className="space-y-1">
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#D4AF37]"
                                                    style={{ width: `${book.progressPercentage}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {book.progressPercentage}% complete
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    )
}
