/**
 * Ketab-Yar Custom Hooks
 * Centralized export for all custom React hooks
 * 
 * Organized by category:
 * - Core: Essential hooks for app functionality
 * - Gamification: XP, streaks, achievements
 * - UI/UX: Responsive design, animations, feedback
 * - Performance: Optimization utilities
 * - Offline: PWA and offline support
 */

// ============================================================================
// CORE HOOKS
// ============================================================================

export { useBookTracking } from './use-book-tracking'
export { AuthProvider, useSupabaseAuth } from './use-supabase-auth'

// ============================================================================
// GAMIFICATION HOOKS (Agent 3 Psychology)
// ============================================================================

export { useAnimationTrigger } from './use-animation-trigger'
export type { AnimationTrigger } from './use-animation-trigger'
export { useGamification, useReadingStats } from './use-gamification'

// ============================================================================
// UI/UX HOOKS (Agent 3 Native App Feel)
// ============================================================================

export {
    breakpoints, useBreakpoint,
    useDeviceType, useIsDesktop, useIsMobile,
    useIsTablet, useIsTouchDevice, useOrientation, usePrefersReducedMotion, useViewportSize
} from './use-mobile'
export type { Breakpoint, DeviceType } from './use-mobile'

export { useHapticFeedback } from './use-haptic-feedback'
export type { HapticPattern } from './use-haptic-feedback'
export { useMediaQuery } from './use-media-query'
export { useSoundEffects } from './use-sound-effects'
export type { SoundEffect } from './use-sound-effects'

// ============================================================================
// PERFORMANCE HOOKS (Agent 2 Optimization)
// ============================================================================

export { useDebounce } from './use-debounce'
export { useLocalStorage, useSessionStorage } from './use-local-storage'

// ============================================================================
// OFFLINE HOOKS (Agent 2 PWA Strategy)
// ============================================================================

export { useOfflineSync } from './use-offline-sync'

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { AnimationTrigger, Breakpoint, DeviceType, HapticPattern, SoundEffect }

