'use client'

import { useHapticFeedback, useMobileOptimizations } from '@/hooks/use-mobile-optimizations'
import { cn } from '@/lib/utils'
import { animated, useSpring } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { DynamicShadows } from './DynamicShadows'
import { PHYSICS_CONFIG, type PhysicsTheme } from './physics-config'

interface PhysicsPageTurnProps {
    children: ReactNode
    pageKey: string | number
    onPageTurn: (direction: 'next' | 'prev') => void
    theme: PhysicsTheme
    className?: string
    canGoNext: boolean
    canGoPrev: boolean
}

export function PhysicsPageTurn({
    children,
    pageKey,
    onPageTurn,
    theme,
    className,
    canGoNext,
    canGoPrev,
}: PhysicsPageTurnProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [direction, setDirection] = useState<'next' | 'prev'>('next')
    const [curlProgress, setCurlProgress] = useState(0)

    // Mobile optimizations
    useMobileOptimizations(true)
    const { triggerHaptic } = useHapticFeedback()

    // Spring animation for page transform
    const [{ x, rotateY }, api] = useSpring(() => ({
        x: 0,
        rotateY: 0,
        config: PHYSICS_CONFIG.spring,
    }))

    // Handle page turn completion
    const handlePageTurnComplete = useCallback(
        (dir: 'next' | 'prev') => {
            // Check if can turn
            if ((dir === 'next' && !canGoNext) || (dir === 'prev' && !canGoPrev)) {
                // Snap back
                api.start({
                    x: 0,
                    rotateY: 0,
                    config: { ...PHYSICS_CONFIG.spring, tension: 300, friction: 40 },
                })
                return
            }

            setDirection(dir)

            // Haptic feedback on page turn
            triggerHaptic('light')

            // Animate out
            api.start({
                x: dir === 'next' ? -window.innerWidth : window.innerWidth,
                rotateY: dir === 'next' ? -180 : 180,
                config: { ...PHYSICS_CONFIG.spring, tension: 200 },
                onRest: () => {
                    onPageTurn(dir)
                    // Reset for next page
                    api.set({ x: 0, rotateY: 0 })
                    setCurlProgress(0)
                },
            })
        },
        [api, onPageTurn, canGoNext, canGoPrev, triggerHaptic]
    )

    // Gesture binding
    const bind = useGesture(
        {
            onDragStart: ({ event }) => {
                // Prevent if user is selecting text
                const selection = window.getSelection()
                if (selection && selection.toString().length > 0) {
                    return
                }

                setIsDragging(true)

                // Prevent text selection during drag
                document.body.style.userSelect = 'none'
                document.body.style.webkitUserSelect = 'none'
            },

            onDrag: ({ movement: [mx], velocity: [vx], direction: [dx], last, cancel }) => {
                if (!isDragging && !last) return

                // Check if drag threshold met
                if (Math.abs(mx) < PHYSICS_CONFIG.gesture.dragThreshold && !last) {
                    return
                }

                // Determine direction
                const dragDir = mx > 0 ? 'prev' : 'next'

                // Check if can turn in this direction
                if ((dragDir === 'next' && !canGoNext) || (dragDir === 'prev' && !canGoPrev)) {
                    // Limit drag distance
                    const maxDrag = 50
                    const limitedMx = Math.max(-maxDrag, Math.min(maxDrag, mx))
                    api.start({
                        x: limitedMx,
                        rotateY: (limitedMx / window.innerWidth) * 30,
                        immediate: true,
                    })
                    return
                }

                if (!last) {
                    // During drag - immediate update
                    const rotation = (mx / window.innerWidth) * PHYSICS_CONFIG.visual.maxRotation
                    api.start({
                        x: mx,
                        rotateY: rotation,
                        immediate: true,
                    })
                    setDirection(dragDir)
                } else {
                    // On release
                    const dragProgress = Math.abs(mx) / window.innerWidth
                    const shouldFlip =
                        dragProgress > PHYSICS_CONFIG.gesture.flipThreshold ||
                        Math.abs(vx) > PHYSICS_CONFIG.gesture.velocityThreshold

                    if (shouldFlip) {
                        handlePageTurnComplete(dragDir)
                    } else {
                        // Snap back
                        api.start({
                            x: 0,
                            rotateY: 0,
                            config: { ...PHYSICS_CONFIG.spring, tension: 300, friction: 40 },
                        })
                    }

                    // Re-enable text selection
                    document.body.style.userSelect = ''
                    document.body.style.webkitUserSelect = ''
                    setIsDragging(false)
                }
            },

            onDragEnd: () => {
                // Cleanup
                document.body.style.userSelect = ''
                document.body.style.webkitUserSelect = ''
                setIsDragging(false)
            },
        },
        {
            drag: {
                filterTaps: true,
                threshold: PHYSICS_CONFIG.gesture.dragThreshold,
                axis: 'x',
            },
        }
    )

    // Update curl progress based on x position
    useEffect(() => {
        const unsubscribe = x.to((value) => {
            const progress = Math.abs(value) / window.innerWidth
            setCurlProgress(Math.min(progress, 1))
        })
        return () => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe()
            }
        }
    }, [x])

    return (
        <div className={cn('physics-page-container', className)}>
            <animated.div
                {...bind()}
                className={cn('physics-page', isDragging && 'dragging')}
                style={{
                    x,
                    rotateY: rotateY.to((r) => `${r}deg`),
                }}
            >
                {/* Dynamic shadows */}
                <DynamicShadows curlProgress={curlProgress} theme={theme} direction={direction} />

                {/* Page content */}
                <div className="physics-page-content">{children}</div>
            </animated.div>
        </div>
    )
}
