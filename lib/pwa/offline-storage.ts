/**
 * PWA Offline Storage Manager
 * 
 * Agent 2 (Performance): Secure offline book content storage
 * Uses IndexedDB + SubtleCrypto for encrypted content
 * 
 * Features:
 * - Encrypted book content storage
 * - Offline reading queue
 * - Sync when back online
 */

'use client'

import { logger } from '@/lib/logger'

const DB_NAME = 'ketab-yar-offline'
const DB_VERSION = 1
const BOOKS_STORE = 'books'
const QUEUE_STORE = 'sync-queue'

interface OfflineBook {
    bookId: string
    language: 'en' | 'fa'
    encryptedContent: ArrayBuffer
    downloadedAt: string
    lastAccessedAt: string
}

interface SyncQueueItem {
    id: string
    type: 'xp' | 'progress' | 'vocabulary'
    data: Record<string, unknown>
    timestamp: string
}

/**
 * Initialize IndexedDB
 */
async function getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result

            // Books store
            if (!db.objectStoreNames.contains(BOOKS_STORE)) {
                const booksStore = db.createObjectStore(BOOKS_STORE, { keyPath: 'bookId' })
                booksStore.createIndex('downloadedAt', 'downloadedAt', { unique: false })
                booksStore.createIndex('lastAccessedAt', 'lastAccessedAt', { unique: false })
            }

            // Sync queue store
            if (!db.objectStoreNames.contains(QUEUE_STORE)) {
                const queueStore = db.createObjectStore(QUEUE_STORE, { keyPath: 'id' })
                queueStore.createIndex('timestamp', 'timestamp', { unique: false })
                queueStore.createIndex('type', 'type', { unique: false })
            }
        }
    })
}

/**
 * Generate encryption key from user ID
 */
async function getEncryptionKey(userId: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(userId + '-ketab-yar-secret'),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    )

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('ketab-yar-salt'),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

/**
 * Encrypt book content
 */
async function encryptContent(content: string, userId: string): Promise<ArrayBuffer> {
    const key = await getEncryptionKey(userId)
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
    )

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(encrypted), iv.length)

    return combined.buffer
}

/**
 * Decrypt book content
 */
async function decryptContent(encryptedData: ArrayBuffer, userId: string): Promise<string> {
    const key = await getEncryptionKey(userId)
    const data = new Uint8Array(encryptedData)
    const iv = data.slice(0, 12)
    const encrypted = data.slice(12)

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
}

/**
 * Download and store book for offline reading
 */
export async function downloadBookForOffline(
    bookId: string,
    language: 'en' | 'fa',
    content: string,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const db = await getDB()
        const encryptedContent = await encryptContent(content, userId)

        const offlineBook: OfflineBook = {
            bookId: `${bookId}-${language}`,
            language,
            encryptedContent,
            downloadedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([BOOKS_STORE], 'readwrite')
            const store = transaction.objectStore(BOOKS_STORE)
            const request = store.put(offlineBook)

            request.onsuccess = () => {
                logger.info('Book downloaded for offline', {
                    context: 'downloadBookForOffline',
                    metadata: { bookId }
                })
                resolve({ success: true })
            }

            request.onerror = () => {
                logger.error('Failed to download book for offline', request.error, { context: 'downloadBookForOffline' })
                reject({ success: false, error: request.error?.message })
            }
        })
    } catch (error) {
        logger.error('Error downloading book for offline', error, { context: 'downloadBookForOffline' })
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Get offline book content
 */
export async function getOfflineBook(
    bookId: string,
    language: 'en' | 'fa',
    userId: string
): Promise<string | null> {
    try {
        const db = await getDB()
        const key = `${bookId}-${language}`

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([BOOKS_STORE], 'readonly')
            const store = transaction.objectStore(BOOKS_STORE)
            const request = store.get(key)

            request.onsuccess = async () => {
                const offlineBook = request.result as OfflineBook | undefined

                if (!offlineBook) {
                    resolve(null)
                    return
                }

                // Update last accessed time
                offlineBook.lastAccessedAt = new Date().toISOString()
                const updateTransaction = db.transaction([BOOKS_STORE], 'readwrite')
                updateTransaction.objectStore(BOOKS_STORE).put(offlineBook)

                // Decrypt and return content
                const content = await decryptContent(offlineBook.encryptedContent, userId)
                resolve(content)
            }

            request.onerror = () => {
                logger.error('Failed to get offline book', request.error, { context: 'getOfflineBook' })
                reject(null)
            }
        })
    } catch (error) {
        logger.error('Error getting offline book', error, { context: 'getOfflineBook' })
        return null
    }
}

