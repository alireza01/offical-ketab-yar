'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { AlertCircle, BookOpen, Home, RefreshCw } from 'lucide-react'
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
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry or similar service
      // Sentry.captureException(error)
    } else {
      console.error('Error:', error)
    }
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        {/* Animated Icon */}
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
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">
            اوه! یک مشکل پیش آمد
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {error.message || 'متأسفانه یک خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید.'}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/70 font-mono">
              کد خطا: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 shadow-lg shadow-gold-500/30"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تلاش مجدد
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4 ml-2" />
              بازگشت به خانه
            </Link>
          </Button>
        </div>

        {/* Helpful Suggestions */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">پیشنهادات مفید:</p>
          <div className="space-y-2 text-sm text-muted-foreground text-right">
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-500" />
              <span>به کتابخانه بروید و مطالعه خود را ادامه دهید</span>
            </div>
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-500" />
              <span>صفحه را رفرش کنید یا اتصال اینترنت خود را بررسی کنید</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
