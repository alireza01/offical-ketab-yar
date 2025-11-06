'use client'

/**
 * Page Transition Component
 * Agent 2 (Performance): GPU-optimized animations (transform/opacity only)
 * Agent 3 (Psychology): Smooth, satisfying page-turn feel
 */

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
    pageKey: string | number
    direction?: 'next' | 'prev'
    animationType?: 'slide' | 'fade' | 'scale'
}

export function PageTransition({
    children,
    pageKey,
    direction = 'next',
    animationType = 'slide',
}: PageTransitionProps) {
    // Agent 2: All animations use transform/opacity (GPU-accelerated)
    const variants = {
        slide: {
            initial: {
                opacity: 0,
                x: direction === 'next' ? 100 : -100,
            },
            animate: {
                opacity: 1,
                x: 0,
            },
            exit: {
                opacity: 0,
                x: direction === 'next' ? -100 : 100,
            },
        },
        fade: {
            initial: {
                opacity: 0,
            },
            animate: {
                opacity: 1,
            },
            exit: {
                opacity: 0,
            },
        },
        scale: {
            initial: {
                opacity: 0,
                scale: 0.95,
            },
            animate: {
                opacity: 1,
                scale: 1,
            },
            exit: {
                opacity: 0,
                scale: 1.05,
            },
        },
    }

    const selectedVariant = variants[animationType]

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pageKey}
                initial={selectedVariant.initial}
                animate={selectedVariant.animate}
                exit={selectedVariant.exit}
                transition={{
                    duration: 0.25, // Agent 3: Fast enough to not annoy, slow enough to feel smooth
                    ease: 'easeOut',
                }}
                style={{
                    willChange: 'transform, opacity', // Agent 2: GPU hint
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

/**
 * Paragraph Transition Component
 * For animating individual paragraphs on scroll
 */
interface ParagraphTransitionProps {
    children: ReactNode
    index: number
    delay?: number
}

export function ParagraphTransition({
    children,
    index,
    delay = 0.05,
}: ParagraphTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * delay,
                ease: 'easeOut',
            }}
            style={{
                willChange: 'transform, opacity',
            }}
        >
            {children}
        </motion.div>
    )
}
