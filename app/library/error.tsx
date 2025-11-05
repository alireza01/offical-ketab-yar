"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertCircle, BookOpen, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service in production (Agent 2)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry
      // Sentry.captureException(error)
    } else {
      console.error('[Library Error]', {
        error: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      })
    }
  }, [error])

  return (
    <div className="container py-12 min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center max-w-md"
      >
        {/* Animated Icon (Agent 3 - Psychology) */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
            <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10">
              <AlertCircle className="size-10 text-destructive" />
            </div>
          </div>
        </motion.div>

        <h2 className="mb-3 text-3xl font-bold">مشکلی پیش آمد</h2>
        <p className="text-muted-foreground mb-2">
          متأسفانه در بارگذاری کتابخانه مشکلی پیش آمد.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/70 font-mono mb-6">
            کد خطا: {error.digest}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تلاش مجدد
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 ml-2" />
              بازگشت به خانه
            </Link>
          </Button>
        </div>

        {/* Helpful Suggestions (Agent 3 - UX) */}
        <div className="mt-8 pt-6 border-t border-border w-full">
          <p className="text-sm text-muted-foreground mb-3">پیشنهادات مفید:</p>
          <div className="space-y-2 text-sm text-muted-foreground text-right">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-500" />
              <span>به صفحه اصلی بروید و کتاب‌های پیشنهادی را ببینید</span>
            </div>
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-500" />
              <span>اتصال اینترنت خود را بررسی کنید</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
