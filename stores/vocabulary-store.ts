import { createClient } from '@/lib/supabase/client'
import type { VocabularyWord } from '@/types/vocabulary'
import { create } from 'zustand'

export interface VocabularyStats {
    total: number
    learning: number
    reviewing: number
    mastered: number
    weeklyGrowth: number
    reviewsDue: number
}

interface VocabularyStore {
    words: VocabularyWord[]
    stats: VocabularyStats
    isInitialized: boolean
    isLoading: boolean

    fetchWords: (userId?: string) => Promise<void>
    fetchStats: (userId?: string) => Promise<void>
    addWord: (word: Omit<VocabularyWord, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
    updateWord: (id: string, updates: Partial<VocabularyWord>) => Promise<void>
    deleteWord: (id: string) => Promise<void>
    reset: () => void
}

const initialStats: VocabularyStats = {
    total: 0,
    learning: 0,
    reviewing: 0,
    mastered: 0,
    weeklyGrowth: 0,
    reviewsDue: 0
}

export const useVocabularyStore = create<VocabularyStore>((set, get) => ({
    words: [],
    stats: initialStats,
    isInitialized: false,
    isLoading: false,

    fetchWords: async (userId?: string) => {
        const supabase = createClient()
        if (!supabase) {
            console.error('Supabase client not initialized')
            return
        }

        set({ isLoading: true })

        try {
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('User not authenticated')
                userId = user.id
            }

            const { data, error } = await supabase
                .from('user_words')
                .select(`
          *,
          books (
            id,
            title
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error

            set({
                words: data || [],
                isInitialized: true,
                isLoading: false
            })
        } catch (error) {
            console.error('Error fetching words:', error)
            set({ isLoading: false })
        }
    },

    fetchStats: async (userId?: string) => {
        const supabase = createClient()
        if (!supabase) {
            console.error('Supabase client not initialized')
            return
        }

        try {
            if (!userId) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('User not authenticated')
                userId = user.id
            }

            const { data: words } = await supabase
                .from('user_words')
                .select('status, created_at, next_review_at')
                .eq('user_id', userId)

            if (!words) {
                set({ stats: initialStats })
                return
            }

            const now = new Date()
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

            type WordItem = { status: string; created_at: string; next_review_at: string }

            const stats: VocabularyStats = {
                total: words.length,
                learning: words.filter((w: WordItem) => w.status === 'learning').length,
                reviewing: words.filter((w: WordItem) => w.status === 'reviewing').length,
                mastered: words.filter((w: WordItem) => w.status === 'mastered').length,
                weeklyGrowth: words.filter((w: WordItem) => new Date(w.created_at) >= weekAgo).length,
                reviewsDue: words.filter((w: WordItem) =>
                    (w.status === 'learning' || w.status === 'reviewing') &&
                    new Date(w.next_review_at) <= now
                ).length
            }

            set({ stats })
        } catch (error) {
            console.error('Error fetching stats:', error)
        }
    },

    addWord: async (word) => {
        const supabase = createClient()
        if (!supabase) {
            console.error('Supabase client not initialized')
            throw new Error('Supabase client not initialized')
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not authenticated')

            // Optimistic update (Agent 3 psychology - immediate feedback)
            const optimisticWord = {
                id: `temp-${Date.now()}`,
                user_id: user.id,
                ...word,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }

            set(state => ({
                words: [optimisticWord as VocabularyWord, ...state.words]
            }))

            // Actual database insert
            const { data, error } = await supabase
                .from('user_words')
                .insert({
                    ...word,
                    user_id: user.id
                } as any)
                .select()
                .single()

            if (error) throw error

            // Replace optimistic with real data
            set(state => ({
                words: state.words.map(w =>
                    w.id === optimisticWord.id ? data : w
                )
            }))

            // Refresh stats
            get().fetchStats(user.id)
        } catch (error) {
            console.error('Error adding word:', error)

            // Rollback optimistic update on error
            set(state => ({
                words: state.words.filter(w => !w.id.startsWith('temp-'))
            }))

            throw error
        }
    },

    updateWord: async (id, updates) => {
        const supabase = createClient()
        if (!supabase) {
            console.error('Supabase client not initialized')
            throw new Error('Supabase client not initialized')
        }

        try {
            const { error } = await supabase
                .from('user_words')
                .update(updates as any)
                .eq('id', id)

            if (error) throw error

            set(state => ({
                words: state.words.map(w =>
                    w.id === id ? { ...w, ...updates } : w
                )
            }))

            // Refresh stats
            const { data: { user } } = await supabase.auth.getUser()
            if (user) get().fetchStats(user.id)
        } catch (error) {
            console.error('Error updating word:', error)
            throw error
        }
    },

    deleteWord: async (id) => {
        const supabase = createClient()
        if (!supabase) {
            console.error('Supabase client not initialized')
            throw new Error('Supabase client not initialized')
        }

        try {
            const { error } = await supabase
                .from('user_words')
                .delete()
                .eq('id', id)

            if (error) throw error

            set(state => ({
                words: state.words.filter(w => w.id !== id)
            }))

            // Refresh stats
            const { data: { user } } = await supabase.auth.getUser()
            if (user) get().fetchStats(user.id)
        } catch (error) {
            console.error('Error deleting word:', error)
            throw error
        }
    },

    reset: () => {
        set({
            words: [],
            stats: initialStats,
            isInitialized: false,
            isLoading: false
        })
    }
}))
