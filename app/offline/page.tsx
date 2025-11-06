'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllDownloadedBooks } from '@/lib/pwa/offline-storage'
import { BookOpen, RefreshCw, WifiOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DownloadedBook {
    id: string
    title: string
    coverImage: string
    downloadedAt: string
}

export default function OfflinePage() {
    const [downloadedBooks, setDownloadedBooks] = useState<DownloadedBook[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadDownloadedBooks() {
            try {
                const books = await getAllDownloadedBooks()
                // Map to expected format
                const formattedBooks = books.map((book) => ({
                    id: book.slug,
                    title: book.title.fa || book.title.en,
                    coverImage: book.coverImage,
                    downloadedAt: book.downloadedAt
                }))
                setDownloadedBooks(formattedBooks)
            } catch (error) {
                console.error('Failed to load downloaded books:', error)
            } finally {
                setLoading(false)
            }
        }

        loadDownloadedBooks()
    }, [])

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Offline Status */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-gold/10 p-6">
                            <WifiOff className="h-16 w-16 text-gold" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">شما آفلاین هستید</h1>
                        <p className="text-muted-foreground">
                            اتصال اینترنت شما قطع شده است. اما می‌توانید کتاب‌های دانلود شده را
                            بخوانید.
                        </p>
                    </div>

                    <Button onClick={() => window.location.reload()} size="lg">
                        <RefreshCw className="mr-2 h-5 w-5" />
                        تلاش مجدد برای اتصال
                    </Button>
                </div>

                {/* Downloaded Books */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-gold" />
                            کتاب‌های دانلود شده ({downloadedBooks.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                در حال بارگذاری...
                            </div>
                        ) : downloadedBooks.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {downloadedBooks.map((book) => (
                                    <Link
                                        key={book.id}
                                        href={`/books/read/${book.id}`}
                                        className="group"
                                    >
                                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-2">
                                            <Image
                                                src={book.coverImage}
                                                alt={book.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        </div>
                                        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-gold transition-colors">
                                            {book.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <p className="text-muted-foreground">
                                    هنوز کتابی دانلود نکرده‌اید
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    💡 برای خواندن آفلاین، ابتدا کتاب‌ها را دانلود کنید
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-gold/5 border-gold/20">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-3">💡 نکات مفید:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• کتاب‌های دانلود شده به صورت رمزنگاری شده ذخیره می‌شوند</li>
                            <li>• پیشرفت مطالعه شما پس از اتصال به اینترنت همگام‌سازی می‌شود</li>
                            <li>• XP و استریک شما به صورت خودکار به‌روزرسانی خواهد شد</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
