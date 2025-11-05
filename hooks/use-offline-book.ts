'use client'

import {
    deleteOfflineBook,
    downloadBookForOffline,
    getOfflineBook,
    getOfflineBooksList
} from '@/lib/pwa/offline-storage'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface UseOfflineBookOptions {
    bookId: string
    userId: string
}

export function useOfflineBook({ bookId, userId }: UseOfflineBookOptions) {
    const [isDownloaded, setIsDownloaded] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkIfDownloaded()
    }, [bookId])

    const checkIfDownloaded = async () => {
        try {
            setIsLoading(true)
            const offlineBooks = await getOfflineBooksList()
            const downloaded = offlineBooks.some(
                (book) => book.bookId === `${bookId}-en` || book.bookId === `${bookId}-fa`
            )
            setIsDownloaded(downloaded)
        } catch (error) {
            console.error('Error checking offline status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const downloadBook = async (language: 'en' | 'fa', content: string) => {
        try {
            setIsDownloading(true)
            toast.loading('Downloading book for offline reading...')

            const result = await downloadBookForOffline(bookId, language, content, userId)

            if (result.success) {
                setIsDownloaded(true)
                toast.success('Book downloaded! You can now read it offline.')
            } else {
                toast.error('Failed to download book: ' + result.error)
            }
        } catch (error) {
            toast.error('Error downloading book')
            console.error('Download error:', error)
        } finally {
            setIsDownloading(false)
        }
    }

    const readOfflineBook = async (language: 'en' | 'fa'): Promise<string | null> => {
        try {
            const content = await getOfflineBook(bookId, language, userId)
            return content
        } catch (error) {
            console.error('Error reading offline book:', error)
            return null
        }
    }

    const deleteBook = async (language: 'en' | 'fa') => {
        try {
            const success = await deleteOfflineBook(bookId, language)

            if (success) {
                setIsDownloaded(false)
                toast.success('Book removed from offline storage')
            } else {
                toast.error('Failed to remove book')
            }
        } catch (error) {
            toast.error('Error removing book')
            console.error('Delete error:', error)
        }
    }

    return {
        isDownloaded,
        isDownloading,
        isLoading,
        downloadBook,
        readOfflineBook,
        deleteBook,
        checkIfDownloaded,
    }
}
