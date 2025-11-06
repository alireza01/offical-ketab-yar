import { DBSchema, IDBPDatabase, openDB } from 'idb'

// Database schema
interface KetabYarDB extends DBSchema {
    books: {
        key: string // book slug
        value: {
            slug: string
            title: { en: string; fa: string }
            author: { name: string; slug: string }
            coverImage: string
            totalChapters: number
            downloadedAt: string
        }
    }
    chapters: {
        key: string // `${bookSlug}-${chapterNumber}`
        value: {
            bookSlug: string
            chapterNumber: number
            title: { en: string; fa: string }
            content: any[]
            downloadedAt: string
        }
        indexes: { bookSlug: string }
    }
}

const DB_NAME = 'ketab-yar-offline'
const DB_VERSION = 1

// Initialize database
async function getDB(): Promise<IDBPDatabase<KetabYarDB>> {
    return openDB<KetabYarDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create books store
            if (!db.objectStoreNames.contains('books')) {
                db.createObjectStore('books', { keyPath: 'slug' })
            }

            // Create chapters store with index
            if (!db.objectStoreNames.contains('chapters')) {
                const chapterStore = db.createObjectStore('chapters', {
                    keyPath: ['bookSlug', 'chapterNumber'],
                })
                chapterStore.createIndex('bookSlug', 'bookSlug')
            }
        },
    })
}

// Book operations
export async function saveBookMetadata(book: {
    slug: string
    title: { en: string; fa: string }
    author: { name: string; slug: string }
    coverImage: string
    totalChapters: number
}) {
    const db = await getDB()
    await db.put('books', {
        ...book,
        downloadedAt: new Date().toISOString(),
    })
}

export async function getBookMetadata(slug: string) {
    const db = await getDB()
    return db.get('books', slug)
}

export async function getAllDownloadedBooks() {
    const db = await getDB()
    return db.getAll('books')
}

export async function deleteBook(slug: string) {
    const db = await getDB()

    // Delete book metadata
    await db.delete('books', slug)

    // Delete all chapters for this book
    const chapters = await db.getAllFromIndex('chapters', 'bookSlug', slug)
    const tx = db.transaction('chapters', 'readwrite')

    for (const chapter of chapters) {
        await tx.store.delete([chapter.bookSlug, chapter.chapterNumber])
    }

    await tx.done
}

// Chapter operations
export async function saveChapter(chapter: {
    bookSlug: string
    chapterNumber: number
    title: { en: string; fa: string }
    content: any[]
}) {
    const db = await getDB()
    await db.put('chapters', {
        ...chapter,
        downloadedAt: new Date().toISOString(),
    })
}

export async function getChapter(bookSlug: string, chapterNumber: number) {
    const db = await getDB()
    return db.get('chapters', [bookSlug, chapterNumber])
}

export async function getAllChaptersForBook(bookSlug: string) {
    const db = await getDB()
    return db.getAllFromIndex('chapters', 'bookSlug', bookSlug)
}

export async function isBookFullyDownloaded(bookSlug: string, totalChapters: number) {
    const chapters = await getAllChaptersForBook(bookSlug)
    return chapters.length === totalChapters
}

// Storage info
export async function getStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        return {
            usage: estimate.usage || 0,
            quota: estimate.quota || 0,
            percentUsed: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
        }
    }
    return null
}

// Clear all offline data
export async function clearAllOfflineData() {
    const db = await getDB()
    await db.clear('books')
    await db.clear('chapters')
}


// Legacy function names for compatibility
export async function isBookOffline(bookSlug: string) {
    const book = await getBookMetadata(bookSlug)
    return !!book
}

export async function deleteBookOffline(bookSlug: string) {
    return deleteBook(bookSlug)
}

export async function saveBookOffline(
    bookSlug: string,
    content: { en: string; fa: string },
    metadata: { title: string; author: string; coverUrl: string },
    userId: string
) {
    // This is a simplified version - in reality you'd parse the content into chapters
    // For now, we'll just save the metadata
    await saveBookMetadata({
        slug: bookSlug,
        title: { en: metadata.title, fa: metadata.title },
        author: { name: metadata.author, slug: '' },
        coverImage: metadata.coverUrl,
        totalChapters: 1,
    })
}
