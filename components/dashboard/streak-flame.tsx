"use client"

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakFlameProps {
    streak: number
}

export function StreakFlame({ streak }: StreakFlameProps) {
    return (
        <div className="relative flex flex-col items-center justify-center">
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative"
            >
                <Flame
                    className="w-24 h-24 text-orange-500"
                    fill="currentColor"
                />
            </motion.div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mt-4 text-center"
            >
                <p className="text-4xl font-bold text-orange-500">{streak}</p>
                <p className="text-sm text-muted-foreground mt-1">روز استریک</p>
            </motion.div>
        </div>
    )
}
