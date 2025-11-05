'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Crown, Star, Trophy } from 'lucide-react'

interface LevelBadgeProps {
    level: number
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
    className?: string
}

export function LevelBadge({ level, size = 'md', showLabel = true, className }: LevelBadgeProps) {
    // Determine badge style based on level
    const getBadgeStyle = () => {
        if (level >= 50) return {
            gradient: 'from-purple-500 via-pink-500 to-red-500',
            icon: Crown,
            title: 'استاد'
        }
        if (level >= 25) return {
            gradient: 'from-blue-500 via-cyan-500 to-teal-500',
            icon: Trophy,
            title: 'حرفه‌ای'
        }
        if (level >= 10) return {
            gradient: 'from-green-500 via-emerald-500 to-lime-500',
            icon: Star,
            title: 'پیشرفته'
        }
        return {
            gradient: 'from-[#D4AF37] via-[#C9A961] to-[#B8956A]',
            icon: Star,
            title: 'مبتدی'
        }
    }

    const { gradient, icon: Icon, title } = getBadgeStyle()

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base'
    }

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    }

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
            >
                {/* Badge Circle */}
                <div className={cn(
                    'relative flex items-center justify-center rounded-full shadow-lg',
                    `bg-gradient-to-br ${gradient}`,
                    sizeClasses[size]
                )}>
                    {/* Level Number */}
                    <span className="font-bold text-white z-10">{level}</span>

                    {/* Icon Overlay */}
                    <Icon className={cn(
                        'absolute top-0 right-0 text-white/30',
                        iconSizes[size]
                    )} />
                </div>

                {/* Glow Effect */}
                <motion.div
                    animate={{
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className={cn(
                        'absolute inset-0 rounded-full blur-md -z-10',
                        `bg-gradient-to-br ${gradient}`
                    )}
                />
            </motion.div>

            {/* Label */}
            {showLabel && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">سطح {level}</p>
                </motion.div>
            )}
        </div>
    )
}

// Level Up Celebration
export function LevelUpCelebration({ newLevel }: { newLevel: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8956A]/20 backdrop-blur-md p-12 rounded-2xl text-center border border-[#D4AF37]/30"
            >
                {/* Animated Badge */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        rotate: { duration: 1, ease: 'easeOut' },
                        scale: { duration: 0.5, times: [0, 0.5, 1] },
                    }}
                    className="mb-6"
                >
                    <LevelBadge level={newLevel} size="lg" showLabel={false} />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold mb-4 text-white"
                >
                    🎉 سطح جدید! 🎉
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-gray-300 mb-2"
                >
                    شما به سطح {newLevel} رسیدید!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl font-bold text-[#D4AF37] mt-4"
                >
                    +{newLevel * 50} XP پاداش
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
