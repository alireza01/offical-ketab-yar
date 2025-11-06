/**
 * Native Haptic Feedback Hook
 * Provides haptic feedback for touch interactions (iOS/Android)
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

export function useNativeHaptic() {
    const triggerHaptic = (style: HapticStyle = 'medium') => {
        // Check if the Vibration API is available
        if (!('vibrate' in navigator)) {
            return
        }

        // Vibration patterns for different styles
        const patterns: Record<HapticStyle, number | number[]> = {
            light: 10,
            medium: 20,
            heavy: 30,
            success: [10, 50, 10],
            warning: [20, 100, 20],
            error: [30, 100, 30, 100, 30],
        }

        try {
            navigator.vibrate(patterns[style])
        } catch (err) {
            // Silently fail if vibration is not supported
            console.debug('Haptic feedback not supported:', err)
        }
    }

    return { triggerHaptic }
}

/**
 * Hook for detecting if the app is running in standalone mode (installed PWA)
 */
export function useIsStandalone() {
    if (typeof window === 'undefined') return false

    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as { standalone?: boolean }).standalone ||
        document.referrer.includes('android-app://')

    return isStandalone
}

/**
 * Hook for detecting device type
 */
export function useDeviceType() {
    if (typeof window === 'undefined') {
        return { isMobile: false, isTablet: false, isDesktop: true }
    }

    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile = /iphone|ipod|android|blackberry|windows phone/.test(userAgent)
    const isTablet = /ipad|android(?!.*mobile)/.test(userAgent)
    const isDesktop = !isMobile && !isTablet

    return { isMobile, isTablet, isDesktop }
}

/**
 * Hook for detecting iOS device
 */
export function useIsIOS() {
    if (typeof window === 'undefined') return false

    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream
}

/**
 * Hook for detecting Android device
 */
export function useIsAndroid() {
    if (typeof window === 'undefined') return false

    return /android/i.test(navigator.userAgent)
}
