/**
 * Library Store - User's Book Library Management
 * Manages user's reading list, progress, and library state
 * Implements Agent 2's performance strategy (client-side caching)
 */

import { createClient } from '@/lib/supabase/client'
import { create } from 'zustand'

export type BookStatus = 'want_to_read' | 'reading' | 'completed'

export interface LibraryBook {
    id: string
    book_id: string
    user_id: string
    status: BookStatus
    current_page: number
    progress_percentage: number
    started_at: string | null
    completed_at: string | null
    updated_at: string
    books: {
        id: string
        title: string
        slug: string
        cover_image_url: string | null
        total_pages: number | null
        authors: {
            id: string
            name: string
        } | null
    }
}

interface LibraryStats {
    total: number
    reading: number
    completed: number
    wantToRead: number
    totalPagesRead: number
    booksCompletedThisMonth: number
}

interface LibraryState {
    // State
    books: LibraryBook[]
    stats: LibraryStats
    isInitialized: boolean
    isLoading: boolean
    error: string | null

    // Filters
    activeFilter: BookStatus | 'all'
    searchQuery: string
    sortBy: 'recent' | 'title' | 'progress' | 'author'

    // Actions - Data
    fetchLibrary: (userId: string) => Promise<void>
    fetchStats: (userId: string) => Promise<void>
    addBook: (bookId: string, status?: BookStatus) => Promise<void>
    updateBookStatus: (bookId: string, status: BookStatus) => Promise<void>
    updateProgress: (bookId: string, currentPage: number, totalPages: number) => Promise<void>
    removeBook: (bookId: string) => Promise<void>

    // Actions - Filters
    setFilter: (filter: BookStatus | 'all') => void
    setSearchQuery: (query: string) => void
    setSortBy: (sortBy: 'recent' | 'title' | 'progress' | 'author') => void

    // Actions - Helpers
    getBook: (bookId: string) => LibraryBook | undefined
    isInLibrary: (bookId: string) => boolean
    getFilteredBooks: () => LibraryBook[]

    // Actions - Reset
    reset: () => void
}

const initialStats: LibraryStats = {
    total: 0,
    reading: 0,
    completed: 0,
    wantToRead: 0,
    totalPagesRead: 0,
    booksCompletedThisMonth: 0,
}

