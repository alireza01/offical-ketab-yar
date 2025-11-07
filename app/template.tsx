'use client'

import { LoadingBar } from '@/components/ui/loading-bar'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

/**
 * Template Component - Shows loading on EVERY page navigation
 * Agent 3 (Psychology): Instant feedback, smooth transitions
 * Agent 2 (Performance): Optimized animations
 */
export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
                <Suspense fallback={<LoadingBar />}>
                    {children}
                </Suspense>
            </motion.div>
        </AnimatePresence>
    )
}
