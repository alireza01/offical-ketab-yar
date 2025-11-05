/**
 * ✅ AGENT 3 (Psychology): Friendly 404 page that guides users back
 * ✅ AGENT 1 (SEO): Proper 404 handling prevents broken link penalties
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Home, Search } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'صفحه یافت نشد | کتاب‌یار',
    description: 'صفحه مورد نظر شما یافت نشد',
    robots: {
        index: false,
        follow: true,
    },
}

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 p-4">
            <Card className="mx-auto max-w-2xl w-full">
                <CardContent className="p-8 md:p-12">
                    <div className="text-center space-y-6">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="rounded-full bg-gold-500/10 p-8">
                                <BookOpen className="h-20 w-20 text-gold-600" />
                            </div>
                        </div>

                        {/* 404 Number */}
                        <div>
                            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 bg-clip-text text-transparent">
                                404
                            </h1>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <h2 className="text-2xl md:text-3xl font-bold">
                                صفحه یافت نشد
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
                                size="lg"
                                asChild
                            >
                                <Link href="/">
                                    <Home className="ml-2 h-5 w-5" />
                                    بازگشت به خانه
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                size="lg"
                                asChild
                            >
                                <Link href="/library">
                                    <Search className="ml-2 h-5 w-5" />
                                    جستجوی کتاب
                                </Link>
                            </Button>
                        </div>

                        {/* Popular Links */}
                        <div className="pt-8 border-t">
                            <p className="text-sm text-muted-foreground mb-4">
                                یا می‌توانید این صفحات را مشاهده کنید:
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/library">کتابخانه</Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard">داشبورد</Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/vocabulary">واژگان</Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/about">درباره ما</Link>
                                </Button>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/support">پشتیبانی</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
