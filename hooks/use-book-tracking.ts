'use client'

import {
    getReadingProgress,
    hasCompletedBook,
    startReading,
    updateReadingProgress,
} from '@/lib/actions/book-tracking'
import type { ReadingProgress } from '@/types/book-tracking'
import { useCallback, useEffect, useState } from 'react'

export function useBookTracking(bookId: string, totalPages: number) {
    const [progress, setProgress] = useState<ReadingProgress | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Load initial progress
    useEffect(() => {
        async function loadProgress() {
            setIsLoading(true)
            setError(null)

            try {
                const [progressResult, completionResult] = await Promise.all([
                    getReadingProgress(bookId),
                    hasCompletedBook(bookId),
                ])

                if (progressResult.success && progressResult.progress) {
                    setProgress(progressResult.progress)
                }

                if (completionResult.success) {
                    setIsCompleted(completionResult.completed || false)
                }
            } catch (err) {
                setError('Failed to load reading progress')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        loadProgress()
    }, [bookId])

    // Start reading
    const handleStartReading = useCallback(async () => {
        setError(null)
        const result = await startReading(bookId, totalPages)

        if (result.success && result.progress) {
            setProgress(result.progress)
            return { success: true }
        }

        setError(result.error || 'Failed to start reading')
        return { success: false, error: result.error }
    }, [bookId, totalPages])

    // Update progress
    const handleUpdateProgress = useCallback(
        async (currentPage: number) => {
            setError(null)
            const result = await updateReadingProgress(bookId, currentPage, totalPages)

            if (result.success) {
                // Reload progress to get updated data
                const progressResult = await getReadingProgress(bookId)
                if (progressResult.success && progressResult.progress) {
                    setProgress(progressResult.progress)
                }

                if (result.isCompleted) {
                    setIsCompleted(true)
                }

                return { success: true, progress: result.progress }
            }

            setError(result.error || 'Failed to update progress')
            return { success: false, error: result.error }
        },
        [bookId, totalPages]
    )

    // Auto-save progress (debounced)
    const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(
        null
    )

    const autoSaveProgress = useCallback(
        (currentPage: number) => {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout)
            }

            const timeout = setTimeout(() => {
                handleUpdateProgress(currentPage)
            }, 2000) // Save after 2 seconds of inactivity

            setAutoSaveTimeout(timeout)
        },
        [handleUpdateProgress, autoSaveTimeout]
    )

    return {
        progress,
        isCompleted,
        isLoading,
        error,
        startReading: handleStartReading,
        updateProgress: handleUpdateProgress,
        autoSaveProgress,
        currentPage: progress?.current_page || 1,
        progressPercentage: progress?.progress_percentage || 0,
    }
}
