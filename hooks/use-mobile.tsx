"use client"

import { useEffect, useState } from "react"
import { useMediaQuery } from "./use-media-query"

/**
 * Responsive breakpoints matching Tailwind CSS defaults
 * Optimized for mobile-first design (Agent 3 requirement)
 */
export const breakpoints = {
  mobile: 640,    // sm
  tablet: 768,    // md
  laptop: 1024,   // lg
  desktop: 1280,  // xl
  wide: 1536,     // 2xl
} as const

export type Breakpoint = keyof typeof breakpoints

/**
 * Device type detection for native app feel
 * Implements Agent 3's mobile/desktop optimization strategy
 */
export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'wide'

/**
 * Detect if user is on mobile device (< 640px)
 * Optimized for mobile-first responsive design
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${breakpoints.mobile - 1}px)`)
}

/**
 * Detect if user is on tablet device (640px - 1023px)
 */
export function useIsTablet(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.laptop - 1}px)`)
}

/**
 * Detect if user is on desktop device (>= 1024px)
 * For desktop app-like experience (Agent 3 requirement)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.laptop}px)`)
}

/**
 * Check if viewport is at or above a specific breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`)
}

/**
 * Get current device type for adaptive UI
 * Implements Agent 3's native app feel strategy
 */
export function useDeviceType(): DeviceType {
  const isWide = useMediaQuery(`(min-width: ${breakpoints.wide}px)`)
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.desktop}px)`)
  const isLaptop = useMediaQuery(`(min-width: ${breakpoints.laptop}px)`)
  const isTablet = useMediaQuery(`(min-width: ${breakpoints.tablet}px)`)
  const isMobile = useMediaQuery(`(min-width: ${breakpoints.mobile}px)`)

  if (isWide) return 'wide'
  if (isDesktop) return 'desktop'
  if (isLaptop) return 'laptop'
  if (isTablet) return 'tablet'
  return 'mobile'
}

/**
 * Detect touch capability for mobile interactions
 * Enables haptic feedback and touch gestures (Agent 3)
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - Legacy property
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouch()
  }, [])

  return isTouch
}

/**
 * Get viewport dimensions for responsive calculations
 * Useful for dynamic layouts and animations
 */
export function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial size
    handleResize()

    // Listen for resize events
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

/**
 * Detect if device prefers reduced motion (accessibility)
 * Implements Agent 3's accessibility requirement
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Detect device orientation for adaptive layouts
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const isPortrait = useMediaQuery('(orientation: portrait)')
  return isPortrait ? 'portrait' : 'landscape'
}

// Example usage:
// const isMobile = useIsMobile()
// const isTablet = useIsTablet()
// const isDesktop = useIsDesktop()
// const deviceType = useDeviceType()
// const isTouch = useIsTouchDevice()
// const { width, height } = useViewportSize()
// const prefersReducedMotion = usePrefersReducedMotion()
// const orientation = useOrientation()
