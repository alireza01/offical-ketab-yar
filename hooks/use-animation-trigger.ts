"use client"

import { useCallback, useRef, useState } from 'react'
import { useHapticFeedback } from './use-haptic-feedback'
import { useSoundEffects } from './use-sound-effects'

/**
 * Animation trigger types for gamification
 * Implements Agent 3's psychology strategy
 */
export type AnimationTrigger =
    | 'xp-gain'
    | 'level-up'
    | 'streak-continue'
    | 'streak-lost'
    | 'achievement'
    | 'book-complete'
    | 'chapter-complete'
    | 'word-saved'
    | 'quiz-correct'
    | 'quiz-wrong'

/**
 * Animation state for tracking active animations
 */
interface AnimationState {
    id: string
    type: AnimationTrigger
    data?: any
    timestamp: number
}

/**
 * Enhanced animation trigger hook for gamification
 * Coordinates visual animations, sound effects, and haptic feedback
 * Implements Agent 3's complete psychology strategy
 * 
 * @returns Animation trigger functions and state
 */
export function useAnimationTrigger() {
    const [activeAnimations, setActiveAnimations] = useState<AnimationState[]>([])
    const animationQueueRef = useRef<AnimationState[]>([])
    const { play: playSound } = useSoundEffects()
    const { triggerHaptic } = useHapticFeedback()

    /**
     * Trigger a complete animation with sound and haptic feedback
     */
    const trigger = useCallback((
        type: AnimationTrigger,
        data?: any,
        options?: {
            sound?: boolean
            haptic?: boolean
            duration?: number
        }
    ) => {
        const {
            sound = true,
            haptic = true,
            duration = 2000
        } = options || {}

        const animation: AnimationState = {
            id: `${type}-${Date.now()}-${Math.random()}`,
            type,
            data,
            timestamp: Date.now()
        }

        // Add to active animations
        setActiveAnimations(prev => [...prev, animation])

        // Play sound effect if enabled
        if (sound) {
            switch (type) {
                case 'xp-gain':
                    playSound('xp-gain')
                    break
                case 'level-up':
                    playSound('level-up')
                    break
                case 'streak-continue':
                    playSound('streak-continue')
                    break
                case 'streak-lost':
                    playSound('streak-lost')
                    break
                case 'achievement':
                case 'book-complete':
                    playSound('achievement')
                    break
                case 'chapter-complete':
                    playSound('book-complete')
                    break
                case 'word-saved':
                    playSound('success')
                    break
                case 'quiz-correct':
                    playSound('success')
                    break
                case 'quiz-wrong':
                    playSound('error')
                    break
            }
        }

        // Trigger haptic feedback if enabled
        if (haptic) {
            switch (type) {
                case 'xp-gain':
                case 'word-saved':
                    triggerHaptic('light')
                    break
                case 'level-up':
                case 'achievement':
                case 'book-complete':
                    triggerHaptic('success')
                    break
                case 'streak-lost':
                case 'quiz-wrong':
                    triggerHaptic('error')
                    break
                default:
                    triggerHaptic('medium')
            }
        }

        // Auto-remove after duration
        setTimeout(() => {
            setActiveAnimations(prev => prev.filter(a => a.id !== animation.id))
        }, duration)

        return animation.id
    }, [playSound, triggerHaptic])

    /**
     * Convenience methods for common animations
     */
    const triggerXPGain = useCallback((amount: number, reason?: string) => {
        return trigger('xp-gain', { amount, reason }, { duration: 1500 })
    }, [trigger])

    const triggerLevelUp = useCallback((newLevel: number) => {
        return trigger('level-up', { level: newLevel }, { duration: 3000 })
    }, [trigger])

    const triggerStreakContinue = useCallback((days: number) => {
        return trigger('streak-continue', { days }, { duration: 2000 })
    }, [trigger])

    const triggerStreakLost = useCallback((previousDays: number) => {
        return trigger('streak-lost', { previousDays }, { duration: 2500 })
    }, [trigger])

    const triggerAchievement = useCallback((achievement: {
        name: string
        description: string
        icon: string
    }) => {
        return trigger('achievement', achievement, { duration: 4000 })
    }, [trigger])

    const triggerBookComplete = useCallback((book: {
        title: string
        xpEarned: number
        pagesRead: number
    }) => {
        return trigger('book-complete', book, { duration: 5000 })
    }, [trigger])

    const triggerChapterComplete = useCallback((chapter: {
        number: number
        xpEarned: number
    }) => {
        return trigger('chapter-complete', chapter, { duration: 2500 })
    }, [trigger])

    const triggerWordSaved = useCallback((word: string) => {
        return trigger('word-saved', { word }, { duration: 1000 })
    }, [trigger])

    const triggerQuizCorrect = useCallback(() => {
        return trigger('quiz-correct', {}, { duration: 1000 })
    }, [trigger])

    const triggerQuizWrong = useCallback(() => {
        return trigger('quiz-wrong', {}, { duration: 1500 })
    }, [trigger])

    /**
     * Clear all active animations
     */
    const clearAll = useCallback(() => {
        setActiveAnimations([])
    }, [])

    /**
     * Remove specific animation by ID
     */
    const remove = useCallback((id: string) => {
        setActiveAnimations(prev => prev.filter(a => a.id !== id))
    }, [])

    return {
        activeAnimations,
        trigger,
        // Convenience methods
        triggerXPGain,
        triggerLevelUp,
        triggerStreakContinue,
        triggerStreakLost,
        triggerAchievement,
        triggerBookComplete,
        triggerChapterComplete,
        triggerWordSaved,
        triggerQuizCorrect,
        triggerQuizWrong,
        // Utility methods
        clearAll,
        remove,
    }
}
