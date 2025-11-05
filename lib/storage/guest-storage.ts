/**
 * ✅ AGENT 2 (PERFORMANCE): localStorage-based storage for guest users
 * ✅ AGENT 3 (PSYCHOLOGY): Smart limits to encourage signup
 * 
 * Guest Mode Storage Service
 * Manages all guest user data in localStorage without any server connection
 */

export interface GuestVocabulary {
    word: string
    definition: string
    bookId: string
    bookTitle: string
    context: string
    addedAt: string
}

export interface GuestProgress {
    bookId: string
    bookTitle: string
    currentPage: number
    totalPages: number
    progressPercentage: number
    lastReadAt: string
}

export interface GuestSettings {
    fontSize: number
    lineHeight: number
    theme: 'light' | 'sepia' | 'dark'
    language: 'en' | 'fa'
}

export interface GuestBookmark {
    bookId: string
    page: number
    addedAt: string
}

export interface GuestHighlight {
    bookId: string
    page: number
    text: string
    color: string
    addedAt: string
}

const STORAGE_KEYS = {
    VOCABULARY: 'ketab_yar_guest_vocabulary',
    PROGRESS: 'ketab_yar_guest_progress',
    SETTINGS: 'ketab_yar_guest_settings',
    BOOKMARKS: 'ketab_yar_guest_bookmarks',
    HIGHLIGHTS: 'ketab_yar_guest_highlights',
    IS_GUEST: 'ketab_yar_is_guest',
}

// ✅ AGENT 3: Limits to encourage signup
export const GUEST_LIMITS = {
    MAX_VOCABULARY: 20,
    MAX_BOOKS_READ: 3,
    MAX_BOOKMARKS: 10,
    MAX_HIGHLIGHTS: 20,
}

class GuestStorageService {
    private isClient = typeof window !== 'undefined'

    // Check if user is in guest mode
    isGuestMode(): boolean {
        if (!this.isClient) return false
        return localStorage.getItem(STORAGE_KEYS.IS_GUEST) === 'true'
    }

    // Enable guest mode
    enableGuestMode(): void {
        if (!this.isClient) return
        localStorage.setItem(STORAGE_KEYS.IS_GUEST, 'true')
    }

    // Disable guest mode (when user signs up)
    disableGuestMode(): void {
        if (!this.isClient) return
        localStorage.removeItem(STORAGE_KEYS.IS_GUEST)
    }

    // ==================== VOCABULARY ====================

    getVocabulary(): GuestVocabulary[] {
        if (!this.isClient) return []
        const data = localStorage.getItem(STORAGE_KEYS.VOCABULARY)
        return data ? JSON.parse(data) : []
    }

    addVocabulary(vocab: Omit<GuestVocabulary, 'addedAt'>): { success: boolean; error?: string } {
        if (!this.isClient) return { success: false, error: 'Not in browser' }

        const vocabulary = this.getVocabulary()

        // ✅ AGENT 3: Check limit
        if (vocabulary.length >= GUEST_LIMITS.MAX_VOCABULARY) {
            return {
                success: false,
                error: `حداکثر ${GUEST_LIMITS.MAX_VOCABULARY} کلمه برای کاربران مهمان. برای ذخیره بیشتر، ثبت‌نام کنید.`,
            }
        }

        // Check if word already exists
        if (vocabulary.some(v => v.word === vocab.word && v.bookId === vocab.bookId)) {
            return { success: false, error: 'این کلمه قبلاً ذخیره شده' }
        }

        const newVocab: GuestVocabulary = {
            ...vocab,
            addedAt: new Date().toISOString(),
        }

        vocabulary.push(newVocab)
        localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(vocabulary))

