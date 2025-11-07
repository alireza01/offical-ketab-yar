'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Navigation Progress Bar
 * Shows IMMEDIATELY when user clicks any link
 * Agent 3 (Psychology): Instant feedback, no waiting
 * Agent 2 (Performance): GPU-accelerated animation
 */
export function NavigationProgress() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Start loading immediately
        setIsLoading(true)
        setProgress(0)

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev
                return prev + Math.random() * 10
            })
        }, 100)

        // Complete after a short delay
        const timeout = setTimeout(() => {
            setProgress(100)
            setTimeout(() => {
                setIsLoading(false)
                setProgress(0)
            }, 200)
        }, 300)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [pathname, searchParams])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gold-500/20"
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 shadow-lg shadow-gold-500/50"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
