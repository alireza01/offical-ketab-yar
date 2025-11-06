'use client'

import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PageTransitionLoaderProps {
    isLoading: boolean
    children: React.ReactNode
}

export function PageTransitionLoader({ isLoading, children }: PageTransitionLoaderProps) {
    const [showLoader, setShowLoader] = useState(isLoading)

    useEffect(() => {
        if (isLoading) {
            setShowLoader(true)
        } else {
            // Delay hiding to allow smooth transition
            const timer = setTimeout(() => setShowLoader(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isLoading])

    if (!showLoader) {
        return <>{children}</>
    }

    return (
        <>
            {/* Branded Loading Overlay - Agent 3 Psychology */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            >
                <div className="flex flex-col items-center gap-6">
                    {/* Animated Logo */}
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-gold-600 to-gold-400 rounded-2xl flex items-center justify-center shadow-2xl">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <motion.div
                            className="absolute inset-0 bg-gold-500/30 rounded-2xl blur-xl"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>

                    {/* Loading Text */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-medium text-muted-foreground"
                    >
                        در حال بارگذاری...
                    </motion.p>

                    {/* Progress Bar */}
                    <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Hidden content */}
            <div className="opacity-0 pointer-events-none">
                {children}
            </div>
        </>
    )
}

// Skeleton for specific page layouts
export function LibraryPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="h-10 w-64 bg-muted rounded-lg skeleton" />
                <div className="h-6 w-96 bg-muted rounded-lg skeleton" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-muted rounded-lg skeleton" />
                ))}
            </div>

            {/* Book Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="aspect-[2/3] bg-muted rounded-lg skeleton" />
                        <div className="h-4 w-full bg-muted rounded skeleton" />
                        <div className="h-4 w-3/4 bg-muted rounded skeleton" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function DashboardPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-xl skeleton" />
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="h-80 bg-muted rounded-xl skeleton" />
                <div className="h-80 bg-muted rounded-xl skeleton" />
            </div>
        </div>
    )
}
