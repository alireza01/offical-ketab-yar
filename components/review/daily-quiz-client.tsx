'use client'

import { StreakFlame } from '@/components/gamification/streak-flame'
import { XPRewardAnimation } from '@/components/gamification/xp-reward-animation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { QuizCard } from '@/components/vocabulary/quiz-card'
import { QuizResults } from '@/components/vocabulary/quiz-results'
import { useWindowSize } from '@/hooks/use-window-size'
import { createBrowserClient } from '@/lib/supabase/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, Target, Trophy, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { toast } from 'sonner'

interface QuizWord {
    id: string
    word: string
    definition: string
    distractors: string[]
}

interface QuizQuestion {
    word: string
    options: string[]
    correctAnswer: string
    wordId: string
}

export function DailyQuizClient({ userId }: { userId: string }) {
    const supabase = createBrowserClient()
    const queryClient = useQueryClient()
    const { width, height } = useWindowSize()

    const [quizStarted, setQuizStarted] = useState(false)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [showXPReward, setShowXPReward] = useState(false)
    const [xpEarned, setXPEarned] = useState(0)
    const [showConfetti, setShowConfetti] = useState(false)
    const [showWaitingAnimation, setShowWaitingAnimation] = useState(false)

    // Check if quiz completed today
    const { data: todayCompletion, isLoading: loadingCompletion } = useQuery({
        queryKey: ['daily-quiz-completion', userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('daily_quiz_completions')
                .select('*')
                .eq('user_id', userId)
                .eq('completion_date', new Date().toISOString().split('T')[0])
                .single()

            if (error && error.code !== 'PGRST116') throw error
            return data
        },
        staleTime: 1000 * 60 * 5,
    })

    // Get user profile for streak
    const { data: profile } = useQuery({
        queryKey: ['user-profile-quiz', userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('quiz_streak, longest_quiz_streak, last_quiz_date')
                .eq('id', userId)
                .single()

            if (error) throw error
            return data
        },
    })

    // Get words for quiz
    const { data: wordsData, isLoading: loadingWords } = useQuery({
        queryKey: ['quiz-words', userId],
        queryFn: async () => {
            // Get 10 words due for review
            const { data, error } = await supabase
                .rpc('get_words_due_for_review', {
                    p_user_id: userId,
                    p_limit: 10
                })

            if (error) throw error

            // If less than 10 words, get random words from user's vocabulary
            if (!data || data.length < 10) {
                const { data: allWords, error: allError } = await supabase
                    .from('user_words')
                    .select('id, word, definition')
                    .eq('user_id', userId)
                    .limit(10)

                if (allError) throw allError
                return allWords || []
            }

            return data
        },
        enabled: !todayCompletion && quizStarted,
    })

    // Generate quiz questions
    useEffect(() => {
        if (wordsData && wordsData.length > 0) {
            const generatedQuestions = wordsData.map((word: any) => {
                // Get 3 random distractors from other words
                const otherWords = wordsData.filter((w: any) => w.id !== word.id)
                const distractors = otherWords
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .map((w: any) => w.definition)

                // Shuffle options
                const options = [word.definition, ...distractors].sort(() => Math.random() - 0.5)

                return {
                    word: word.word,
                    options,
                    correctAnswer: word.definition,
                    wordId: word.id,
                }
            })

            setQuestions(generatedQuestions)
        }
    }, [wordsData])

    // Submit quiz mutation
    const submitQuizMutation = useMutation({
        mutationFn: async (finalScore: number) => {
            const totalQuestions = questions.length
            const perfectScore = finalScore === totalQuestions

            const { data, error } = await supabase
                .from('daily_quiz_completions')
                .insert({
                    user_id: userId,
                    score: finalScore,
                    total_questions: totalQuestions,
                    perfect_score: perfectScore,
                    completion_date: new Date().toISOString().split('T')[0],
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            setXPEarned(data.xp_earned)
            setShowXPReward(true)

            if (data.perfect_score) {
                setShowConfetti(true)
                setTimeout(() => setShowConfetti(false), 5000)
            }

            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['daily-quiz-completion', userId] })
            queryClient.invalidateQueries({ queryKey: ['user-profile-quiz', userId] })
            queryClient.invalidateQueries({ queryKey: ['user-profile', userId] })

            toast.success('آزمون روزانه با موفقیت ثبت شد!')
        },
        onError: () => {
            toast.error('خطا در ثبت آزمون')
        },
    })

    const handleSelectOption = async (option: string) => {
        if (selectedOption) return

        setSelectedOption(option)
        const currentQuestion = questions[currentQuestionIndex]
        const isCorrect = option === currentQuestion.correctAnswer

        if (isCorrect) {
            setScore(score + 1)

            // Update word status (quality 4 = correct)
            await supabase.rpc('update_word_after_review', {
                p_word_id: currentQuestion.wordId,
                p_quality: 4
            })
        } else {
            // Update word status (quality 1 = incorrect)
            await supabase.rpc('update_word_after_review', {
                p_word_id: currentQuestion.wordId,
                p_quality: 1
            })
        }

        // Move to next question after 1.5 seconds
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1)
                setSelectedOption(null)
            } else {
                // Quiz completed - show waiting animation
                setShowWaitingAnimation(true)

                setTimeout(() => {
                    setShowWaitingAnimation(false)
                    setQuizCompleted(true)
                    submitQuizMutation.mutate(score + (isCorrect ? 1 : 0))
                }, 3000) // 3-second waiting (Agent 3: Psychology)
            }
        }, 1500)
    }

    const handleRestart = () => {
        setQuizStarted(false)
        setCurrentQuestionIndex(0)
        setSelectedOption(null)
        setScore(0)
        setQuizCompleted(false)
        setQuestions([])
    }

    // Check if quiz streak is in danger
    const isStreakInDanger = () => {
        if (!profile?.last_quiz_date) return false
        const lastQuiz = new Date(profile.last_quiz_date)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        lastQuiz.setHours(0, 0, 0, 0)
        return lastQuiz.getTime() === yesterday.getTime()
    }

    if (loadingCompletion || loadingWords) {
        return <QuizSkeleton />
    }

    // Already completed today
    if (todayCompletion && !quizStarted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="border-green-500 bg-green-500/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-green-500" />
                            آزمون امروز تکمیل شد!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">
                                    {todayCompletion.score} / {todayCompletion.total_questions}
                                </p>
                                <p className="text-sm text-muted-foreground">پاسخ صحیح</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#D4AF37]" />
                                <span className="text-xl font-bold text-[#D4AF37]">
                                    +{todayCompletion.xp_earned} XP
                                </span>
                            </div>
                        </div>

                        {profile && profile.quiz_streak > 0 && (
                            <div className="flex items-center justify-center">
                                <StreakFlame days={profile.quiz_streak} />
                            </div>
                        )}

                        <p className="text-center text-muted-foreground">
                            فردا برای آزمون جدید برگردید! 🎯
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Quiz not started
    if (!quizStarted) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Streak Warning */}
                {isStreakInDanger() && profile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-orange-500 bg-orange-500/10">
                            <CardContent className="p-4">
                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 text-center">
                                    ⚠️ استریک {profile.quiz_streak} روزه آزمون شما در خطر است! امروز حتماً آزمون دهید.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Quiz Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">آزمون روزانه واژگان</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground">
                                10 سوال از واژگان شما که نیاز به مرور دارند
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <Badge variant="outline" className="text-sm">
                                    <Target className="w-4 h-4 mr-1" />
                                    +50 XP پایه
                                </Badge>
                                <Badge variant="outline" className="text-sm">
                                    <Trophy className="w-4 h-4 mr-1" />
                                    +50 XP برای نمره کامل
                                </Badge>
                            </div>
                        </div>

                        {/* Stats */}
                        {profile && (
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4 text-center">
                                        <Calendar className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                                        <p className="text-2xl font-bold">{profile.quiz_streak}</p>
                                        <p className="text-xs text-muted-foreground">استریک فعلی</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4 text-center">
                                        <Trophy className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                                        <p className="text-2xl font-bold">{profile.longest_quiz_streak}</p>
                                        <p className="text-xs text-muted-foreground">بهترین استریک</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <Button
                            onClick={() => setQuizStarted(true)}
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C9A961] hover:from-[#C9A961] hover:to-[#B8956A]"
                            size="lg"
                        >
                            شروع آزمون
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Waiting animation (Agent 3: Psychology - 3 seconds)
    if (showWaitingAnimation) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="p-12 text-center space-y-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="inline-block"
                        >
                            <Zap className="w-16 h-16 text-[#D4AF37]" />
                        </motion.div>
                        <h3 className="text-xl font-bold">در حال محاسبه نتایج...</h3>
                        <p className="text-muted-foreground">لطفاً صبر کنید</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Quiz completed
    if (quizCompleted) {
        return (
            <div className="max-w-2xl mx-auto">
                {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
                {showXPReward && (
                    <XPRewardAnimation
                        amount={xpEarned}
                        onComplete={() => setShowXPReward(false)}
                    />
                )}
                <QuizResults
                    score={score}
                    totalQuestions={questions.length}
                    streak={profile?.quiz_streak || 0}
                    onRestart={handleRestart}
                />
            </div>
        )
    }

    // Quiz in progress
    const currentQuestion = questions[currentQuestionIndex]

    return (
        <div className="max-w-2xl mx-auto">
            <QuizCard
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedOption={selectedOption}
                score={score}
                streak={profile?.quiz_streak || 0}
                onSelectOption={handleSelectOption}
            />
        </div>
    )
}

function QuizSkeleton() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                    <div className="space-y-3 mt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
