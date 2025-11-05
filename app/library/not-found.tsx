import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Home, Search } from 'lucide-react'
import Link from 'next/link'

/**
 * Not Found page for books module
 * ✅ AGENT 3 (PSYCHOLOGY): Helpful 404 with clear next actions
 * ✅ AGENT 1 (SEO): Proper 404 status for search engines
 */
export default function BookNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="rounded-full bg-gold-500/10 p-6">
                            <BookOpen className="h-16 w-16 text-gold-600" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">کتاب یافت نشد</h1>
                        <p className="text-muted-foreground">
                            متأسفانه کتاب مورد نظر شما در کتابخانه ما موجود نیست یا حذف شده است.
                        </p>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-muted/50 p-4 rounded-lg text-right space-y-2">
                        <p className="font-semibold text-sm">پیشنهادات:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• آدرس را بررسی کنید</li>
                            <li>• از جستجو استفاده کنید</li>
                            <li>• کتاب‌های پیشنهادی را مشاهده کنید</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
                            asChild
                        >
                            <Link href="/library">
                                <Search className="ml-2 h-4 w-4" />
                                جستجوی کتاب
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            asChild
                        >
                            <Link href="/">
                                <Home className="ml-2 h-4 w-4" />
                                صفحه اصلی
                            </Link>
                        </Button>
                    </div>

                    {/* Popular Books Link */}
                    <p className="text-sm text-muted-foreground">
                        یا{' '}
                        <Link href="/#trending" className="text-gold-600 hover:underline font-semibold">
                            کتاب‌های پرطرفدار
                        </Link>
                        {' '}را مشاهده کنید
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
