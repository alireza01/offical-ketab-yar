'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

/**
 * Complete Reader Persistence System
 * 
 * Persists EVERYTHING:
 * - Current page position
 * - Reading progress
 * - Highlights
 * - Theme (light/sepia/dark)
 * - Font settings (size, line height, letter spacing)
 * - All user preferences
 * 
 * Strategy:
 * 1. Save to localStorage IMMEDIATELY (instant persistence)
 * 2. Debounced sync to Supabase (if signed in)
 * 3. Works perfectly offline (PWA)
 * 4. Auto-sync when coming back online
 */

interface ReaderState {
    currentPage: number
    fontSize: number
    lineHeight: number
    letterSpacing: number
    theme: 'light' | 'sepia' | 'dark'
    lastReadAt: number
    totalTimeSpent: number
}

interface Highlight {
    page: number
    text: string
    color: string
    id: string
    timestamp: number
}

export function useReaderPersistence(bookSlug: string, userId?: string | null) {
    const supabase = createClient()
    const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced')

    // Save state to localStorage IMMEDIATELY
    const saveStateLocal = (state: Partial<ReaderState>) => {
        try {
            const key = `reader_state_${bookSlug}`
            const existing = localStorage.getItem(key)
            const current = existing ? JSON.parse(existing) : {}
            const updated = { ...current, ...state, lastReadAt: Date.now() }
            localStorage.setItem(key, JSON.stringify(updated))
        } catch (error) {
            console.error('Error saving reader state:', error)
        }
    }

    // Load state from localStorage
    const loadStateLocal = (): ReaderState | null => {
        try {
            const key = `reader_state_${bookSlug}`
            const stored = localStorage.getItem(key)
            return stored ? JSON.parse(stored) : null
        } catch (error) {
            console.error('Error loading reader state:', error)
            return null
        }
    }

    // Save highlights to localStorage IMMEDIATELY
    const saveHighlightsLocal = (highlights: Highlight[]) => {
        try {
            const key = `highlights_${bookSlug}`
            localStorage.setItem(key, JSON.stringify(highlights))
        } catch (error) {
            console.error('Error saving highlights:', error)
        }
    }

    // Load highlights from localStorage
    const loadHighlightsLocal = (): Highlight[] => {
        try {
            const key = `highlights_${bookSlug}`
            const stored = localStorage.getItem(key)
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error('Error loading highlights:', error)
            return []
        }
    }

    // Sync to Supabase (debounced)
    let syncTimeout: NodeJS.Timeout
    const syncToSupabase = async (state: ReaderState, highlights: Highlight[]) => {
        if (!userId) return

        clearTimeout(syncTimeout)
        syncTimeout = setTimeout(async () => {
            try {
                setSyncStatus('syncing')

                // Sync reading progress
                await supabase.from('reading_progress').upsert({
                    user_id: userId,
                    book_slug: bookSlug,
                    current_page: state.currentPage,
                    last_read_at: new Date(state.lastReadAt).toISOString(),
                    total_time_spent: state.totalTimeSpent,
                    updated_at: new Date().toISOString()
                })

                // Sync reader settings
                await supabase.from('reader_settings').upsert({
                    user_id: userId,
                    book_slug: bookSlug,
                    font_size: state.fontSize,
                    line_height: state.lineHeight,
                    letter_spacing: state.letterSpacing,
                    theme: state.theme,
                    updated_at: new Date().toISOString()
                })

                // Sync highlights (batch upsert)
                if (highlights.length > 0) {
                    const highlightData = highlights.map(h => ({
                        id: h.id,
                        user_id: userId,
                        book_slug: bookSlug,
                        page: h.page,
                        text: h.text,
                        color: h.color,
                        timestamp: h.timestamp
                    }))
                    await supabase.from('highlights').upsert(highlightData)
                }

                setSyncStatus('synced')
            } catch (error) {
                console.error('Error syncing to Supabase:', error)
                setSyncStatus('offline')
            }
        }, 2000) // Debounce 2 seconds
    }

    // Load from Supabase on mount (if signed in)
    const loadFromSupabase = async (): Promise<{
        state: ReaderState | null
        highlights: Highlight[]
    }> => {
        if (!userId) return { state: null, highlights: [] }

        try {
            // Load reading progress
            const { data: progress } = await supabase
                .from('reading_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('book_slug', bookSlug)
                .single()

            // Load reader settings
            const { data: settings } = await supabase
                .from('reader_settings')
                .select('*')
                .eq('user_id', userId)
                .eq('book_slug', bookSlug)
                .single()

            // Load highlights
            const { data: highlightsData } = await supabase
                .from('highlights')
                .select('*')
                .eq('user_id', userId)
                .eq('book_slug', bookSlug)
                .order('timestamp', { ascending: true })

            const state: ReaderState | null = progress && settings ? {
                currentPage: progress.current_page,
                fontSize: settings.font_size,
                lineHeight: settings.line_height,
                letterSpacing: settings.letter_spacing,
                theme: settings.theme,
                lastReadAt: new Date(progress.last_read_at).getTime(),
                totalTimeSpent: progress.total_time_spent
            } : null

            const highlights: Highlight[] = highlightsData?.map(h => ({
                page: h.page,
                text: h.text,
                color: h.color,
                id: h.id,
                timestamp: h.timestamp
            })) || []

            return { state, highlights }
        } catch (error) {
            console.error('Error loading from Supabase:', error)
            return { state: null, highlights: [] }
        }
    }

    // Initialize: Load from Supabase first, fallback to localStorage
    const initialize = async () => {
        if (userId) {
            const { state: supabaseState, highlights: supabaseHighlights } = await loadFromSupabase()

            if (supabaseState) {
                // Supabase has data - use it and cache locally
                saveStateLocal(supabaseState)
                saveHighlightsLocal(supabaseHighlights)
                return { state: supabaseState, highlights: supabaseHighlights }
            }
        }

        // Fallback to localStorage
        const localState = loadStateLocal()
        const localHighlights = loadHighlightsLocal()

        // If user is signed in and has local data, sync it to Supabase
        if (userId && localState) {
            syncToSupabase(localState, localHighlights)
        }

        return { state: localState, highlights: localHighlights }
    }

    // Listen for online/offline events
    useEffect(() => {
        const handleOnline = () => {
            setSyncStatus('synced')
            // Sync any pending changes when coming back online
            const state = loadStateLocal()
            const highlights = loadHighlightsLocal()
            if (state && userId) {
                syncToSupabase(state, highlights)
            }
        }

        const handleOffline = () => {
            setSyncStatus('offline')
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [userId, bookSlug])

    return {
        initialize,
        saveStateLocal,
        loadStateLocal,
        saveHighlightsLocal,
        loadHighlightsLocal,
        syncToSupabase,
        syncStatus
    }
}
