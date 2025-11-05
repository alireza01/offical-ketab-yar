"use client"

import { useEffect, useState } from "react"

/**
 * Enhanced media query hook with SSR support
 * Fixes hydration mismatch by using proper initial state
 * Implements Agent 2's performance optimization
 * 
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with undefined to prevent hydration mismatch (Agent 2 fix)
  const [matches, setMatches] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Modern browsers support addEventListener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Use addEventListener (modern approach)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
      return () => {
        mediaQuery.removeEventListener("change", handler)
      }
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler)
      return () => {
        mediaQuery.removeListener(handler)
      }
    }
  }, [query])

  // Return false during SSR to prevent hydration issues
  return matches ?? false
}
