// Subscription success page
// Agent 3: Celebration and positive reinforcement

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'خرید موفق | کتاب‌یار',
    description: 'اشتراک شما با موفقیت فعال شد',
    robots: {
        index: false,
        follow: false,
    },
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function SubscriptionSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-muted/30 to-background">
            <Card className="max-w-2xl w-full p-12 text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-gold-600/5" />

                <div className="relative">
                    {/* Success icon with animation */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30 animate-bounce">
                        <CheckCircle className="h-12 w-12 text-white" />
                    </div>

                    {/* Confetti effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                        <Sparkles className="h-8 w-8 text-gold-500 animate-pulse" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
                        🎉 تبریک!
                    </h1>

                    <p className="text-xl md:text-2xl font-semibold mb-4">
                        اشتراک شما با موفقیت فعال شد
                    </p>

                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        حالا می‌تونید از تمام امکانات پرمیوم کتاب‌یار استفاده کنید و یادگیری زبان رو به یه تجربه لذت‌بخش تبدیل کنید!
                    </p>

                    {/* Features unlocked */}
                    <div className="bg-muted/30 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-lg mb-4">امکانات فعال شده:</h3>
                        <div className="grid md:grid-cols-2 gap-3 text-right">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>دسترسی نامحدود به کتاب‌ها</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>دستیار AI پیشرفته</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>ذخیره واژگان نامحدود</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>دانلود آفلاین</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>حذف تبلیغات</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <span>پشتیبانی اولویت‌دار</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white shadow-xl" asChild>
                            <Link href="/library">
                                <Sparkles className="ml-2 h-5 w-5" />
                                شروع خواندن
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/dashboard">
                                مشاهده داشبورد
                            </Link>
                        </Button>
                    </div>

                    {/* Additional info */}
                    <p className="text-sm text-muted-foreground mt-8">
                        رسید پرداخت به ایمیل شما ارسال شد
                    </p>
                </div>
            </Card>
        </div>
    )
}
