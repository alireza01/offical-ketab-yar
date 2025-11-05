import type { XPReward } from '@/types/gamification'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GamificationState {
    // Current streak (for immediate UI updates)
    currentStreak: number

    // XP rewards queue (for animations)
    xpRewards: XPReward[]

    // Actions
    updateStreak: (streak: number) => void
    showXPReward: (amount: number, reason: string) => void
    clearXPReward: (timestamp: number) => void
    resetStore: () => void
}

const initialState = {
    currentStreak: 0,
    xpRewards: [],
}

/**
 * Gamification Store (Zustand)
 * Manages client-side gamification state for immediate UI feedback
 * Implements Agent 2's performance strategy (zero server load)
 */
export const useGamificationStore = create<GamificationState>()(
    persist(
        (set) => ({
            ...initialState,

            updateStreak: (streak) => {
                set({ currentStreak: streak })
            },

            showXPReward: (amount, reason) => {
                const reward: XPReward = {
                    amount,
                    reason,
                    timestamp: Date.now(),
                }

                set((state) => ({
                    xpRewards: [...state.xpRewards, reward],
                }))

                // Auto-clear after 3 seconds
                setTimeout(() => {
                    set((state) => ({
                        xpRewards: state.xpRewards.filter(r => r.timestamp !== reward.timestamp),
                    }))
                }, 3000)
            },

            clearXPReward: (timestamp) => {
                set((state) => ({
                    xpRewards: state.xpRewards.filter(r => r.timestamp !== timestamp),
                }))
            },

            resetStore: () => {
                set(initialState)
            },
        }),
        {
            name: 'ketab-yar-gamification',
            partialize: (state) => ({
                currentStreak: state.currentStreak,
            }),
        }
    )
)
