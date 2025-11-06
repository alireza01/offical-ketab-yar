'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Award, Check, Lock } from 'lucide-react'

import type { AchievementWithProgress } from '@/types/gamification'
import { getTierColor, getTierText } from '@/types/gamification'

interface AchievementCardProps {
    achievement: AchievementWithProgress
    className?: string
    onUnlock?: (achievement: AchievementWithProgress) => void
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
    const isEarned = achievement.earned
    const progress = achievement.progress
    const progressPercentage = achievement.progress_percentage
    const tierGradient = getTierColor(achievement.tier)
    const tierText = getTierText(achievement.tier)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={className}
        >
            <Card className={cn(
                'relative overflow-hidden transition-all',
                isEarned ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent' : 'border-muted'
            )}>
                <CardContent className="p-6">
                    {/* Achievement Icon */}
                    <div className="flex items-start gap-4 mb-4">
                        <motion.div
                            animate={isEarned ? {
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={cn(
                                'flex items-center justify-center w-16 h-16 rounded-full text-3xl',
                                isEarned
                                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8956A] shadow-lg'
                                    : 'bg-muted'
                            )}
                        >
                            {isEarned ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                        </motion.div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(
                                    'font-bold text-lg',
                                    isEarned ? 'text-[#D4AF37]' : 'text-foreground'
                                )}>
                                    {achievement.name}
                                </h3>
                                {isEarned && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 500 }}
                                    >
                                        <Check className="w-5 h-5 text-green-500" />
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                            </p>
                            <div className="flex gap-2">
                                <Badge variant={isEarned ? 'default' : 'secondary'} className="text-xs">
                                    {achievement.xp_reward.toLocaleString('fa-IR')} XP
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'text-xs',
                                        isEarned && `bg-gradient-to-r ${tierGradient} text-white border-none`
                                    )}
                                >
                                    {tierText}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar (if not earned) */}
                    {!isEarned && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>پیشرفت</span>
                                <span>
                                    {progress.toLocaleString('fa-IR')} / {achievement.requirement_value.toLocaleString('fa-IR')}
                                </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2">
                                <motion.div
                                    className={cn(
                                        'h-full rounded-full',
                                        `bg-gradient-to-r ${tierGradient}`
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </Progress>
                            <p className="text-xs text-center text-muted-foreground">
                                {Math.floor(progressPercentage)}% تکمیل شده
                            </p>
                        </div>
                    )}

                    {/* Earned Badge */}
                    {isEarned && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-2 right-2"
                        >
                            <Badge className="bg-green-500 hover:bg-green-600">
                                <Check className="w-3 h-3 mr-1" />
                                دریافت شده
                            </Badge>
                        </motion.div>
                    )}

                    {/* Glow Effect for Earned */}
                    {isEarned && (
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent pointer-events-none"
                        />
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}

// Achievement Unlock Animation
export function AchievementUnlockAnimation({ achievement }: { achievement: AchievementWithProgress }) {
    const tierGradient = getTierColor(achievement.tier)
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed bottom-4 left-4 z-50 max-w-sm"
        >
            <Card className={cn(
                'border-2 shadow-2xl',
                `bg-gradient-to-br ${tierGradient} bg-opacity-20`
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                rotate: { duration: 1, ease: 'easeOut' },
                                scale: { duration: 0.5 },
                            }}
                            className={cn(
                                'flex items-center justify-center w-12 h-12 rounded-full text-2xl shadow-lg',
                                `bg-gradient-to-br ${tierGradient}`
                            )}
                        >
                            {achievement.icon}
                        </motion.div>

                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">🎉 دستاورد جدید!</p>
                            <h4 className="font-bold text-foreground">{achievement.name}</h4>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                                +{achievement.xp_reward.toLocaleString('fa-IR')} XP
                            </Badge>
                        </div>

                        <Award className="w-6 h-6 text-foreground" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
