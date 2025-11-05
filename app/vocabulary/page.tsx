'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { VocabularyDashboard } from '@/components/vocabulary'
import { createBrowserClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import { Crown, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Vocabulary Page (Pure CSR)
 * ✅ AGENT 2 (PERFORMANCE): Zero server load, client-side only
 * ✅ AGENT 3 (PSYCHOLOGY): Freemium limits, upgrade prompts, gamification
 * ✅ AGENT 1 (SEO): Blocked from robots.txt (private zone)
 */

export default function VocabularyPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; subscription_tier?: string } | null>(null)
  const [vocabularyCount, setVocabularyCount] = useState(0)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login?redirect=/vocabulary')
        return
      }

      // Get user subscription tier
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', authUser.id)
        .single()

      setUser({ id: authUser.id, subscription_tier: userData?.subscription_tier })

      // Get vocabulary count for freemium logic
      const { count } = await supabase
        .from('vocabulary')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id)

      setVocabularyCount(count || 0)

      // Show upgrade prompt if near limit (Agent 3: FOMO psychology)
      if (userData?.subscription_tier === 'free' && count && count >= 18) {
        setShowUpgradePrompt(true)
      }

      setIsLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  if (isLoading) {
    return <VocabularyPageSkeleton />
  }

  if (!user) {
    return null
  }

  const isFree = user.subscription_tier === 'free'
  const limit = 20
  const remaining = Math.max(0, limit - vocabularyCount)
  const percentage = Math.min(100, (vocabularyCount / limit) * 100)

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Agent 3 (Psychology): Freemium Limit Banner with FOMO */}
      <AnimatePresence>
        {isFree && vocabularyCount >= 15 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className={`relative overflow-hidden rounded-lg border-2 p-6 ${remaining === 0
              ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
              : 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
              }`}>
              {/* Animated background */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="h-full w-full bg-gradient-to-br from-gold-400 via-amber-400 to-gold-600"
                  style={{ backgroundSize: '400% 400%' }}
                />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {remaining === 0 ? (
                      <>
                        <Crown className="h-6 w-6 text-red-600" />
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
                          حافظه واژگان شما پر شد!
                        </h3>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6 text-amber-600" />
                        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                          {remaining} کلمه تا پر شدن حافظه!
                        </h3>
                      </>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {remaining === 0 ? (
                      <>
                        شما به حداکثر {limit} کلمه رایگان رسیده‌اید.
                        <span className="font-semibold text-amber-700 dark:text-amber-300"> با ارتقا به پرمیوم، کلمات نامحدود ذخیره کنید!</span>
                      </>
                    ) : (
                      <>
                        در پلن رایگان، فقط {limit} کلمه می‌توانید ذخیره کنید.
                        <span className="font-semibold text-amber-700 dark:text-amber-300"> با پرمیوم، بدون محدودیت یاد بگیرید!</span>
                      </>
                    )}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{vocabularyCount} / {limit} کلمه</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full ${percentage >= 100
                          ? 'bg-red-500'
                          : percentage >= 75
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                          }`}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white shadow-lg"
                >
                  <Link href="/subscription" className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    <span>ارتقا به پرمیوم</span>
                    <TrendingUp className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main vocabulary dashboard */}
      <VocabularyDashboard />

      {/* Agent 3 (Psychology): Floating upgrade prompt for critical state */}
      <AnimatePresence>
        {showUpgradePrompt && remaining === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-br from-gold-600 to-gold-500 text-white p-6 rounded-2xl shadow-2xl border-2 border-gold-400">
              <button
                onClick={() => setShowUpgradePrompt(false)}
                className="absolute top-2 right-2 text-white/80 hover:text-white"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8" />
                  <h4 className="text-xl font-bold">حافظه پر شد!</h4>
                </div>

                <p className="text-sm text-white/90">
                  برای ادامه یادگیری و ذخیره کلمات جدید، به پرمیوم ارتقا دهید.
                </p>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>کلمات نامحدود</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>فلش‌کارت پیشرفته</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>آزمون‌های هوشمند</span>
                  </li>
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white text-gold-700 hover:bg-white/90"
                >
                  <Link href="/subscription">
                    مشاهده پلن‌ها
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Loading component for better UX (Agent 3: Psychology)
function VocabularyPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  )
}
