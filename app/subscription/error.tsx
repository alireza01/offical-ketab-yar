'use client'

// Error boundary for subscription page
// Agent 2: Graceful error handling

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function SubscriptionError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Subscription page error:', error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-4">خطا در بارگذاری صفحه</h2>
                <p className="text-muted-foreground mb-8">
                    متأسفانه مشکلی در بارگذاری صفحه قیمت‌گذاری پیش آمد. لطفاً دوباره تلاش کنید.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={reset} size="lg">
                        تلاش مجدد
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <a href="/">بازگشت به صفحه اصلی</a>
                    </Button>
                </div>
            </Card>
        </div>
    )
}
