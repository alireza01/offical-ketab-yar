'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingBar } from './loading-bar'

/**
 * Page Transition Wrapper
 * Shows loading bar immediately on navigation
 * Agent 3 (Psychology): Instant feedback for all navigation
 */
export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        // Show loading immediately when pathname changes
        setIsNavigating(true)

        // Hide after a short delay to ensure smooth transition
        const timer = setTimeout(() => {
            setIsNavigating(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <>
            {isNavigating && <LoadingBar />}
            {children}
        </>
    )
}
