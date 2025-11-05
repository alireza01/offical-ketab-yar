'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Award, Trophy } from 'lucide-react'

interface QuizCelebrationProps {
  correct: number
  incorrect: number
  total: number
  xpEarned: number
  duration: number
  streak: number
  onContinue: () => void
  onReview: () => void
}

export function QuizCelebration({
  correct,
  incorrect,
  total,
  xpEarned,
  duration,
  streak,
  onContinue,
  onReview
}: QuizCelebrationProps) {
  const percentage = Math.round((correct / total) * 100)
  const isPerfect = correct === total
  const isGood = percentage >= 70

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-[#D4AF37]/20 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#D4AF37] via-[#C9A961] to-[#B8956A]" />
        <CardContent className="p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isPerfect ? (
                    <Trophy className="w-32 h-32 text-[#D4AF37]" />
                  ) : (
                    <Award className="w-32 h-32 text-[#C9A961]" />
                  )}
                </motion.div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">
                  {isPerfect ? '🎉 عالی بود!' : isGood ? '👏 خوب بود!' : '💪 تلاش کن!'}
                </h2>
                <p className="text-muted-foreground">
                  {isPerfect ? 'همه پاسخ‌ها درست بود!' : `${percentage}% پاسخ‌های درست`}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg"
                >
                  <p className="text-3xl font-bold text-green-600">{correct}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg"
                >
                  <p className="text-3xl font-bold text-red-600">{incorrect}</p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-blue-600">{duration}</span>
                    <span className="text-sm text-muted-foreground">s</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Time</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-[#D4AF37]">+{xpEarned}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">XP</p>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-4 py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - percentage / 100) }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="text-[#D4AF37]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{percentage}%</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                🔥 Streak: {streak} days
              </p>

              <div className="flex gap-4">
                <Button onClick={onReview} variant="outline" className="flex-1">
                  Review Mistakes
                </Button>
                <Button
                  onClick={onContinue}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#C9A961] hover:from-[#C9A961] hover:to-[#B8956A]"
                >
                  Continue
                </Button>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
