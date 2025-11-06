/**
 * Gamification Provider
 * Wraps the app to provide gamification context
 * Agent 2 (Performance): Efficient context management
 * Agent 3 (Psychology): Global celebration triggers
 */

'use client'

import { useGamification } from '@/hooks/use-gamification'
import { AnimatePresence } from 'framer-motion'
import { createContext, useContext, type ReactNode } from 'react'
import { AchievementUnlockAnimation } from './achievement-card'
import { LevelUpCelebration } from './level-badge'
import { StreakCelebration } from './streak-flame'
import { XPRewardAnimation } from './xp-reward-animation'

interface GamificationContextValue extends ReturnType<typeof useGamification> { }

const GamificationContext = createContext<GamificationContextValue | null>(null)

export function useGamificationContext() {
    const context = useContext(GamificationContext)
    if (!context) {
        throw new Error(
            'useGamificationContext must be used within GamificationProvider'
        )
    }
    return context
}

interface GamificationProviderProps {
    children: ReactNode
}

export function GamificationProvider({ children }: GamificationProviderProps) {
    const gamification = useGamification({ autoLoad: true, debounceMs: 5000 })

    return (
        <GamificationContext.Provider value={gamification}>
            {children}

            {/* Global Celebrations */}
            <AnimatePresence>
                {gamification.xpReward && (
                    <XPRewardAnimation
                        amount={gamification.xpReward}
                        onComplete={gamification.clearXPReward}
                    />
                )}

                {gamification.levelUpData?.level_up && (
                    <LevelUpCelebration newLevel={gamification.levelUpData.new_level} />
                )}

                {gamification.newAchievements.map((achievement) => (
                    <AchievementUnlockAnimation
                        key={achievement.id}
                        achievement={achievement}
                    />
                ))}

                {gamification.currentStreak &&
                    [7, 30, 100, 365].includes(gamification.currentStreak) && (
                        <StreakCelebration days={gamification.currentStreak} />
                    )}
            </AnimatePresence>
        </GamificationContext.Provider>
    )
}