        return { success: true }
    }

    removeVocabulary(word: string, bookId: string): void {
        if (!this.isClient) return
        const vocabulary = this.getVocabulary().filter(
            v => !(v.word === word && v.bookId === bookId)
        )
        localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(vocabulary))
    }

    clearVocabulary(): void {
        if (!this.isClient) return
        localStorage.removeItem(STORAGE_KEYS.VOCABULARY)
    }

    // ==================== PROGRESS ====================

    getProgress(bookId: string): GuestProgress | null {
        if (!this.isClient) return null
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
        const allProgress: GuestProgress[] = data ? JSON.parse(data) : []
        return allProgress.find(p => p.bookId === bookId) || null
    }

    getAllProgress(): GuestProgress[] {
        if (!this.isClient) return []
        const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
        return data ? JSON.parse(data) : []
    }

    saveProgress(progress: Omit<GuestProgress, 'lastReadAt'>): void {
        if (!this.isClient) return

        const allProgress = this.getAllProgress()
        const existingIndex = allProgress.findIndex(p => p.bookId === progress.bookId)

        const newProgress: GuestProgress = {
            ...progress,
            lastReadAt: new Date().toISOString(),
        }

        if (existingIndex >= 0) {
            allProgress[existingIndex] = newProgress
        } else {
            // ✅ AGENT 3: Check limit
            if (allProgress.length >= GUEST_LIMITS.MAX_BOOKS_READ) {
                // Remove oldest book
                allProgress.sort((a, b) => new Date(a.lastReadAt).getTime() - new Date(b.lastReadAt).getTime())
                allProgress.shift()
            }
            allProgress.push(newProgress)
        }

        localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress))
    }

    clearProgress(): void {
        if (!this.isClient) return
        localStorage.removeItem(STORAGE_KEYS.PROGRESS)
    }

    // ==================== SETTINGS ====================

    getSettings(): GuestSettings {
        if (!this.isClient) {
            return {
                fontSize: 20,
                lineHeight: 1.8,
                theme: 'sepia',
                language: 'en',
            }
        }

        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
        return data
            ? JSON.parse(data)
            : {
                fontSize: 20,
                lineHeight: 1.8,
                theme: 'sepia',
                language: 'en',
            }
    }

    saveSettings(settings: Partial<GuestSettings>): void {
        if (!this.isClient) return
        const current = this.getSettings()
        const updated = { ...current, ...settings }
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated))
    }

    clearSettings(): void {
        if (!this.isClient) return
        localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    }

    // ==================== BOOKMARKS ====================

    getBookmarks(bookId?: string): GuestBookmark[] {
        if (!this.isClient) return []
        const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
        const allBookmarks: GuestBookmark[] = data ? JSON.parse(data) : []
        return bookId ? allBookmarks.filter(b => b.bookId === bookId) : allBookmarks
    }

    addBookmark(bookId: string, page: number): { success: boolean; error?: string } {
        if (!this.isClient) return { success: false, error: 'Not in browser' }

        const bookmarks = this.getBookmarks()

        // Check if bookmark already exists
        if (bookmarks.some(b => b.bookId === bookId && b.page === page)) {
            return { success: false, error: 'این صفحه قبلاً نشانک‌گذاری شده' }
        }

        // ✅ AGENT 3: Check limit
        if (bookmarks.length >= GUEST_LIMITS.MAX_BOOKMARKS) {
            return {
                success: false,
                error: `حداکثر ${GUEST_LIMITS.MAX_BOOKMARKS} نشانک برای کاربران مهمان`,
            }
        }

        const newBookmark: GuestBookmark = {
            bookId,
            page,
            addedAt: new Date().toISOString(),
        }

        bookmarks.push(newBookmark)
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))

        return { success: true }
    }

    removeBookmark(bookId: string, page: number): void {
        if (!this.isClient) return
        const bookmarks = this.getBookmarks().filter(
            b => !(b.bookId === bookId && b.page === page)
        )
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
    }

    clearBookmarks(): void {
        if (!this.isClient) return
        localStorage.removeItem(STORAGE_KEYS.BOOKMARKS)
    }

    // ==================== HIGHLIGHTS ====================

    getHighlights(bookId?: string): GuestHighlight[] {
        if (!this.isClient) return []
        const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS)
        const allHighlights: GuestHighlight[] = data ? JSON.parse(data) : []
        return bookId ? allHighlights.filter(h => h.bookId === bookId) : allHighlights
    }

    addHighlight(
        bookId: string,
        page: number,
        text: string,
        color: string
    ): { success: boolean; error?: string } {
        if (!this.isClient) return { success: false, error: 'Not in browser' }

        const highlights = this.getHighlights()

        // ✅ AGENT 3: Check limit
        if (highlights.length >= GUEST_LIMITS.MAX_HIGHLIGHTS) {
            return {
                success: false,
                error: `حداکثر ${GUEST_LIMITS.MAX_HIGHLIGHTS} هایلایت برای کاربران مهمان`,
            }
        }

        const newHighlight: GuestHighlight = {
            bookId,
            page,
            text,
            color,
            addedAt: new Date().toISOString(),
        }

        highlights.push(newHighlight)
        localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights))

        return { success: true }
    }

    removeHighlight(bookId: string, page: number, text: string): void {
        if (!this.isClient) return
        const highlights = this.getHighlights().filter(
            h => !(h.bookId === bookId && h.page === page && h.text === text)
        )
        localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights))
    }

    clearHighlights(): void {
        if (!this.isClient) return
        localStorage.removeItem(STORAGE_KEYS.HIGHLIGHTS)
    }

    // ==================== EXPORT ALL DATA ====================

    exportAllData() {
        return {
            vocabulary: this.getVocabulary(),
            progress: this.getAllProgress(),
            settings: this.getSettings(),
            bookmarks: this.getBookmarks(),
            highlights: this.getHighlights(),
        }
    }

    // ==================== CLEAR ALL DATA ====================

    clearAllData(): void {
        this.clearVocabulary()
        this.clearProgress()
        this.clearSettings()
        this.clearBookmarks()
        this.clearHighlights()
        this.disableGuestMode()
    }

    // ==================== STATISTICS ====================

    getStatistics() {
        const vocabulary = this.getVocabulary()
        const progress = this.getAllProgress()
        const bookmarks = this.getBookmarks()
        const highlights = this.getHighlights()

        return {
            vocabularyCount: vocabulary.length,
            vocabularyLimit: GUEST_LIMITS.MAX_VOCABULARY,
            vocabularyPercentage: Math.round((vocabulary.length / GUEST_LIMITS.MAX_VOCABULARY) * 100),

            booksReadCount: progress.length,
            booksReadLimit: GUEST_LIMITS.MAX_BOOKS_READ,

            bookmarksCount: bookmarks.length,
            bookmarksLimit: GUEST_LIMITS.MAX_BOOKMARKS,

            highlightsCount: highlights.length,
            highlightsLimit: GUEST_LIMITS.MAX_HIGHLIGHTS,

            isNearLimit: vocabulary.length >= GUEST_LIMITS.MAX_VOCABULARY * 0.8,
        }
    }
}

// Export singleton instance
export const guestStorage = new GuestStorageService()
