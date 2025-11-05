'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function LibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Use centralized logger (Agent 2: Best Practice)
    if (typeof window !== 'undefined') {
      import('@/lib/logger').then(({ logger }) => {
        logger.error('Library error occurred', error, {
          context: 'LibraryError',
          metadata: { digest: error.digest },
        })
      })
    }
  }, [error])

  return (
    <div className="container min-h-screen flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
        >
          <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </motion.div>

        <h2 className="mb-3 text-3xl font-bold">مشکلی پیش آمد</h2>

        <p className="text-muted-foreground mb-8 text-lg">
          متأسفانه در بارگذاری کتابخانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.
        </p>

        <div className="flex gap-3">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            تلاش مجدد
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/">بازگشت به خانه</Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left w-full">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              جزئیات خطا (فقط در حالت توسعه)
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  )
}
