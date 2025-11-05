"use client"

import { logger } from '@/lib/logger'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Offline queue item structure
 */
interface QueueItem {
    id: string
    type: 'reading_progress' | 'xp' | 'streak' | 'vocabulary'
    data: any
    timestamp: number
    retries: number
}

/**
 * IndexedDB database name and version
 */
const DB_NAME = 'ketab-yar-offline'
const DB_VERSION = 1
const STORE_NAME = 'sync-queue'

/**
 * Enhanced offline sync hook for PWA support
 * Implements Agent 2's PWA offline strategy
 * 
 * @returns Offline sync state and functions
 */
export function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(true)
    const [queueSize, setQueueSize] = useState(0)
    const [isSyncing, setIsSyncing] = useState(false)
    const dbRef = useRef<IDBDatabase | null>(null)
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    /**
     * Initialize IndexedDB
     */
    useEffect(() => {
        if (typeof window === 'undefined') return

        const initDB = async () => {
            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION)

                request.onerror = () => {
                    logger.error('Failed to open IndexedDB', request.error)
                }

                request.onsuccess = () => {
                    dbRef.current = request.result
                    updateQueueSize()
                }

                request.onupgradeneeded = (event) => {
                    const db = (event.target as IDBOpenDBRequest).result

                    // Create object store if it doesn't exist
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                        store.createIndex('timestamp', 'timestamp', { unique: false })
                        store.createIndex('type', 'type', { unique: false })
                    }
                }
            } catch (error) {
                logger.error('IndexedDB initialization failed', error)
            }
        }

        initDB()

        return () => {
            if (dbRef.current) {
                dbRef.current.close()
            }
        }
    }, [])

    /**
     * Monitor online/offline status
     */
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            logger.info('Connection restored, syncing offline queue')
            syncQueue()
        }

        const handleOffline = () => {
            setIsOnline(false)
            logger.info('Connection lost, entering offline mode')
        }

        setIsOnline(navigator.onLine)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    /**
     * Update queue size from IndexedDB
     */
    const updateQueueSize = useCallback(async () => {
        if (!dbRef.current) return

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const countRequest = store.count()

            countRequest.onsuccess = () => {
                setQueueSize(countRequest.result)
            }
        } catch (error) {
            logger.error('Failed to update queue size', error)
        }
    }, [])

    /**
     * Add item to offline queue
     */
    const addToQueue = useCallback(async (
        type: QueueItem['type'],
        data: any
    ): Promise<boolean> => {
        if (!dbRef.current) {
            logger.error('IndexedDB not initialized')
            return false
        }

        try {
            const item: QueueItem = {
                id: `${type}-${Date.now()}-${Math.random()}`,
                type,
                data,
                timestamp: Date.now(),
                retries: 0,
            }

            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.add(item)

            return new Promise((resolve) => {
                request.onsuccess = () => {
                    updateQueueSize()
                    logger.info('Added to offline queue', {
                        context: 'useOfflineSync',
                        metadata: { type, itemId: item.id }
                    })
                    resolve(true)
                }

                request.onerror = () => {
                    logger.error('Failed to add to queue', request.error)
                    resolve(false)
                }
            })
        } catch (error) {
            logger.error('Failed to add to offline queue', error)
            return false
        }
    }, [updateQueueSize])

    /**
     * Sync offline queue with server
     */
    const syncQueue = useCallback(async () => {
        if (!dbRef.current || !isOnline || isSyncing) return

        setIsSyncing(true)

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.getAll()

            request.onsuccess = async () => {
                const items: QueueItem[] = request.result

                if (items.length === 0) {
                    setIsSyncing(false)
                    return
                }

                logger.info('Syncing offline queue', {
                    context: 'useOfflineSync',
                    metadata: { itemCount: items.length }
                })

                // Process items in order
                for (const item of items) {
                    try {
                        await processQueueItem(item)
                        await removeFromQueue(item.id)
                    } catch (error) {
                        logger.error('Failed to sync queue item', error, {
                            context: 'useOfflineSync',
                            metadata: { itemId: item.id, type: item.type }
                        })

                        // Increment retry count
                        await updateRetryCount(item.id)
                    }
                }

                await updateQueueSize()
                setIsSyncing(false)
            }

            request.onerror = () => {
                logger.error('Failed to read queue', request.error)
                setIsSyncing(false)
            }
        } catch (error) {
            logger.error('Queue sync failed', error)
            setIsSyncing(false)
        }
    }, [isOnline, isSyncing, updateQueueSize])

    /**
     * Process individual queue item
     */
    const processQueueItem = async (item: QueueItem): Promise<void> => {
        // This will be implemented based on item type
        // For now, just log the processing
        logger.info('Processing queue item', {
            context: 'useOfflineSync',
            metadata: { type: item.type, itemId: item.id }
        })

        // TODO: Implement actual sync logic based on item.type
        // - reading_progress: Call updateReadingProgress API
        // - xp: Call addXP API
        // - streak: Call updateStreak API
        // - vocabulary: Call saveWord API
    }

    /**
     * Remove item from queue
     */
    const removeFromQueue = useCallback(async (id: string): Promise<void> => {
        if (!dbRef.current) return

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            store.delete(id)
        } catch (error) {
            logger.error('Failed to remove from queue', error)
        }
    }, [])

    /**
     * Update retry count for failed item
     */
    const updateRetryCount = useCallback(async (id: string): Promise<void> => {
        if (!dbRef.current) return

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const getRequest = store.get(id)

            getRequest.onsuccess = () => {
                const item = getRequest.result as QueueItem
                if (item) {
                    item.retries += 1

                    // Remove if too many retries
                    if (item.retries > 5) {
                        store.delete(id)
                        logger.warn('Queue item removed after max retries', {
                            context: 'useOfflineSync',
                            metadata: { itemId: id }
                        })
                    } else {
                        store.put(item)
                    }
                }
            }
        } catch (error) {
            logger.error('Failed to update retry count', error)
        }
    }, [])

    /**
     * Clear entire queue (for testing or reset)
     */
    const clearQueue = useCallback(async (): Promise<void> => {
        if (!dbRef.current) return

        try {
            const transaction = dbRef.current.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            store.clear()
            await updateQueueSize()
            logger.info('Offline queue cleared')
        } catch (error) {
            logger.error('Failed to clear queue', error)
        }
    }, [updateQueueSize])

    return {
        isOnline,
        queueSize,
        isSyncing,
        addToQueue,
        syncQueue,
        clearQueue,
    }
}
