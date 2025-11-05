"use client"

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Sound effect types for gamification
 * Implements Agent 3's psychology strategy
 */
export type SoundEffect =
    | 'xp-gain'           // XP earned
    | 'level-up'          // New level reached
    | 'streak-continue'   // Streak maintained
    | 'streak-lost'       // Streak broken
    | 'achievement'       // Achievement unlocked
    | 'page-turn'         // Page turned
    | 'book-complete'     // Book finished
    | 'button-click'      // UI interaction
    | 'success'           // Success action
    | 'error'             // Error occurred

/**
 * Sound effect configuration
 */
interface SoundConfig {
    volume: number
    enabled: boolean
}

/**
 * Enhanced sound effects hook for gamification
 * Provides audio feedback for user actions
 * 
 * @returns Sound effect functions and controls
 */
export function useSoundEffects() {
    const [config, setConfig] = useState<SoundConfig>({
        volume: 0.3,
        enabled: true,
    })

    // Audio cache to prevent re-creating Audio objects
    const audioCache = useRef<Map<SoundEffect, HTMLAudioElement>>(new Map())

    /**
     * Preload sound effects for instant playback
     */
    useEffect(() => {
        if (typeof window === 'undefined') return

        const sounds: Record<SoundEffect, string> = {
            'xp-gain': '/sounds/xp-gain.mp3',
            'level-up': '/sounds/level-up.mp3',
            'streak-continue': '/sounds/streak-continue.mp3',
            'streak-lost': '/sounds/streak-lost.mp3',
            'achievement': '/sounds/achievement.mp3',
            'page-turn': '/sounds/page-turn.mp3',
            'book-complete': '/sounds/book-complete.mp3',
            'button-click': '/sounds/button-click.mp3',
            'success': '/sounds/success.mp3',
            'error': '/sounds/error.mp3',
        }

        // Preload critical sounds
        const criticalSounds: SoundEffect[] = ['xp-gain', 'page-turn', 'button-click']

        criticalSounds.forEach((sound) => {
            if (!audioCache.current.has(sound)) {
                const audio = new Audio(sounds[sound])
                audio.volume = config.volume
                audio.preload = 'auto'
                audioCache.current.set(sound, audio)
            }
        })

        return () => {
            // Cleanup audio objects
            audioCache.current.forEach((audio) => {
                audio.pause()
                audio.src = ''
            })
            audioCache.current.clear()
        }
    }, [])

    /**
     * Play a sound effect
     */
    const play = useCallback((effect: SoundEffect) => {
        if (!config.enabled) return

        try {
            let audio = audioCache.current.get(effect)

            if (!audio) {
                // Lazy load sound if not cached
                const soundPaths: Record<SoundEffect, string> = {
                    'xp-gain': '/sounds/xp-gain.mp3',
                    'level-up': '/sounds/level-up.mp3',
                    'streak-continue': '/sounds/streak-continue.mp3',
                    'streak-lost': '/sounds/streak-lost.mp3',
                    'achievement': '/sounds/achievement.mp3',
                    'page-turn': '/sounds/page-turn.mp3',
                    'book-complete': '/sounds/book-complete.mp3',
                    'button-click': '/sounds/button-click.mp3',
                    'success': '/sounds/success.mp3',
                    'error': '/sounds/error.mp3',
                }

                audio = new Audio(soundPaths[effect])
                audio.volume = config.volume
                audioCache.current.set(effect, audio)
            }

            // Reset and play
            audio.currentTime = 0
            audio.play().catch((error) => {
                console.warn('Sound playback failed:', error)
            })
        } catch (error) {
            console.warn('Sound effect error:', error)
        }
    }, [config.enabled, config.volume])

    /**
     * Update sound configuration
     */
    const updateConfig = useCallback((newConfig: Partial<SoundConfig>) => {
        setConfig((prev) => {
            const updated = { ...prev, ...newConfig }

            // Update volume for all cached audio
            if (newConfig.volume !== undefined) {
                audioCache.current.forEach((audio) => {
                    audio.volume = updated.volume
                })
            }

            return updated
        })
    }, [])

    /**
     * Toggle sound effects on/off
     */
    const toggle = useCallback(() => {
        setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
    }, [])

    /**
     * Convenience methods for common sounds
     */
    const playXPGain = useCallback(() => play('xp-gain'), [play])
    const playLevelUp = useCallback(() => play('level-up'), [play])
    const playStreakContinue = useCallback(() => play('streak-continue'), [play])
    const playStreakLost = useCallback(() => play('streak-lost'), [play])
    const playAchievement = useCallback(() => play('achievement'), [play])
    const playPageTurn = useCallback(() => play('page-turn'), [play])
    const playBookComplete = useCallback(() => play('book-complete'), [play])
    const playButtonClick = useCallback(() => play('button-click'), [play])
    const playSuccess = useCallback(() => play('success'), [play])
    const playError = useCallback(() => play('error'), [play])

    return {
        play,
        config,
        updateConfig,
        toggle,
        // Convenience methods
        playXPGain,
        playLevelUp,
        playStreakContinue,
        playStreakLost,
        playAchievement,
        playPageTurn,
        playBookComplete,
        playButtonClick,
        playSuccess,
        playError,
    }
}
