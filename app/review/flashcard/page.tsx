'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { FlashcardInterface } from '@/components/review/flashcard-interface'
import { QuizCelebration } from '@/components/review/quiz-celebration'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function FlashcardPage() {
    const [userId, setUserId] = useState<string | null>(null)
    const [complete, setComplete] = useState(false)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleComplete = async (sessionResults: {
        correct: number
        incorrect: number
        xpEarned: number
        duration: number
    }) => {
        setResults(sessionResults)
        setComplete(true)

        // Save session
        if (userId && supabase) {
            try {
                await supabase.from('review_sessions').insert({
                    user_id: userId,
                    session_type: 'flashcard',
                    words_reviewed: sessionResults.correct + sessionResults.incorrect,
                    correct_answers: sessionResults.correct,
                    incorrect_answers: sessionResults.incorrect,
                    xp_earned: sessionResults.xpEarned,
                    duration_seconds: sessionResults.duration,
                    completed_at: new Date().toISOString(),
                })

                // Update user XP
                const { data: userData } = await supabase
                    .from('users')
                    .select('xp, current_streak, last_read_at')
                    .eq('id', userId)
                    .single()

                if (userData && 'xp' in userData) {
                    const lastReadDate = userData.last_read_at ? new Date(userData.last_read_at as string) : null
                    const today = new Date()
                    const isConsecutiveDay = lastReadDate &&
                        (today.toDateString() === lastReadDate.toDateString() ||
                            today.getTime() - lastReadDate.getTime() < 48 * 60 * 60 * 1000)

                    await supabase
                        .from('users')
                        .update({
                            xp: ((userData.xp as number) || 0) + sessionResults.xpEarned,
                            current_streak: isConsecutiveDay ? ((userData.current_streak as number) || 0) + 1 : 1,
                            last_read_at: today.toISOString(),
                        })
                        .eq('id', userId)

                    setStreak(isConsecutiveDay ? ((userData.current_streak as number) || 0) + 1 : 1)
                }
            } catch (error) {
                console.error('Error saving session:', error)
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
                        بازگشت
                    </Button>
                </Link>
                {!complete && (
                    <div>
                        <h1 className="text-3xl font-bold">فلش‌کارت</h1>
                        <p className="text-muted-foreground mt-1">
                            کلمات را مرور کنید و سطح تسلط خود را ارزیابی کنید
                        </p>
                    </div>
                )}
            </motion.div>

            {!complete ? (
                <FlashcardInterface
                    userId={userId}
                    bookId={bookId || undefined}
                    onComplete={handleComplete}
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
