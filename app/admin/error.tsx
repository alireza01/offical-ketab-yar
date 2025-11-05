'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Admin error:', error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        خطا در پنل مدیریت
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        متأسفانه خطایی رخ داده است. لطفاً دوباره تلاش کنید.
                    </p>
                    {error.message && (
                        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            {error.message}
                        </p>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={reset} className="flex-1">
                            تلاش مجدد
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                            بازگشت به داشبورد
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