/**
 * Delete offline book
 */
export async function deleteOfflineBook(bookId: string, language: 'en' | 'fa'): Promise<boolean> {
    try {
        const db = await getDB()
        const key = `${bookId}-${language}`

        return new Promise((resolve) => {
            const transaction = db.transaction([BOOKS_STORE], 'readwrite')
            const store = transaction.objectStore(BOOKS_STORE)
            const request = store.delete(key)

            request.onsuccess = () => {
                logger.info('Offline book deleted', {
                    context: 'deleteOfflineBook',
                    metadata: { bookId }
                })
                resolve(true)
            }

            request.onerror = () => {
                logger.error('Failed to delete offline book', request.error, { context: 'deleteOfflineBook' })
                resolve(false)
            }
        })
    } catch (error) {
        logger.error('Error deleting offline book', error, { context: 'deleteOfflineBook' })
        return false
    }
}

/**
 * Add item to sync queue (for offline actions)
 */
export async function addToSyncQueue(
    type: 'xp' | 'progress' | 'vocabulary',
    data: Record<string, unknown>
): Promise<void> {
    try {
        const db = await getDB()
        const item: SyncQueueItem = {
            id: `${type}-${Date.now()}-${Math.random()}`,
            type,
            data,
            timestamp: new Date().toISOString(),
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([QUEUE_STORE], 'readwrite')
            const store = transaction.objectStore(QUEUE_STORE)
            const request = store.add(item)

            request.onsuccess = () => {
                logger.info('Added to sync queue', {
                    context: 'addToSyncQueue',
                    metadata: { type }
                })
                resolve()
            }

            request.onerror = () => {
                logger.error('Failed to add to sync queue', request.error, { context: 'addToSyncQueue' })
                reject(request.error)
            }
        })
    } catch (error) {
        logger.error('Error adding to sync queue', error, { context: 'addToSyncQueue' })
    }
}

/**
 * Get all items from sync queue
 */
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
        const db = await getDB()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([QUEUE_STORE], 'readonly')
            const store = transaction.objectStore(QUEUE_STORE)
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result || [])
            request.onerror = () => {
                logger.error('Failed to get sync queue', request.error, { context: 'getSyncQueue' })
                reject([])
            }
        })
    } catch (error) {
        logger.error('Error getting sync queue', error, { context: 'getSyncQueue' })
        return []
    }
}

/**
 * Clear sync queue after successful sync
 */
export async function clearSyncQueue(): Promise<void> {
    try {
        const db = await getDB()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([QUEUE_STORE], 'readwrite')
            const store = transaction.objectStore(QUEUE_STORE)
            const request = store.clear()

            request.onsuccess = () => {
                logger.info('Sync queue cleared', { context: 'clearSyncQueue' })
                resolve()
            }

            request.onerror = () => {
                logger.error('Failed to clear sync queue', request.error, { context: 'clearSyncQueue' })
                reject(request.error)
            }
        })
    } catch (error) {
        logger.error('Error clearing sync queue', error, { context: 'clearSyncQueue' })
    }
}

/**
 * Get list of all offline books
 */
export async function getOfflineBooksList(): Promise<Array<{ bookId: string; language: string; downloadedAt: string }>> {
    try {
        const db = await getDB()

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([BOOKS_STORE], 'readonly')
            const store = transaction.objectStore(BOOKS_STORE)
            const request = store.getAll()

            request.onsuccess = () => {
                const books = (request.result || []).map((book: OfflineBook) => ({
                    bookId: book.bookId,
                    language: book.language,
                    downloadedAt: book.downloadedAt,
                }))
                resolve(books)
            }

            request.onerror = () => {
                logger.error('Failed to get offline books list', request.error, { context: 'getOfflineBooksList' })
                reject([])
            }
        })
    } catch (error) {
        logger.error('Error getting offline books list', error, { context: 'getOfflineBooksList' })
        return []
    }
}
