'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Agent 3 (Psychology): Premium loading bar with smooth animation
 * Shows at top of page during navigation/loading
 */
export function LoadingBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev
                return prev + Math.random() * 10
            })
        }, 200)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gold-500/20 z-50">
            <motion.div
                className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            />
        </div>
    )
}
