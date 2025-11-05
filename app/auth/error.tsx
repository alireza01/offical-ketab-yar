'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Auth error:', error)
  }, [error])

  // Agent 3 (Psychology): User-friendly error messages
  const getUserFriendlyMessage = (errorMessage: string) => {
    if (errorMessage.includes('network')) {
      return 'مشکل در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.'
    }
    if (errorMessage.includes('timeout')) {
      return 'زمان اتصال به پایان رسید. لطفاً دوباره تلاش کنید.'
    }
    if (errorMessage.includes('Invalid')) {
      return 'اطلاعات وارد شده صحیح نیست. لطفاً دوباره بررسی کنید.'
    }
    return 'متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.'
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto max-w-md border-destructive/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-6 text-destructive" />
          </div>
          <CardTitle>خطا در احراز هویت</CardTitle>
          <CardDescription>
            نگران نباشید، می‌توانیم این مشکل را حل کنیم
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              {getUserFriendlyMessage(error.message)}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button onClick={reset} className="w-full" variant="outline">
              <RefreshCw className="ml-2 size-4" />
              تلاش مجدد
            </Button>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                <Home className="ml-2 size-4" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="mb-2 font-semibold">راهنمایی:</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>اتصال اینترنت خود را بررسی کنید</li>
              <li>مرورگر خود را رفرش کنید</li>
              <li>کوکی‌ها را پاک کنید</li>
              <li>از مرورگر دیگری امتحان کنید</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
