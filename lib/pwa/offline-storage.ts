/**
 * Secure Offline Storage with IndexedDB + Encryption
 * Agent 2 (Performance) - Zero server load, secure content storage
 */

const DB_NAME = 'ketab-yar-offline'
const DB_VERSION = 1
const BOOKS_STORE = 'books'
const QUEUE_STORE = 'sync-queue'

// Initialize IndexedDB
export async function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result

            // Books store for offline content
            if (!db.objectStoreNames.contains(BOOKS_STORE)) {
                const bookStore = db.createObjectStore(BOOKS_STORE, { keyPath: 'id' })
                bookStore.createIndex('bookId', 'bookId', { unique: true })
                bookStore.createIndex('downloadedAt', 'downloadedAt', { unique: false })
            }

            // Sync queue for offline XP/streak tracking
            if (!db.objectStoreNames.contains(QUEUE_STORE)) {
                const queueStore = db.createObjectStore(QUEUE_STORE, {
                    keyPath: 'id',
                    autoIncrement: true,
                })
                queueStore.createIndex('timestamp', 'timestamp', { unique: false })
                queueStore.createIndex('type', 'type', { unique: false })
            }
        }
    })
}

// Encrypt content using SubtleCrypto API
async function encryptContent(content: string, key: CryptoKey): Promise<ArrayBuffer> {
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

// Decrypt content
async function decryptContent(
    encryptedData: ArrayBuffer,
    key: CryptoKey
): Promise<string> {
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

// Generate encryption key from user ID
async function getEncryptionKey(userId: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(userId.padEnd(32, '0')),
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

// Save book for offline reading
export async function saveBookOffline(
    bookId: string,
    content: { en: string; fa: string },
    metadata: {
        title: string
        author: string
        coverUrl: string
    },
    userId: string
): Promise<void> {
    const db = await initDB()
    const key = await getEncryptionKey(userId)

    // Encrypt both language versions
    const encryptedEn = await encryptContent(content.en, key)
    const encryptedFa = await encryptContent(content.fa, key)

    const bookData = {
        id: bookId,
        bookId,
        encryptedEn,
        encryptedFa,
        metadata,
        downloadedAt: Date.now(),
        userId,
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKS_STORE], 'readwrite')
        const store = transaction.objectStore(BOOKS_STORE)
        const request = store.put(bookData)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

// Load book from offline storage
export async function loadBookOffline(
    bookId: string,
    language: 'en' | 'fa',
    userId: string
): Promise<string | null> {
    const db = await initDB()
    const key = await getEncryptionKey(userId)

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKS_STORE], 'readonly')
        const store = transaction.objectStore(BOOKS_STORE)
        const index = store.index('bookId')
        const request = index.get(bookId)

        request.onsuccess = async () => {
            const result = request.result
            if (!result) {
                resolve(null)
                return
            }

            try {
                const encryptedData =
                    language === 'en' ? result.encryptedEn : result.encryptedFa
                const decrypted = await decryptContent(encryptedData, key)
                resolve(decrypted)
            } catch (error) {
                reject(error)
            }
        }

        request.onerror = () => reject(request.error)
    })
}

// Check if book is available offline
export async function isBookOffline(bookId: string): Promise<boolean> {
    const db = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKS_STORE], 'readonly')
        const store = transaction.objectStore(BOOKS_STORE)
        const index = store.index('bookId')
        const request = index.get(bookId)

        request.onsuccess = () => resolve(!!request.result)
        request.onerror = () => reject(request.error)
    })
}

// Get all offline books
export async function getOfflineBooks(): Promise<
    Array<{
        bookId: string
        metadata: { title: string; author: string; coverUrl: string }
        downloadedAt: number
    }>
> {
    const db = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKS_STORE], 'readonly')
        const store = transaction.objectStore(BOOKS_STORE)
        const request = store.getAll()

        request.onsuccess = () => {
            const books = request.result.map((book) => ({
                bookId: book.bookId,
                metadata: book.metadata,
                downloadedAt: book.downloadedAt,
            }))
            resolve(books)
        }

        request.onerror = () => reject(request.error)
    })
}

// Delete offline book
export async function deleteBookOffline(bookId: string): Promise<void> {
    const db = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([BOOKS_STORE], 'readwrite')
        const store = transaction.objectStore(BOOKS_STORE)
        const index = store.index('bookId')
        const request = index.getKey(bookId)

        request.onsuccess = () => {
            if (request.result) {
                const deleteRequest = store.delete(request.result)
                deleteRequest.onsuccess = () => resolve()
                deleteRequest.onerror = () => reject(deleteRequest.error)
            } else {
                resolve()
            }
        }

        request.onerror = () => reject(request.error)
    })
}

// Add item to sync queue (for offline XP/streak tracking)
export async function addToSyncQueue(
    type: 'xp' | 'streak' | 'reading_session' | 'vocabulary',
    data: any
): Promise<void> {
    const db = await initDB()

    const queueItem = {
        type,
        data,
        timestamp: Date.now(),
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([QUEUE_STORE], 'readwrite')
        const store = transaction.objectStore(QUEUE_STORE)
        const request = store.add(queueItem)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

// Get all items from sync queue
export async function getSyncQueue(): Promise<
    Array<{ id: number; type: string; data: any; timestamp: number }>
> {
    const db = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([QUEUE_STORE], 'readonly')
        const store = transaction.objectStore(QUEUE_STORE)
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

// Clear sync queue after successful sync
export async function clearSyncQueue(): Promise<void> {
    const db = await initDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([QUEUE_STORE], 'readwrite')
        const store = transaction.objectStore(QUEUE_STORE)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
    })
}

// Get storage usage
export async function getStorageUsage(): Promise<{
    usage: number
    quota: number
    percentage: number
}> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        const usage = estimate.usage || 0
        const quota = estimate.quota || 0
        const percentage = quota > 0 ? (usage / quota) * 100 : 0

        return { usage, quota, percentage }
    }

    return { usage: 0, quota: 0, percentage: 0 }
}
