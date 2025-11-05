'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { UserGamification } from '@/types/gamification'

interface XPProgressProps {
  gamification: UserGamification
}

export function XPProgress({ gamification }: XPProgressProps) {
  const progressPercentage = gamification.xp_progress_percentage

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">پیشرفت شما</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>سطح {gamification.level}</span>
            <span>{gamification.xp} / {gamification.xp_to_next_level} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#D4AF37]">🔥 {gamification.current_streak}</div>
            <div className="text-xs text-muted-foreground">استریک روزانه</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#D4AF37]">{gamification.xp}</div>
            <div className="text-xs text-muted-foreground">مجموع XP</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
