'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

/**
 * Error boundary for books module
 * ✅ AGENT 3 (PSYCHOLOGY): Friendly error handling with clear actions
 */
export default function BooksError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Use centralized logger (Agent 2: Best Practice)
        if (typeof window !== 'undefined') {
            import('@/lib/logger').then(({ logger }) => {
                logger.error('Books module error occurred', error, {
                    context: 'BooksError',
                    metadata: { digest: error.digest },
                })
            })
        }
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center space-y-6">
                    {/* Error Icon */}
                    <div className="flex justify-center">
                        <div className="rounded-full bg-destructive/10 p-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">خطایی رخ داد</h1>
                        <p className="text-muted-foreground">
                            متأسفانه در بارگذاری کتاب مشکلی پیش آمد. لطفاً دوباره تلاش کنید.
                        </p>
                    </div>

                    {/* Error Details (Development Only) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="text-left bg-muted p-4 rounded-lg">
                            <p className="text-xs font-mono text-muted-foreground break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs font-mono text-muted-foreground mt-2">
                                    Digest: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={reset}
                            className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
                        >
                            <RefreshCw className="ml-2 h-4 w-4" />
                            تلاش مجدد
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            asChild
                        >
                            <Link href="/">
                                <Home className="ml-2 h-4 w-4" />
                                بازگشت به خانه
                            </Link>
                        </Button>
                    </div>

                    {/* Help Link */}
                    <p className="text-sm text-muted-foreground">
                        اگر مشکل ادامه دارد،{' '}
                        <Link href="/support" className="text-gold-600 hover:underline">
                            با پشتیبانی تماس بگیرید
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
