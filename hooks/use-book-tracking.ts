'use client'

import {
    getReadingProgress,
    hasCompletedBook,
    startReading,
    updateReadingProgress,
} from '@/lib/actions/book-tracking'
import { logger } from '@/lib/logger'
import type { ReadingProgress } from '@/types/book-tracking'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Enhanced book tracking hook with offline support and performance optimizations
 * Implements Agent 2's performance strategy and Agent 3's psychology triggers
 * 
 * @param bookId - Unique book identifier
 * @param totalPages - Total pages in the book
 * @returns Reading progress state and control functions
 */
export function useBookTracking(bookId: string, totalPages: number) {
    const [progress, setProgress] = useState<ReadingProgress | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOnline, setIsOnline] = useState(true)

    // Use ref to avoid stale closure issues (Agent 2 optimization)
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const offlineQueueRef = useRef<Array<{ page: number; timestamp: number }>>([])

    // Detect online/offline status for PWA support (Agent 2 requirement)
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        setIsOnline(navigator.onLine)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Load initial progress
    useEffect(() => {
        let isMounted = true

        async function loadProgress() {
            setIsLoading(true)
            setError(null)

            try {
                const [progressResult, completionResult] = await Promise.all([
                    getReadingProgress(bookId),
                    hasCompletedBook(bookId),
                ])

                if (!isMounted) return

                if (progressResult.success && progressResult.progress) {
                    setProgress(progressResult.progress)
                }

                if (completionResult.success) {
                    setIsCompleted(completionResult.completed || false)
                }
            } catch (err) {
                if (!isMounted) return
                setError('Failed to load reading progress')
                logger.error('Failed to load reading progress', err, {
                    context: 'useBookTracking',
                    metadata: { bookId }
                })
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadProgress()

        return () => {
            isMounted = false
        }
    }, [bookId])

    // Sync offline queue when coming back online (Agent 2 PWA strategy)
    useEffect(() => {
        if (isOnline && offlineQueueRef.current.length > 0) {
            const syncOfflineQueue = async () => {
                const queue = [...offlineQueueRef.current]
                offlineQueueRef.current = []

                // Get the latest page from queue
                const latestEntry = queue[queue.length - 1]
                if (latestEntry) {
                    await handleUpdateProgress(latestEntry.page)
                    logger.info('Synced offline progress', {
                        context: 'useBookTracking',
                        metadata: { bookId, page: latestEntry.page, queueLength: queue.length }
                    })
                }
            }

            syncOfflineQueue()
        }
    }, [isOnline, bookId])

    // Cleanup timeout on unmount (Agent 2 memory leak fix)
    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
                autoSaveTimeoutRef.current = null
            }
        }
    }, [])

    // Start reading
    const handleStartReading = useCallback(async () => {
        setError(null)

        try {
            const result = await startReading(bookId, totalPages)

            if (result.success && result.progress) {
                setProgress(result.progress)
                logger.info('Started reading', {
                    context: 'useBookTracking',
                    metadata: { bookId, totalPages }
                })
                return { success: true }
            }

            setError(result.error || 'Failed to start reading')
            return { success: false, error: result.error }
        } catch (err) {
            const errorMessage = 'Failed to start reading'
            setError(errorMessage)
            logger.error(errorMessage, err, {
                context: 'useBookTracking',
                metadata: { bookId }
            })
            return { success: false, error: errorMessage }
        }
    }, [bookId, totalPages])

    // Update progress with offline support
    const handleUpdateProgress = useCallback(
        async (currentPage: number) => {
            setError(null)

            // If offline, queue the update (Agent 2 PWA strategy)
            if (!isOnline) {
                offlineQueueRef.current.push({
                    page: currentPage,
                    timestamp: Date.now()
                })

                // Update local state optimistically
                setProgress(prev => prev ? {
                    ...prev,
                    current_page: currentPage,
                    progress_percentage: Math.round((currentPage / totalPages) * 100)
                } : null)

                logger.info('Queued offline progress update', {
                    context: 'useBookTracking',
                    metadata: { bookId, currentPage }
                })

                return { success: true, offline: true }
            }

            try {
                const result = await updateReadingProgress(bookId, currentPage, totalPages)

                if (result.success) {
                    // Reload progress to get updated data
                    const progressResult = await getReadingProgress(bookId)
                    if (progressResult.success && progressResult.progress) {
                        setProgress(progressResult.progress)
                    }

                    if (result.isCompleted) {
                        setIsCompleted(true)
                        // Trigger completion celebration (Agent 3 psychology)
                        logger.info('Book completed!', {
                            context: 'useBookTracking',
                            metadata: { bookId, totalPages }
                        })
                    }

                    return { success: true, progress: result.progress, isCompleted: result.isCompleted }
                }

                setError(result.error || 'Failed to update progress')
                return { success: false, error: result.error }
            } catch (err) {
                const errorMessage = 'Failed to update progress'
                setError(errorMessage)
                logger.error(errorMessage, err, {
                    context: 'useBookTracking',
                    metadata: { bookId, currentPage }
                })
                return { success: false, error: errorMessage }
            }
        },
        [bookId, totalPages, isOnline]
    )

    // Auto-save progress with proper cleanup (Agent 2 optimization)
    const autoSaveProgress = useCallback(
        (currentPage: number) => {
            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
            }

            // Set new timeout
            autoSaveTimeoutRef.current = setTimeout(() => {
                handleUpdateProgress(currentPage)
                autoSaveTimeoutRef.current = null
            }, 2000) // Save after 2 seconds of inactivity
        },
        [handleUpdateProgress]
    )

    return {
        progress,
        isCompleted,
        isLoading,
        error,
        isOnline,
        startReading: handleStartReading,
        updateProgress: handleUpdateProgress,
        autoSaveProgress,
        currentPage: progress?.current_page || 1,
        progressPercentage: progress?.progress_percentage || 0,
        hasOfflineQueue: offlineQueueRef.current.length > 0,
    }
}
