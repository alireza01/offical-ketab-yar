/**
 * Gamification Integration Examples
 * Copy-paste ready code for integrating gamification into your app
 */

// ============================================
// EXAMPLE 1: Root Layout with Provider
// ============================================
// File: app/layout.tsx

import { GamificationProvider } from '@/components/gamification'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fa" dir="rtl">
            <body>
                <GamificationProvider>
                    {children}
                </GamificationProvider>
            </body>
        </html>
    )
}

// ============================================
// EXAMPLE 2: Dashboard Page
// ============================================
// File: app/dashboard/page.tsx

import { GamificationDashboard } from '@/components/gamification'

export default function DashboardPage() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">داشبورد</h1>
            <GamificationDashboard />
        </div>
    )
}

// ============================================
// EXAMPLE 3: Header with XP Display
// ============================================
// File: components/layout/site-header.tsx

'use client'

import { useGamificationContext, XPDisplay } from '@/components/gamification'

export function SiteHeader() {
    const { level, xp, isLoading } = useGamificationContext()

    return (
        <header className="border-b">
            <div className="container flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <h1>کتاب‌یار</h1>
                </div>

                {!isLoading && (
                    <XPDisplay currentXP={xp} level={level} size="sm" />
                )}
            </div>
        </header>
    )
}

// ============================================
// EXAMPLE 4: Book Reader with Tracking
// ============================================
// File: app/books/read/[slug]/page.tsx

'use client'

import { ReadingTracker } from '@/components/gamification'
import { useState } from 'react'

export default function BookReaderPage({ params }: { params: { slug: string } }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [isReading, setIsReading] = useState(true)
    const { level, xp } = useGamificationContext()

    const bookId = 'book-id-from-params'
    const totalPages = 300

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1))
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b p-4">
                <div className="container flex items-center justify-between">
                    <h1>عنوان کتاب</h1>
                    <XPDisplay currentXP={xp} level={level} size="sm" />
                </div>
            </header>

            {/* Book Content */}
            <main className="container py-8">
                <div className="max-w-3xl mx-auto">
                    <p>محتوای صفحه {currentPage}</p>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            صفحه قبل
                        </button>
                        <span>صفحه {currentPage} از {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            صفحه بعد
                        </button>
                    </div>
                </div>
            </main>

            {/* Automatic Tracking */}
            <ReadingTracker
                bookId={bookId}
                currentPage={currentPage}
                totalPages={totalPages}
                isReading={isReading}
            />
        </div>
    )
}

// ============================================
// EXAMPLE 5: Profile Page with Stats
// ============================================
// File: app/profile/page.tsx

'use client'

import { LevelBadge, StreakFlame } from '@/components/gamification'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGamification } from '@/hooks/use-gamification'

export default function ProfilePage() {
    const { stats, isLoading } = useGamification()

    if (isLoading) return <div>در حال بارگذاری...</div>
    if (!stats) return <div>خطا در بارگذاری اطلاعات</div>

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">پروفایل</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Level Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>سطح</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <LevelBadge level={stats.level} size="lg" />
                    </CardContent>
                </Card>

                {/* XP Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>امتیاز</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <XPDisplay currentXP={stats.xp} level={stats.level} />
                    </CardContent>
                </Card>

                {/* Streak Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>استریک</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <StreakFlame days={stats.current_streak} />
                    </CardContent>
                </Card>
            </div>

            {/* Statistics */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>آمار</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <p className="text-2xl font-bold">{stats.total_books_completed}</p>
                            <p className="text-sm text-muted-foreground">کتاب تمام شده</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.total_pages_read}</p>
                            <p className="text-sm text-muted-foreground">صفحه خوانده شده</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{Math.floor(stats.total_reading_time / 60)}</p>
                            <p className="text-sm text-muted-foreground">ساعت مطالعه</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stats.longest_streak}</p>
                            <p className="text-sm text-muted-foreground">بیشترین استریک</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ============================================
// EXAMPLE 6: Achievements Page
// ============================================
// File: app/achievements/page.tsx

'use client'

