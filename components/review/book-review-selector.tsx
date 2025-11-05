"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createBrowserClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BookReviewSelectorProps {
    userId: string
}

interface Book {
    id: string
    title: string
    slug: string
    cover_image_url: string | null
}

interface BookWithWords {
    id: string
    title: string
    slug: string
    cover_image_url: string | null
    wordCount: number
}

export function BookReviewSelector({ userId }: BookReviewSelectorProps) {
    const [books, setBooks] = useState<BookWithWords[]>([])
    const [totalWords, setTotalWords] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadBooks = async () => {
            const supabase = createBrowserClient()

            const { data: vocabulary } = await supabase
                .from('vocabulary')
                .select('book_id, books(id, title, slug, cover_image_url)')
                .eq('user_id', userId)

            if (vocabulary) {
                const bookMap = new Map<string, BookWithWords>()

                vocabulary.forEach((item: { books: Book; word: string }) => {
                    if (item.books) {
                        const bookId = item.books.id
                        if (bookMap.has(bookId)) {
                            bookMap.get(bookId)!.wordCount++
                        } else {
                            bookMap.set(bookId, {
                                id: item.books.id,
                                title: item.books.title,
                                slug: item.books.slug,
                                cover_image_url: item.books.cover_image_url,
                                wordCount: 1
                            })
                        }
                    }
                })

                const booksArray = Array.from(bookMap.values())
                    .sort((a, b) => b.wordCount - a.wordCount)

                setBooks(booksArray)
                setTotalWords(vocabulary.length)
            }

            setIsLoading(false)
        }

        loadBooks()
    }, [userId])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/review/quiz">
                    <Card className="border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-[#D4AF37]/10">
                                    <Brain className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">آزمون روزانه</h3>
                                    <p className="text-sm text-muted-foreground">همه کلمات</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/review/flashcard">
                    <Card className="border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/10">
                                    <Zap className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">فلش‌کارت</h3>
                                    <p className="text-sm text-muted-foreground">همه کلمات</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/review/history">
                    <Card className="border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-purple-500/10">
                                    <BookOpen className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">تاریخچه</h3>
                                    <p className="text-sm text-muted-foreground">{totalWords} کلمه</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Books */}
            {books.length > 0 && (
                <Card className="border-[#D4AF37]/20">
                    <CardHeader>
                        <CardTitle>مرور بر اساس کتاب</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {books.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-[#D4AF37]/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-24 bg-muted rounded flex-shrink-0">
                                                    {book.cover_image_url && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={book.cover_image_url}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold truncate">{book.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {book.wordCount} کلمه
                                                    </p>
                                                    <div className="flex gap-2 mt-2">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link href={`/review/quiz?book=${book.id}`}>
                                                                آزمون
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link href={`/review/flashcard?book=${book.id}`}>
                                                                فلش‌کارت
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
