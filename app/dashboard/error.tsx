"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useEffect } from "react"

export default function Error({
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
        logger.error('Dashboard error occurred', error, {
          context: 'DashboardError',
          metadata: { digest: error.digest },
        })
      })
    }
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-md border-red-200">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">خطا در بارگذاری داشبورد</h2>
              <p className="text-muted-foreground">
                متأسفانه در بارگذاری داشبورد خطایی رخ داد. لطفاً دوباره تلاش کنید.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="text-left p-4 bg-muted rounded-lg">
                <p className="text-xs font-mono text-red-600">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={reset} className="bg-[#D4AF37] hover:bg-[#C9A961]">
                تلاش مجدد
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                بازگشت به خانه
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
