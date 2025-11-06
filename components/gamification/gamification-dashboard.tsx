/**
 * Gamification Dashboard Component
 * Complete overview of user's gamification progress
 * Agent 3 (Psychology): Engaging, motivating, celebratory
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGamification } from '@/hooks/use-gamification'
import { AnimatePresence } from 'framer-motion'
import { Award, BookOpen, Clock, Flame, TrendingUp, Zap } from 'lucide-react'
import { AchievementCard, AchievementUnlockAnimation } from './achievement-card'
import { LevelBadge, LevelUpCelebration } from './level-badge'
import { StreakCelebration, StreakFlame } from './streak-flame'
import { StreakWarning } from './streak-warning'
import { XPDisplay } from './xp-display'
import { XPRewardAnimation } from './xp-reward-animation'

export function GamificationDashboard() {
    const {
        stats,
        achievements,
        streakInfo,
        isLoading,
        xpReward,
        levelUpData,
        newAchievements,
        clearXPReward,
        clearLevelUp,
        clearNewAchievements,
    } = useGamification()

    if (isLoading) {
        return <GamificationDashboardSkeleton />
    }

    if (!stats) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">
                        داده‌های گیمیفیکیشن در دسترس نیست
                    </p>
                </CardContent>
            </Card>
        )
    }

    const earnedAchievements = achievements.filter((a) => a.earned)
    const inProgressAchievements = achievements.filter((a) => !a.earned)

    return (
        <div className="space-y-6">
            {/* Celebrations */}
            <AnimatePresence>
                {xpReward && (
                    <XPRewardAnimation amount={xpReward} onComplete={clearXPReward} />
                )}
                {levelUpData?.level_up && (
                    <LevelUpCelebration newLevel={levelUpData.new_level} />
                )}
                {newAchievements.map((achievement) => (
                    <AchievementUnlockAnimation
                        key={achievement.id}
                        achievement={achievement}
                    />
                ))}
                {streakInfo?.current_streak &&
                    [7, 30, 100, 365].includes(streakInfo.current_streak) && (
                        <StreakCelebration days={streakInfo.current_streak} />
                    )}
            </AnimatePresence>

            {/* Streak Warning */}
            {streakInfo?.is_in_danger && streakInfo.last_read_date && (
                <StreakWarning
                    streakDays={streakInfo.current_streak}
                    lastReadDate={new Date(streakInfo.last_read_date)}
                />
            )}

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Level Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">سطح</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-4">
                            <LevelBadge level={stats.level} size="lg" showLabel={false} />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            سطح {stats.level}
                        </p>
                    </CardContent>
                </Card>

                {/* XP Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">امتیاز</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-center py-2">
                            {stats.xp.toLocaleString('fa-IR')}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            مجموع امتیاز
                        </p>
                    </CardContent>
                </Card>

                {/* Streak Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">استریک</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-4">
                            <StreakFlame
                                days={stats.current_streak}
                                isInDanger={streakInfo?.is_in_danger}
                            />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            بیشترین: {stats.longest_streak.toLocaleString('fa-IR')} روز
                        </p>
                    </CardContent>
                </Card>

                {/* Books Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">کتاب‌ها</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-center py-2">
                            {stats.total_books_completed.toLocaleString('fa-IR')}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            کتاب تمام شده
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* XP Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>پیشرفت امتیاز</CardTitle>
                    <CardDescription>
                        تا سطح بعدی {(stats.level * 100 - (stats.xp % (stats.level * 100))).toLocaleString('fa-IR')} XP مانده
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <XPDisplay currentXP={stats.xp} level={stats.level} size="lg" />
                </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>آمار مطالعه</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.total_pages_read.toLocaleString('fa-IR')}
                                </p>
                                <p className="text-xs text-muted-foreground">صفحه خوانده شده</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {Math.floor(stats.total_reading_time / 60).toLocaleString('fa-IR')}
                                </p>
                                <p className="text-xs text-muted-foreground">ساعت مطالعه</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
                                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {earnedAchievements.length.toLocaleString('fa-IR')}
                                </p>
                                <p className="text-xs text-muted-foreground">دستاورد کسب شده</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle>دستاوردها</CardTitle>
                    <CardDescription>
                        {earnedAchievements.length} از {achievements.length} دستاورد کسب شده
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="in-progress">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="in-progress">
                                در حال پیشرفت ({inProgressAchievements.length})
                            </TabsTrigger>
                            <TabsTrigger value="earned">
                                کسب شده ({earnedAchievements.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="in-progress" className="space-y-4 mt-4">
                            {inProgressAchievements.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    همه دستاوردها کسب شده‌اند! 🎉
                                </p>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {inProgressAchievements.map((achievement) => (
                                        <AchievementCard
                                            key={achievement.id}
                                            achievement={achievement}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="earned" className="space-y-4 mt-4">
                            {earnedAchievements.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    هنوز دستاوردی کسب نکرده‌اید. شروع کنید!
                                </p>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {earnedAchievements.map((achievement) => (
                                        <AchievementCard
                                            key={achievement.id}
                                            achievement={achievement}
                                        />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

function GamificationDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="space-y-0 pb-2">
                            <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-2" />
                            <Skeleton className="h-3 w-24 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
