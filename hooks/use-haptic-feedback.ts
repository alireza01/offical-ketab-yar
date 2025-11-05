"use client"

import { useCallback, useEffect, useState } from 'react'
import { useIsTouchDevice } from './use-mobile'

/**
 * Haptic feedback patterns for different interactions
 * Implements Agent 3's mobile native app feel
 */
export type HapticPattern =
    | 'light'      // Subtle feedback (hover, selection)
    | 'medium'     // Standard feedback (button press)
    | 'heavy'      // Strong feedback (success, error)
    | 'success'    // Achievement unlocked
    | 'warning'    // Attention needed
    | 'error'      // Something went wrong

/**
 * Enhanced haptic feedback hook for mobile devices
 * Provides native app-like tactile feedback
 * 
 * @returns Haptic feedback functions
 */
export function useHapticFeedback() {
    const isTouch = useIsTouchDevice()
    const [isSupported, setIsSupported] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        // Check if Vibration API is supported
        setIsSupported('vibrate' in navigator)
    }, [])

    /**
     * Trigger haptic feedback with specified pattern
     */
    const triggerHaptic = useCallback((pattern: HapticPattern = 'medium') => {
        if (!isSupported || !isTouch) return

        try {
            switch (pattern) {
                case 'light':
                    navigator.vibrate(10)
                    break
                case 'medium':
                    navigator.vibrate(20)
                    break
                case 'heavy':
                    navigator.vibrate(40)
                    break
                case 'success':
                    navigator.vibrate([10, 50, 10, 50, 30])
                    break
                case 'warning':
                    navigator.vibrate([20, 100, 20])
                    break
                case 'error':
                    navigator.vibrate([50, 100, 50, 100, 50])
                    break
            }
        } catch (error) {
            console.warn('Haptic feedback failed:', error)
        }
    }, [isSupported, isTouch])

    /**
     * Trigger haptic on button press
     */
    const onButtonPress = useCallback(() => {
        triggerHaptic('medium')
    }, [triggerHaptic])

    /**
     * Trigger haptic on success action
     */
    const onSuccess = useCallback(() => {
        triggerHaptic('success')
    }, [triggerHaptic])

    /**
     * Trigger haptic on error
     */
    const onError = useCallback(() => {
        triggerHaptic('error')
    }, [triggerHaptic])

    /**
     * Trigger haptic on selection/hover
     */
    const onSelect = useCallback(() => {
        triggerHaptic('light')
    }, [triggerHaptic])

    return {
        isSupported,
        triggerHaptic,
        onButtonPress,
        onSuccess,
        onError,
        onSelect,
    }
}
