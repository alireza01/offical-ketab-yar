/**
 * Reading Tracker Component
 * Tracks reading activity and awards XP
 * Agent 2 (Performance): Efficient tracking with debouncing
 * Agent 3 (Psychology): Immediate feedback
 */

'use client'

import { useEffect, useRef } from 'react'
import { useGamificationContext } from './gamification-provider'

interface ReadingTrackerProps {
    bookId: string
    currentPage: number
    totalPages: number
    isReading: boolean
}

export function ReadingTracker({
    currentPage,
    totalPages,
    isReading,
}: ReadingTrackerProps) {
    const { trackPageRead, trackReadingTime, trackBookCompletion } =
        useGamificationContext()

    const lastPage = useRef(currentPage)
    const readingStartTime = useRef<number | null>(null)
    const readingTimeAccumulator = useRef(0)

    // Track page changes
    useEffect(() => {
        if (currentPage !== lastPage.current && currentPage > lastPage.current) {
            const pagesRead = currentPage - lastPage.current
            trackPageRead(pagesRead)
            lastPage.current = currentPage
        }
    }, [currentPage, trackPageRead])

    // Track reading time
    useEffect(() => {
        if (isReading) {
            readingStartTime.current = Date.now()

            // Track time every 30 seconds
            const interval = setInterval(() => {
                if (readingStartTime.current) {
                    const minutesRead =
                        (Date.now() - readingStartTime.current) / (1000 * 60)
                    readingTimeAccumulator.current += minutesRead
                    readingStartTime.current = Date.now()

                    // Send to server every 30 seconds
                    if (readingTimeAccumulator.current >= 0.5) {
                        trackReadingTime(Math.floor(readingTimeAccumulator.current))
                        readingTimeAccumulator.current = 0
                    }
                }
            }, 30000) // 30 seconds

            return () => {
                clearInterval(interval)

                // Track remaining time on unmount
                if (readingStartTime.current) {
                    const minutesRead =
                        (Date.now() - readingStartTime.current) / (1000 * 60)
                    readingTimeAccumulator.current += minutesRead

                    if (readingTimeAccumulator.current > 0) {
                        trackReadingTime(Math.floor(readingTimeAccumulator.current))
                    }
                }
            }
        }
    }, [isReading, trackReadingTime])

    // Track book completion
    useEffect(() => {
        if (currentPage >= totalPages) {
            trackBookCompletion()
        }
    }, [currentPage, totalPages, trackBookCompletion])

    // This component doesn't render anything
    return null
}
