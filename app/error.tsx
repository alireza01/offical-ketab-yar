'use client'

/**
 * ✅ AGENT 3 (Psychology): Premium error page that maintains brand trust
 * ✅ AGENT 2 (Performance): Client-side error boundary for graceful degradation
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service (e.g., Sentry)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 p-4">
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">خطایی رخ داده است</CardTitle>
          <CardDescription className="text-base mt-2">
            متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
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

          {/* Support Link */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              اگر مشکل ادامه دارد،{' '}
              <Link
                href="/support"
                className="text-gold-600 hover:text-gold-700 underline"
              >
                با پشتیبانی تماس بگیرید
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
