'use client'

import { useEffect } from 'react'

/**
 * Mobile Optimizations for Physics Page Turn
 * Agent 2 (Performance): Prevent browser interference
 * Agent 3 (Psychology): Native app feel
 */

export function useMobileOptimizations(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return

        // Prevent pull-to-refresh on mobile
        const preventPullToRefresh = (e: TouchEvent) => {
            if (e.touches.length > 1) return
            const touch = e.touches[0]
            if (touch.clientY > 0 && window.scrollY === 0) {
                e.preventDefault()
            }
        }

        // Prevent double-tap zoom
        const preventDoubleTapZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault()
            }
        }

        // Add listeners
        document.addEventListener('touchstart', preventPullToRefresh, { passive: false })
        document.addEventListener('touchmove', preventDoubleTapZoom, { passive: false })

        return () => {
            document.removeEventListener('touchstart', preventPullToRefresh)
            document.removeEventListener('touchmove', preventDoubleTapZoom)
        }
    }, [enabled])
}

/**
 * Haptic Feedback Hook
 * Agent 3 (Psychology): Tactile feedback for satisfaction
 */
export function useHapticFeedback() {
    const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 30,
            }
            navigator.vibrate(patterns[type])
        }
    }

    return { triggerHaptic }
}
