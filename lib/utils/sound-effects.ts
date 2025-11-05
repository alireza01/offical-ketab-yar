/**
 * Sound Effects Utility
 * Agent 3 (Psychology) - Audio feedback for gamification
 * 
 * All sounds are optional and fail gracefully if not available
 */

type SoundType = 'xp-gain' | 'level-up' | 'streak' | 'achievement' | 'celebration' | 'page-turn' | 'bookmark' | 'error' | 'success'

interface SoundConfig {
    volume: number
    playbackRate?: number
}

const DEFAULT_VOLUME = 0.3
const DEFAULT_PLAYBACK_RATE = 1.0

// Sound file paths (relative to /public/sounds/)
const SOUND_PATHS: Record<SoundType, string> = {
    'xp-gain': '/sounds/xp-gain.mp3',
    'level-up': '/sounds/level-up.mp3',
    'streak': '/sounds/streak.mp3',
    'achievement': '/sounds/achievement.mp3',
    'celebration': '/sounds/celebration.mp3',
    'page-turn': '/sounds/page-turn.mp3',
    'bookmark': '/sounds/bookmark.mp3',
    'error': '/sounds/error.mp3',
    'success': '/sounds/success.mp3',
}

// Audio cache to prevent re-loading
const audioCache = new Map<SoundType, HTMLAudioElement>()

// User preferences
let soundEnabled = true
let masterVolume = DEFAULT_VOLUME

/**
 * Initialize sound system
 * Call this once on app load
 */
export function initSoundSystem() {
    // Load sound preferences from localStorage
    if (typeof window !== 'undefined') {
        const savedEnabled = localStorage.getItem('sound-enabled')
        const savedVolume = localStorage.getItem('sound-volume')

        if (savedEnabled !== null) {
            soundEnabled = savedEnabled === 'true'
        }

        if (savedVolume !== null) {
            masterVolume = parseFloat(savedVolume)
        }
    }
}

/**
 * Play a sound effect
 */
export function playSound(
    type: SoundType,
    config: Partial<SoundConfig> = {}
): void {
    // Don't play if sounds are disabled
    if (!soundEnabled || typeof window === 'undefined') {
        return
    }

    try {
        let audio = audioCache.get(type)

        // Create and cache audio if not exists
        if (!audio) {
            audio = new Audio(SOUND_PATHS[type])
            audioCache.set(type, audio)
        }

        // Configure audio
        audio.volume = (config.volume ?? masterVolume) * masterVolume
        audio.playbackRate = config.playbackRate ?? DEFAULT_PLAYBACK_RATE

        // Reset and play
        audio.currentTime = 0
        audio.play().catch((error) => {
            // Silently fail if audio can't play (e.g., user hasn't interacted with page yet)
            if (process.env.NODE_ENV === 'development') {
                console.warn(`Failed to play sound: ${type}`, error)
            }
        })
    } catch (error) {
        // Silently fail
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Error playing sound: ${type}`, error)
        }
    }
}

/**
 * Enable/disable all sounds
 */
export function setSoundEnabled(enabled: boolean): void {
    soundEnabled = enabled

    if (typeof window !== 'undefined') {
        localStorage.setItem('sound-enabled', enabled.toString())
    }
}

/**
 * Get current sound enabled state
 */
export function isSoundEnabled(): boolean {
    return soundEnabled
}

/**
 * Set master volume (0.0 to 1.0)
 */
export function setMasterVolume(volume: number): void {
    masterVolume = Math.max(0, Math.min(1, volume))

    if (typeof window !== 'undefined') {
        localStorage.setItem('sound-volume', masterVolume.toString())
    }
}

/**
 * Get current master volume
 */
export function getMasterVolume(): number {
    return masterVolume
}

/**
 * Preload sounds for better performance
 * Call this during app initialization or on user interaction
 */
export function preloadSounds(types: SoundType[]): void {
    if (typeof window === 'undefined') return

    types.forEach((type) => {
        if (!audioCache.has(type)) {
            const audio = new Audio(SOUND_PATHS[type])
            audio.preload = 'auto'
            audioCache.set(type, audio)
        }
    })
}

/**
 * Clear audio cache (useful for memory management)
 */
export function clearSoundCache(): void {
    audioCache.forEach((audio) => {
        audio.pause()
        audio.src = ''
    })
    audioCache.clear()
}

// Convenience functions for common sounds
export const soundEffects = {
    xpGain: (amount: number) => {
        // Vary pitch based on amount
        const playbackRate = 1.0 + Math.min(amount / 100, 0.3)
        playSound('xp-gain', { playbackRate })
    },

    levelUp: () => {
        playSound('level-up', { volume: 0.5 })
    },

    streak: (days: number) => {
        // Louder for milestone streaks
        const volume = days % 7 === 0 ? 0.5 : 0.3
        playSound('streak', { volume })
    },

    achievement: () => {
        playSound('achievement', { volume: 0.4 })
    },

    celebration: () => {
        playSound('celebration', { volume: 0.4 })
    },

    pageTurn: () => {
        playSound('page-turn', { volume: 0.2 })
    },

    bookmark: () => {
        playSound('bookmark', { volume: 0.25 })
    },

    error: () => {
        playSound('error', { volume: 0.3 })
    },

    success: () => {
        playSound('success', { volume: 0.3 })
    },
}

// React hook for sound effects
export function useSoundEffects() {
    return {
        playSound,
        soundEffects,
        setSoundEnabled,
        isSoundEnabled: isSoundEnabled(),
        setMasterVolume,
        masterVolume: getMasterVolume(),
    }
}
