'use client'

import { PHYSICS_CONFIG } from '@/components/reader/physics/physics-config'
import { useGesture } from '@use-gesture/react'
import { useRef } from 'react'

interface UsePageGestureProps {
    onPageTurn: (direction: 'next' | 'prev') => void
    onDragStart?: () => void
    onDragEnd?: () => void
    enabled?: boolean
}

export function usePageGesture({
    onPageTurn,
    onDragStart,
    onDragEnd,
    enabled = true,
}: UsePageGestureProps) {
    const isDraggingRef = useRef(false)
    const startXRef = useRef(0)

    const bind = useGesture(
        {
            onDragStart: ({ event }) => {
                if (!enabled) return

                // Prevent if user is selecting text
                const selection = window.getSelection()
                if (selection && selection.toString().length > 0) {
                    return
                }

                isDraggingRef.current = true
                startXRef.current = (event as MouseEvent | TouchEvent).type.includes('mouse')
                    ? (event as MouseEvent).clientX
                    : (event as TouchEvent).touches[0].clientX

                // Prevent text selection during drag
                document.body.style.userSelect = 'none'
                document.body.style.webkitUserSelect = 'none'

                onDragStart?.()
            },

            onDrag: ({ movement: [mx], velocity: [vx], direction: [dx], last, cancel }) => {
                if (!enabled || !isDraggingRef.current) return

                // Check if drag threshold met
                if (Math.abs(mx) < PHYSICS_CONFIG.gesture.dragThreshold && !last) {
                    return
                }

                const screenWidth = window.innerWidth
                const dragProgress = Math.abs(mx) / screenWidth

                if (last) {
                    // Release logic
                    const shouldFlip =
                        dragProgress > PHYSICS_CONFIG.gesture.flipThreshold ||
                        Math.abs(vx) > PHYSICS_CONFIG.gesture.velocityThreshold

                    if (shouldFlip) {
                        const direction = dx > 0 ? 'prev' : 'next'
                        onPageTurn(direction)
                    }

                    // Re-enable text selection
                    document.body.style.userSelect = ''
                    document.body.style.webkitUserSelect = ''

                    isDraggingRef.current = false
                    onDragEnd?.()
                }
            },

            onDragEnd: () => {
                if (!enabled) return

                // Cleanup
                document.body.style.userSelect = ''
                document.body.style.webkitUserSelect = ''
                isDraggingRef.current = false
                onDragEnd?.()
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

    return bind
}
