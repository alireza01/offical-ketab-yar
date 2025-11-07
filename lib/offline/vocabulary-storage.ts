/**
 * Offline Vocabulary Storage
 * Manages vocabulary words in IndexedDB for offline access
 */

interface OfflineVocabularyWord {
    id: string
    word: string
    definition?: string
    translation?: string
    context?: string
    book_id?: string
    book_title?: string
    mastery_level: number
    created_at: number
    updated_at: number
}

const DB_NAME = 'ketab_yar_offline'
const STORE_NAME = 'vocabulary'
const DB_VERSION = 1

class OfflineVocabularyStorage {
    private db: IDBDatabase | null = null

    /**
     * Initialize IndexedDB
     */
    private async initDB(): Promise<IDBDatabase> {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                this.db = request.result
                resolve(request.result)
            }

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result

                // Create vocabulary store if it doesn't exist
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                    store.createIndex('book_id', 'book_id', { unique: false })
                    store.createIndex('word', 'word', { unique: false })
                    store.createIndex('mastery_level', 'mastery_level', { unique: false })
                }
            }
        })
    }

    /**
     * Add or update a vocabulary word
     */
    async add(word: Omit<OfflineVocabularyWord, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
        try {
            const db = await this.initDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)

            const id = `${word.word}_${word.book_id || 'unknown'}_${Date.now()}`
            const vocabWord: OfflineVocabularyWord = {
                ...word,
                id,
                created_at: Date.now(),
                updated_at: Date.now()
            }

            store.put(vocabWord)

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve()
                transaction.onerror = () => reject(transaction.error)
            })
        } catch (error) {
            console.error('Error adding word to offline storage:', error)
            throw error
        }
    }

    /**
     * Get all vocabulary words
     */
    async getAll(): Promise<OfflineVocabularyWord[]> {
        try {
            const db = await this.initDB()
            const transaction = db.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.getAll()

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result || [])
                request.onerror = () => reject(request.error)
            })
        } catch (error) {
            console.error('Error getting words from offline storage:', error)
            return [] // Return empty array on error
        }
    }

    /**
     * Get words by book ID
     */
    async getByBook(bookId: string): Promise<OfflineVocabularyWord[]> {
        try {
            const db = await this.initDB()
            const transaction = db.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const index = store.index('book_id')
            const request = index.getAll(bookId)

            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result || [])
                request.onerror = () => reject(request.error)
            })
        } catch (error) {
            console.error('Error getting words by book:', error)
            return []
        }
    }

    /**
     * Update mastery level
     */
    async updateMasteryLevel(id: string, masteryLevel: number): Promise<void> {
        try {
            const db = await this.initDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.get(id)

            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    const word = request.result
                    if (word) {
                        word.mastery_level = masteryLevel
                        word.updated_at = Date.now()
                        store.put(word)
                    }
                }
                transaction.oncomplete = () => resolve()
                transaction.onerror = () => reject(transaction.error)
            })
        } catch (error) {
            console.error('Error updating mastery level:', error)
            throw error
        }
    }

    /**
     * Delete a word
     */
    async delete(id: string): Promise<void> {
        try {
            const db = await this.initDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            store.delete(id)

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve()
                transaction.onerror = () => reject(transaction.error)
            })
        } catch (error) {
            console.error('Error deleting word:', error)
            throw error
        }
    }

    /**
     * Clear all vocabulary words
     */
    async clear(): Promise<void> {
        try {
            const db = await this.initDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            store.clear()

            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve()
                transaction.onerror = () => reject(transaction.error)
            })
        } catch (error) {
            console.error('Error clearing vocabulary:', error)
            throw error
        }
    }

    /**
     * Sync offline words to Supabase (when online)
     */
    async syncToSupabase(userId: string, supabase: any): Promise<void> {
        try {
            const words = await this.getAll()
            if (words.length === 0) return

            // Upload to Supabase
            const { error } = await supabase
                .from('vocabulary')
                .upsert(
                    words.map(word => ({
                        user_id: userId,
                        word: word.word,
                        definition: word.definition,
                        translation: word.translation,
                        context: word.context,
                        book_id: word.book_id,
                        mastery_level: word.mastery_level
                    }))
                )

            if (error) throw error

            console.log(`✅ Synced ${words.length} words to Supabase`)
        } catch (error) {
            console.error('Error syncing to Supabase:', error)
            throw error
        }
    }
}

// Export singleton instance
export const offlineVocabulary = new OfflineVocabularyStorage()
