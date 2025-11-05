'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Award, Check, Lock } from 'lucide-react'

interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    xp_reward: number
    requirement_type: string
    requirement_value: number
    earned?: boolean
    progress?: number
}

interface AchievementCardProps {
    achievement: Achievement
    className?: string
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
    const isEarned = achievement.earned || false
    const progress = achievement.progress || 0
    const progressPercentage = (progress / achievement.requirement_value) * 100

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
                            <Badge variant={isEarned ? 'default' : 'secondary'} className="text-xs">
                                {achievement.xp_reward} XP
                            </Badge>
                        </div>
                    </div>

                    {/* Progress Bar (if not earned) */}
                    {!isEarned && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>پیشرفت</span>
                                <span>{progress} / {achievement.requirement_value}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C9A961]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </Progress>
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
export function AchievementUnlockAnimation({ achievement }: { achievement: Achievement }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
            <Card className="border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/20 to-background shadow-2xl">
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
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8956A] text-2xl shadow-lg"
                        >
                            {achievement.icon}
                        </motion.div>

                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">دستاورد جدید!</p>
                            <h4 className="font-bold text-[#D4AF37]">{achievement.name}</h4>
                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                                +{achievement.xp_reward} XP
                            </Badge>
                        </div>

                        <Award className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