import { AchievementCard } from '@/components/gamification'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AchievementsPage() {
    const { achievements, isLoading } = useGamification()

    if (isLoading) return <div>در حال بارگذاری...</div>

    const earned = achievements.filter(a => a.earned)
    const inProgress = achievements.filter(a => !a.earned)

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">دستاوردها</h1>

            <Tabs defaultValue="in-progress">
                <TabsList>
                    <TabsTrigger value="in-progress">
                        در حال پیشرفت ({inProgress.length})
                    </TabsTrigger>
                    <TabsTrigger value="earned">
                        کسب شده ({earned.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="in-progress" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {inProgress.map(achievement => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="earned" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {earned.map(achievement => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// ============================================
// EXAMPLE 7: Manual XP Tracking (Quiz)
// ============================================
// File: components/quiz/quiz-component.tsx

'use client'


export function QuizComponent() {
    const { updateImmediately } = useGamification()
    const [score, setScore] = useState(0)

    const handleQuizComplete = async () => {
        // Award XP immediately for quiz completion
        const result = await updateImmediately({
            xp_gained: score * 5, // 5 XP per correct answer
        })

        if (result.success) {
            console.log('XP awarded!', result.xp_result)
        }
    }

    return (
        <div>
            <h2>کوئیز</h2>
            <p>امتیاز: {score}</p>
            <button onClick={handleQuizComplete}>
                اتمام کوئیز
            </button>
        </div>
    )
}

// ============================================
// EXAMPLE 8: Custom Hook Usage
// ============================================
// File: components/custom-component.tsx

'use client'

import { useEffect } from 'react'

export function CustomComponent() {
    const {
        // Data
        stats,
        achievements,
        streakInfo,
        isLoading,

        // Actions
        trackPageRead,
        trackReadingTime,
        trackBookCompletion,

        // Celebrations
        xpReward,
        levelUpData,
        newAchievements,
        clearXPReward,
        clearLevelUp,

        // Computed
        level,
        xp,
        currentStreak,
    } = useGamification()

    useEffect(() => {
        // Track 5 pages read
        trackPageRead(5)

        // Track 10 minutes of reading
        trackReadingTime(10)
    }, [])

    const handleBookComplete = async () => {
        const result = await trackBookCompletion()
        if (result.success) {
            console.log('Book completed!', result)
        }
    }

    return (
        <div>
            <p>Level: {level}</p>
            <p>XP: {xp}</p>
            <p>Streak: {currentStreak} days</p>

            {xpReward && (
                <div>You earned {xpReward} XP!</div>
            )}

            {levelUpData?.level_up && (
                <div>Level up to {levelUpData.new_level}!</div>
            )}
        </div>
    )
}

// ============================================
// EXAMPLE 9: Streak Warning in Layout
// ============================================
// File: components/layout/streak-warning-wrapper.tsx

'use client'

import { StreakWarning } from '@/components/gamification'

export function StreakWarningWrapper() {
    const { streakInfo, stats } = useGamification()

    if (!streakInfo?.is_in_danger || !stats?.last_read_date) {
        return null
    }

    return (
        <StreakWarning
            streakDays={streakInfo.current_streak}
            lastReadDate={new Date(stats.last_read_date)}
        />
    )
}

// ============================================
// EXAMPLE 10: Leaderboard (Coming Soon)
// ============================================
// File: app/leaderboard/page.tsx

'use client'

import { getLeaderboard } from '@/lib/supabase/queries/gamification'

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<any[]>([])

    useEffect(() => {
        getLeaderboard(10).then(result => {
            if (result.success && result.leaderboard) {
                setLeaderboard(result.leaderboard)
            }
        })
    }, [])

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">جدول امتیازات</h1>

            <div className="space-y-4">
                {leaderboard.map((user, index) => (
                    <div key={user.user_id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <span className="text-2xl font-bold text-[#D4AF37]">#{index + 1}</span>
                        <LevelBadge level={user.level} size="md" showLabel={false} />
                        <div className="flex-1">
                            <p className="font-semibold">کاربر {user.user_id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                                {user.xp.toLocaleString('fa-IR')} XP
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
