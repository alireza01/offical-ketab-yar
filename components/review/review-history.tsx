"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createBrowserClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ReviewHistoryProps {
    userId: string
}

interface ReviewSession {
    id: string
    session_type: string
    words_reviewed: number
    correct_answers: number
    incorrect_answers: number
    xp_earned: number
    duration_seconds: number
    completed_at: string
}

export function ReviewHistory({ userId }: ReviewHistoryProps) {
    const [sessions, setSessions] = useState<ReviewSession[]>([])
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalWords: 0,
        totalXP: 0,
        averageAccuracy: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadHistory = async () => {
            const supabase = createBrowserClient()

            const { data } = await supabase
                .from('review_sessions')
                .select('*')
                .eq('user_id', userId)
                .order('completed_at', { ascending: false })
                .limit(20)

            if (data) {
                setSessions(data)

                const totalSessions = data.length
                const totalWords = data.reduce((sum: number, s: ReviewSession) => sum + s.words_reviewed, 0)
                const totalXP = data.reduce((sum: number, s: ReviewSession) => sum + s.xp_earned, 0)
                const totalCorrect = data.reduce((sum: number, s: ReviewSession) => sum + s.correct_answers, 0)
                const totalAnswers = data.reduce((sum: number, s: ReviewSession) => sum + s.words_reviewed, 0)
                const averageAccuracy = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0

                setStats({
                    totalSessions,
                    totalWords,
                    totalXP,
                    averageAccuracy
                })
            }

            setIsLoading(false)
        }

        loadHistory()
    }, [userId])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">تاریخچه مرور</h1>
                <p className="text-muted-foreground mt-1">
                    مشاهده جلسات مرور و پیشرفت شما
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-[#D4AF37]/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-[#D4AF37]/10">
                                <Calendar className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalSessions}</p>
                                <p className="text-sm text-muted-foreground">جلسات</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#D4AF37]/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-blue-500/10">
                                <Target className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalWords}</p>
                                <p className="text-sm text-muted-foreground">کلمات مرور شده</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#D4AF37]/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-green-500/10">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{Math.round(stats.averageAccuracy)}%</p>
                                <p className="text-sm text-muted-foreground">دقت</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#D4AF37]/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-500/10">
                                <TrendingUp className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.totalXP}</p>
                                <p className="text-sm text-muted-foreground">XP کسب شده</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sessions */}
            <Card className="border-[#D4AF37]/20">
                <CardHeader>
                    <CardTitle>جلسات اخیر</CardTitle>
                </CardHeader>
                <CardContent>
                    {sessions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            هنوز جلسه مروری ندارید
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="border-[#D4AF37]/10">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold">
                                                            {session.session_type === 'flashcard' ? 'فلش‌کارت' : 'آزمون'}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(session.completed_at).toLocaleDateString('fa-IR')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>{session.words_reviewed} کلمه</span>
                                                        <span className="text-green-500">
                                                            {session.correct_answers} درست
                                                        </span>
                                                        <span className="text-red-500">
                                                            {session.incorrect_answers} نادرست
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {Math.floor(session.duration_seconds / 60)}:{(session.duration_seconds % 60).toString().padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-[#D4AF37]">
                                                        +{session.xp_earned}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">XP</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