const initialState = {
    books: [],
    stats: initialStats,
    isInitialized: false,
    isLoading: false,
    error: null,
    activeFilter: 'all' as const,
    searchQuery: '',
    sortBy: 'recent' as const,
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    ...initialState,

    // Data Actions
    fetchLibrary: async (userId) => {
        set({ isLoading: true, error: null })

        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('user_library')
                .select(`
          *,
          books (
            id,
            title,
            slug,
            cover_image_url,
            total_pages,
            authors (
              id,
              name
            )
          )
        `)
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })

            if (error) throw error

            set({
                books: (data as LibraryBook[]) || [],
                isInitialized: true,
                isLoading: false,
            })

            // Fetch stats after loading books
            get().fetchStats(userId)
        } catch (error) {
            console.error('Error fetching library:', error)
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch library',
                isLoading: false,
            })
        }
    },

    fetchStats: async (userId) => {
        try {
            const supabase = createClient()

            const { data: books } = await supabase
                .from('user_library')
                .select('status, current_page, completed_at')
                .eq('user_id', userId)

            if (!books) {
                set({ stats: initialStats })
                return
            }

            const now = new Date()
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

            const stats: LibraryStats = {
                total: books.length,
                reading: books.filter((b: LibraryBook) => b.status === 'reading').length,
                completed: books.filter((b: LibraryBook) => b.status === 'completed').length,
                wantToRead: books.filter((b: LibraryBook) => b.status === 'want_to_read').length,
                totalPagesRead: books.reduce((sum: number, b: LibraryBook) => sum + (b.current_page || 0), 0),
                booksCompletedThisMonth: books.filter((b: LibraryBook) =>
                    b.status === 'completed' &&
                    b.completed_at &&
                    new Date(b.completed_at) >= monthStart
                ).length,
            }

            set({ stats })
        } catch (error) {
            console.error('Error fetching library stats:', error)
        }
    },

    addBook: async (bookId, status = 'want_to_read') => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('User not authenticated')

            // Check if already in library
            if (get().isInLibrary(bookId)) {
                throw new Error('Book already in library')
            }

            const { data, error } = await supabase
                .from('user_library')
                .insert({
                    user_id: user.id,
                    book_id: bookId,
                    status,
                    current_page: 0,
                    progress_percentage: 0,
                })
                .select(`
          *,
          books (
            id,
            title,
            slug,
            cover_image_url,
            total_pages,
            authors (
              id,
              name
            )
          )
        `)
                .single()

            if (error) throw error

            set((state) => ({
                books: [data as LibraryBook, ...state.books],
            }))

            // Refresh stats
            get().fetchStats(user.id)
        } catch (error) {
            console.error('Error adding book to library:', error)
            throw error
        }
    },

    updateBookStatus: async (bookId, status) => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('User not authenticated')

            const updates: Record<string, unknown> = { status }

            if (status === 'reading' && !get().getBook(bookId)?.started_at) {
                updates.started_at = new Date().toISOString()
            }

            if (status === 'completed') {
                updates.completed_at = new Date().toISOString()
                updates.progress_percentage = 100
            }

            const { error } = await supabase
                .from('user_library')
                .update(updates)
                .eq('user_id', user.id)
                .eq('book_id', bookId)

            if (error) throw error

            set((state) => ({
                books: state.books.map(b =>
                    b.book_id === bookId ? { ...b, ...updates } : b
                ),
            }))

            // Refresh stats
            get().fetchStats(user.id)
        } catch (error) {
            console.error('Error updating book status:', error)
            throw error
        }
    },

    updateProgress: async (bookId, currentPage, totalPages) => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('User not authenticated')

            const progressPercentage = totalPages > 0
                ? Math.round((currentPage / totalPages) * 100)
                : 0

            const updates: Record<string, unknown> = {
                current_page: currentPage,
                progress_percentage: progressPercentage,
            }

            // Auto-complete if reached end
            if (progressPercentage >= 100) {
                updates.status = 'completed'
                updates.completed_at = new Date().toISOString()
            }

            const { error } = await supabase
                .from('user_library')
                .update(updates)
                .eq('user_id', user.id)
                .eq('book_id', bookId)

            if (error) throw error

            // Optimistic update
            set((state) => ({
                books: state.books.map(b =>
                    b.book_id === bookId ? { ...b, ...updates } : b
                ),
            }))

            // Refresh stats if completed
            if (updates.status === 'completed') {
                get().fetchStats(user.id)
            }
        } catch (error) {
            console.error('Error updating progress:', error)
            throw error
        }
    },

    removeBook: async (bookId) => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) throw new Error('User not authenticated')

            const { error } = await supabase
                .from('user_library')
                .delete()
                .eq('user_id', user.id)
                .eq('book_id', bookId)

            if (error) throw error

            set((state) => ({
                books: state.books.filter(b => b.book_id !== bookId),
            }))

            // Refresh stats
            get().fetchStats(user.id)
        } catch (error) {
            console.error('Error removing book from library:', error)
            throw error
        }
    },

    // Filter Actions
    setFilter: (filter) => {
        set({ activeFilter: filter })
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query })
    },

    setSortBy: (sortBy) => {
        set({ sortBy })
    },

    // Helper Actions
    getBook: (bookId) => {
        return get().books.find(b => b.book_id === bookId)
    },

    isInLibrary: (bookId) => {
        return get().books.some(b => b.book_id === bookId)
    },

    getFilteredBooks: () => {
        const { books, activeFilter, searchQuery, sortBy } = get()

        let filtered = books

        // Apply status filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(b => b.status === activeFilter)
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(b =>
                b.books.title.toLowerCase().includes(query) ||
                b.books.authors?.name.toLowerCase().includes(query)
            )
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.books.title.localeCompare(b.books.title)
                case 'progress':
                    return b.progress_percentage - a.progress_percentage
                case 'author':
                    return (a.books.authors?.name || '').localeCompare(b.books.authors?.name || '')
                case 'recent':
                default:
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            }
        })

        return filtered
    },

    // Reset
    reset: () => {
        set(initialState)
    },
}))
