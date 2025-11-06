'use client'

import { AchievementCard } from '@/components/gamification/achievement-card'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { Award, Lock, Trophy } from 'lucide-react'

interface ProfileAchievementsProps {
    userId: string
    userStats: unknown
}

export default function ProfileAchievements({ userId: _userId, userStats: _userStats }: ProfileAchievementsProps) {
    // Mock achievements data - will be replaced with real data from database
    // userId and userStats will be used when real data is implemented
    const achievements = {
        unlocked: [
            {
                id: '1',
                name: 'خواننده مبتدی',
                description: 'اولین کتاب خود را تمام کنید',
                icon: '📚',
                xp_reward: 100,
                requirement_type: 'books_completed' as const,
                requirement_value: 1,
                tier: 'bronze' as const,
                created_at: new Date().toISOString(),
                earned: true,
                progress: 1,
                progress_percentage: 100,
            },
            {
                id: '2',
                name: 'استریک ۷ روزه',
                description: '۷ روز متوالی مطالعه کنید',
                icon: '🔥',
                xp_reward: 150,
                requirement_type: 'streak_days' as const,
                requirement_value: 7,
                tier: 'silver' as const,
                created_at: new Date().toISOString(),
                earned: true,
                progress: 7,
                progress_percentage: 100,
            },
            {
                id: '3',
                name: 'جمع‌آوری لغات',
                description: '۵۰ لغت جدید ذخیره کنید',
                icon: '📝',
                xp_reward: 100,
                requirement_type: 'pages_read' as const,
                requirement_value: 50,
                tier: 'bronze' as const,
                created_at: new Date().toISOString(),
                earned: true,
                progress: 50,
                progress_percentage: 100,
            },
        ],
        locked: [
            {
                id: '4',
                name: 'خواننده حرفه‌ای',
                description: '۱۰ کتاب تمام کنید',
                icon: '🏆',
                xp_reward: 500,
                requirement_type: 'books_completed' as const,
                requirement_value: 10,
                tier: 'gold' as const,
                created_at: new Date().toISOString(),
                earned: false,
                progress: 5,
                progress_percentage: 50,
            },
            {
                id: '5',
                name: 'استریک ۳۰ روزه',
                description: '۳۰ روز متوالی مطالعه کنید',
                icon: '⚡',
                xp_reward: 1000,
                requirement_type: 'streak_days' as const,
                requirement_value: 30,
                tier: 'platinum' as const,
                created_at: new Date().toISOString(),
                earned: false,
                progress: 15,
                progress_percentage: 50,
            },
            {
                id: '6',
                name: 'استاد لغات',
                description: '۵۰۰ لغت جدید ذخیره کنید',
                icon: '🎓',
                xp_reward: 750,
                requirement_type: 'pages_read' as const,
                requirement_value: 500,
                tier: 'gold' as const,
                created_at: new Date().toISOString(),
                earned: false,
                progress: 50,
                progress_percentage: 10,
            },
        ],
    }

    const totalPoints = achievements.unlocked.reduce((sum, a) => sum + a.xp_reward, 0)

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-gold/10">
                                <Trophy className="size-6 text-gold" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">دستاوردها</p>
                                <p className="text-2xl font-bold">
                                    {achievements.unlocked.length}/{achievements.unlocked.length + achievements.locked.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Award className="size-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">امتیاز دستاوردها</p>
                                <p className="text-2xl font-bold">{totalPoints}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <Lock className="size-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">در انتظار باز شدن</p>
                                <p className="text-2xl font-bold">{achievements.locked.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Achievements Tabs */}
            <Tabs defaultValue="unlocked" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="unlocked">
                        باز شده ({achievements.unlocked.length})
                    </TabsTrigger>
                    <TabsTrigger value="locked">
                        قفل شده ({achievements.locked.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="unlocked" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.unlocked.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <AchievementCard achievement={achievement} />
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="locked" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.locked.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <AchievementCard achievement={achievement} />
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
