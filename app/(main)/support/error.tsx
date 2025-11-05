'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function SupportError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Support page error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex items-center justify-center p-4">
            <Card className="p-8 max-w-md text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری صفحه پشتیبانی</h2>
                <p className="text-muted-foreground mb-6">
                    متأسفانه مشکلی پیش آمده است. می‌توانید از طریق ایمیل با ما تماس بگیرید.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={reset}
                        variant="outline"
                    >
                        <RefreshCw className="ml-2 h-4 w-4" />
                        تلاش مجدد
                    </Button>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400"
                    >
                        <Link href="mailto:support@ketabyar.com">
                            ارسال ایمیل
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    )
}
