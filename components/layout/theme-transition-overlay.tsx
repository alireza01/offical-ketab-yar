'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeTransitionOverlay() {
    const { resolvedTheme } = useTheme()
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [prevTheme, setPrevTheme] = useState(resolvedTheme)

    useEffect(() => {
        if (resolvedTheme && resolvedTheme !== prevTheme && prevTheme) {
            setIsTransitioning(true)
            setPrevTheme(resolvedTheme)

            // End transition after animation completes
            const timer = setTimeout(() => {
                setIsTransitioning(false)
            }, 400)

            return () => clearTimeout(timer)
        } else if (resolvedTheme && !prevTheme) {
            setPrevTheme(resolvedTheme)
        }
    }, [resolvedTheme, prevTheme])

    return (
        <AnimatePresence>
            {isTransitioning && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.15, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                        times: [0, 0.5, 1]
                    }}
                    className="fixed inset-0 z-[100] pointer-events-none"
                    style={{
                        background: resolvedTheme === 'dark'
                            ? 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)'
                            : 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, rgba(255, 255, 255, 0.3) 100%)'
                    }}
                />
            )}
        </AnimatePresence>
    )
}
