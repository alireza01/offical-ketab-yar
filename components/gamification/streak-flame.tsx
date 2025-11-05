'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AlertTriangle, Flame } from 'lucide-react'

interface StreakFlameProps {
    days: number
    isInDanger?: boolean
    className?: string
}

export function StreakFlame({ days, isInDanger = false, className }: StreakFlameProps) {
    // Determine flame size based on streak length
    const getFlameSize = () => {
        if (days >= 100) return 'text-6xl'
        if (days >= 30) return 'text-5xl'
        if (days >= 7) return 'text-4xl'
        return 'text-3xl'
    }

    // Determine flame color
    const getFlameColor = () => {
        if (isInDanger) return 'text-orange-400'
        if (days >= 100) return 'text-purple-500'
        if (days >= 30) return 'text-blue-500'
        if (days >= 7) return 'text-green-500'
        return 'text-yellow-500'
    }

    return (
        <div className={cn('relative inline-block', className)}>
            {/* Flame Animation */}
            <motion.div
                animate={{
                    scale: isInDanger ? [1, 0.9, 1] : [1, 1.1, 1],
                    rotate: isInDanger ? [0, -5, 5, 0] : [0, 3, -3, 0],
                }}
                transition={{
                    duration: isInDanger ? 0.5 : 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="relative"
            >
                <Flame className={cn(getFlameSize(), getFlameColor(), 'drop-shadow-lg')} />

                {/* Streak Number */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                >
                    {days}
                </motion.div>
            </motion.div>

            {/* Danger Warning */}
            {isInDanger && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                    <div className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        <AlertTriangle className="w-3 h-3" />
                        <span>استریک در خطر!</span>
                    </div>
                </motion.div>
            )}

            {/* Glow Effect */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className={cn(
                    'absolute inset-0 blur-xl -z-10',
                    isInDanger ? 'bg-orange-400' : 'bg-yellow-400'
                )}
            />
        </div>
    )
}

// Streak Celebration Component
export function StreakCelebration({ days }: { days: number }) {
    const milestones = [7, 30, 100, 365]
    const isMilestone = milestones.includes(days)

    if (!isMilestone) return null

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
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        rotate: { duration: 2, ease: 'easeInOut' },
                        scale: { duration: 1, repeat: Infinity },
                    }}
                >
                    <Flame className="w-32 h-32 text-[#D4AF37] mx-auto mb-6" />
                </motion.div>

                <h2 className="text-4xl font-bold mb-4 text-white">
                    🎉 استریک {days} روزه! 🎉
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                    شما یک خواننده واقعی هستید!
                </p>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl font-bold text-[#D4AF37]"
                >
                    +{days * 10} XP
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
