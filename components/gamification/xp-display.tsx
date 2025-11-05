'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface XPDisplayProps {
  currentXP: number
  level: number
  className?: string
}

export function XPDisplay({ currentXP, level, className }: XPDisplayProps) {
  // Calculate XP needed for next level (exponential growth)
  const xpForNextLevel = level * 100
  const xpProgress = (currentXP % xpForNextLevel) / xpForNextLevel * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Level Badge */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8956A] text-white font-bold text-sm shadow-lg"
      >
        {level}
      </motion.div>

      {/* XP Progress */}
      <div className="flex-1 min-w-[120px]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-xs font-medium">{currentXP % xpForNextLevel} XP</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {xpForNextLevel} XP
          </span>
        </div>
        <Progress
          value={xpProgress}
          className="h-1.5 bg-muted"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C9A961]"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </Progress>
      </div>
    </motion.div>
  )
}
