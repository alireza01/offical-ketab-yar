'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { QuizCelebration } from '@/components/review/quiz-celebration'
import { QuizInterface } from '@/components/review/quiz-interface'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function QuizPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)
  const [results, setResults] = useState<{
    correct: number
    incorrect: number
    xpEarned: number
    duration: number
  } | null>(null)
  const [streak, setStreak] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookId = searchParams.get('book')
  const supabase = createClient()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }: { data: { user: { id: string } | null } }) => {
      if (data.user) {
        setUserId(data.user.id)
        supabase
          .from('users')
          .select('current_streak')
          .eq('id', data.user.id)
          .single()
          .then(({ data: userData }: { data: { current_streak: number } | null }) => {
            if (userData) {
              setStreak(userData.current_streak || 0)
            }
          })
      } else {
        router.push('/auth/login')
      }
    })
  }, [router, supabase])

  const handleQuizComplete = async (quizResults: {
    correct: number
    incorrect: number
    xpEarned: number
    duration: number
  }) => {
    setResults(quizResults)
    setQuizComplete(true)

    if (userId) {
      const { data: userData } = await supabase
        .from('users')
        .select('current_streak')
        .eq('id', userId)
        .single()

      if (userData) {
        setStreak(userData.current_streak || 0)
      }
    }
  }

  const handleContinue = () => {
    router.push('/review')
  }

  const handleReview = () => {
    router.push('/review/history')
  }

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/review">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="size-4 mr-2" />
            بازگشت به داشبورد
          </Button>
        </Link>
        {!quizComplete && (
          <div>
            <h1 className="text-3xl font-bold">آزمون روزانه</h1>
            <p className="text-muted-foreground mt-1">
              با پاسخ به سوالات، واژگان خود را تقویت کنید
            </p>
          </div>
        )}
      </motion.div>

      {!quizComplete ? (
        <QuizInterface
          userId={userId}
          bookId={bookId || undefined}
          sessionType="daily_quiz"
          onComplete={handleQuizComplete}
        />
      ) : results ? (
        <QuizCelebration
          correct={results.correct}
          incorrect={results.incorrect}
          total={results.correct + results.incorrect}
          xpEarned={results.xpEarned}
          duration={results.duration}
          streak={streak}
          onContinue={handleContinue}
          onReview={handleReview}
        />
      ) : null}
    </div>
  )
}
