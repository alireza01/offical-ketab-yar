'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface Highlight {
    page: number
    text: string
    color: string
    id: string
    timestamp: number
}

interface HighlightStorage {
    highlights: Highlight[]
    addHighlight: (bookSlug: string, highlight: Highlight) => Promise<void>
    deleteHighlight: (bookSlug: string, highlightId: string) => Promise<void>
    getHighlights: (bookSlug: string) => Highlight[]
    syncToSupabase: () => Promise<void>
}

/**
 * Smart Highlight Storage Hook
 * 
 * Strategy:
 * - NOT signed in: Store in localStorage (browser only)
 * - Signed in: Store in Supabase + keep local cache
 * - On sign in: Sync local data to Supabase
 */
export function usePersistentHighlights(bookSlug: string): HighlightStorage {
    const [highlights, setHighlights] = useState<Highlight[]>([])
    const [userId, setUserId] = useState<string | null>(null)
    const supabase = createClient()

    // Check if user is signed in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUserId(user?.id || null)
        }
        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUserId = session?.user?.id || null
            setUserId(newUserId)

            // If user just signed in, sync local data to Supabase
            if (newUserId && !userId) {
                syncToSupabase()
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    // Load highlights on mount
    useEffect(() => {
        loadHighlights()
    }, [bookSlug, userId])

    // Load highlights from appropriate storage
    const loadHighlights = async () => {
        if (userId) {
            // Signed in: Load from Supabase
            await loadFromSupabase()
        } else {
            // Not signed in: Load from localStorage
            loadFromLocalStorage()
        }
    }

    // Load from localStorage (browser storage)
    const loadFromLocalStorage = () => {
        try {
            const key = `highlights_${bookSlug}`
            const stored = localStorage.getItem(key)
            if (stored) {
                const parsed = JSON.parse(stored)
                setHighlights(parsed)
            }
        } catch (error) {
            console.error('Error loading highlights from localStorage:', error)
        }
    }

    // Load from Supabase (database)
    const loadFromSupabase = async () => {
        try {
            const { data, error } = await supabase
                .from('highlights')
                .select('*')
                .eq('user_id', userId)
                .eq('book_slug', bookSlug)
                .order('timestamp', { ascending: true })

            if (error) throw error

            if (data) {
                const formattedHighlights: Highlight[] = data.map(h => ({
                    page: h.page,
                    text: h.text,
                    color: h.color,
                    id: h.id,
                    timestamp: h.timestamp
                }))
                setHighlights(formattedHighlights)

                // Also cache in localStorage for offline access
                saveToLocalStorage(formattedHighlights)
            }
        } catch (error) {
            console.error('Error loading highlights from Supabase:', error)
            // Fallback to localStorage if Supabase fails
            loadFromLocalStorage()
        }
    }

    // Save to localStorage
    const saveToLocalStorage = (highlightsToSave: Highlight[]) => {
        try {
            const key = `highlights_${bookSlug}`
            localStorage.setItem(key, JSON.stringify(highlightsToSave))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    }

    // Save to Supabase
    const saveToSupabase = async (highlight: Highlight) => {
        try {
            const { error } = await supabase
                .from('highlights')
                .insert({
                    id: highlight.id,
                    user_id: userId,
                    book_slug: bookSlug,
                    page: highlight.page,
                    text: highlight.text,
                    color: highlight.color,
                    timestamp: highlight.timestamp
                })

            if (error) throw error
        } catch (error) {
            console.error('Error saving to Supabase:', error)
        }
    }

    // Add a new highlight
    const addHighlight = async (bookSlug: string, highlight: Highlight) => {
        const newHighlights = [...highlights, highlight]
        setHighlights(newHighlights)

        if (userId) {
            // Signed in: Save to Supabase + localStorage cache
            await saveToSupabase(highlight)
            saveToLocalStorage(newHighlights)
        } else {
            // Not signed in: Save to localStorage only
            saveToLocalStorage(newHighlights)
        }
    }

    // Delete a highlight
    const deleteHighlight = async (bookSlug: string, highlightId: string) => {
        const newHighlights = highlights.filter(h => h.id !== highlightId)
        setHighlights(newHighlights)

        if (userId) {
            // Signed in: Delete from Supabase + update localStorage cache
            try {
                await supabase
                    .from('highlights')
                    .delete()
                    .eq('id', highlightId)
                    .eq('user_id', userId)
            } catch (error) {
                console.error('Error deleting from Supabase:', error)
            }
            saveToLocalStorage(newHighlights)
        } else {
            // Not signed in: Delete from localStorage only
            saveToLocalStorage(newHighlights)
        }
    }

    // Get highlights for current book
    const getHighlights = (bookSlug: string) => {
        return highlights
    }

    // Sync local data to Supabase (called when user signs in)
    const syncToSupabase = async () => {
        if (!userId) return

        try {
            // Get all local highlights for this book
            const key = `highlights_${bookSlug}`
            const stored = localStorage.getItem(key)
            if (!stored) return

            const localHighlights: Highlight[] = JSON.parse(stored)

            // Upload each highlight to Supabase
            for (const highlight of localHighlights) {
                await saveToSupabase(highlight)
            }

            console.log(`Synced ${localHighlights.length} highlights to Supabase`)
        } catch (error) {
            console.error('Error syncing to Supabase:', error)
        }
    }

    return {
        highlights,
        addHighlight,
        deleteHighlight,
        getHighlights,
        syncToSupabase
    }
}
