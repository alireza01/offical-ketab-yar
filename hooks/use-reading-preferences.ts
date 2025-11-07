'use client'

import { useEffect, useState } from 'react'

export interface ReadingPreferences {
    fontSize: number
    lineHeight: number
    fontFamily: string
    theme: 'light' | 'sepia' | 'dark'
    pageAnimation: boolean
    physicsPageTurn: boolean
    autoSave: boolean
}

const DEFAULT_PREFERENCES: ReadingPreferences = {
    fontSize: 20,
    lineHeight: 1.8,
    fontFamily: 'vazirmatn',
    theme: 'sepia',
    pageAnimation: true,
    physicsPageTurn: false, // Default OFF
    autoSave: true,
}

export function useReadingPreferences() {
    const [preferences, setPreferences] = useState<ReadingPreferences>(DEFAULT_PREFERENCES)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('ketab-yar-reading-preferences')
            if (saved) {
                const parsed = JSON.parse(saved)
                setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
            }
        } catch (error) {
            console.error('Failed to load reading preferences:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('ketab-yar-reading-preferences', JSON.stringify(preferences))
            } catch (error) {
                console.error('Failed to save reading preferences:', error)
            }
        }
    }, [preferences, isLoaded])

    const updatePreference = <K extends keyof ReadingPreferences>(
        key: K,
        value: ReadingPreferences[K]
    ) => {
        setPreferences((prev) => ({ ...prev, [key]: value }))
    }

    return {
        preferences,
        setPreferences,
        updatePreference,
        isLoaded,
    }
}
