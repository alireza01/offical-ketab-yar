'use client'

import { AlertCircle, Home } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { logger } from '@/lib/logger'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Use centralized logger instead of console.error (Agent 0: Best Practice)
    logger.error('Authentication error occurred', error, {
      context: 'AuthError',
      metadata: { digest: error.digest },
    })
  }, [error])

  // User-friendly error message (Agent 3: Psychology)
  const getUserFriendlyMessage = (errorMessage: string) => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'ایمیل یا رمز عبور اشتباه است'
    }
    if (errorMessage.includes('Email not confirmed')) {
      return 'لطفاً ابتدا ایمیل خود را تأیید کنید'
    }
    if (errorMessage.includes('network')) {
      return 'لطفاً اتصال اینترنت خود را بررسی کنید'
    }
    return 'متأسفانه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-destructive size-5" />
            <CardTitle>خطا در احراز هویت</CardTitle>
          </div>
          <CardDescription>
            {getUserFriendlyMessage(error.message)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full bg-gold hover:bg-gold/90"
          >
            تلاش مجدد
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            <Home className="ml-2 h-4 w-4" />
            بازگشت به صفحه اصلی
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 
