'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

/**
 * Smart Storage System
 * 
 * Universal storage hook that works for ANY data type:
 * - Highlights
 * - Vocabulary
 * - Reading progress
 * - Bookmarks
 * - Notes
 * - Settings
 * 
 * Strategy:
 * - NOT signed in: localStorage (browser only)
 * - Signed in: Supabase + localStorage cache
 * - On sign in: Auto-sync local data to Supabase
 */

interface SmartStorageOptions<T> {
    tableName: string // Supabase table name
    localKey: string // localStorage key
    userId?: string | null
}

export function useSmartStorage<T extends { id: string }>(
    options: SmartStorageOptions<T>
) {
    const [data, setData] = useState<T[]>([])
    const [userId, setUserId] = useState<string | null>(options.userId || null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Check auth status
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            const newUserId = user?.id || null
            setUserId(newUserId)

            // If user just signed in, sync local data
            if (newUserId && !userId) {
                await syncLocalToSupabase()
            }
        }
        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const newUserId = session?.user?.id || null
                const wasSignedOut = userId && !newUserId
                const justSignedIn = !userId && newUserId

                setUserId(newUserId)

                if (justSignedIn) {
                    await syncLocalToSupabase()
                } else if (wasSignedOut) {
                    // User signed out - keep local data
                    await loadFromLocalStorage()
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Load data on mount
    useEffect(() => {
        loadData()
    }, [userId, options.localKey])

    // Load data from appropriate storage
    const loadData = async () => {
        setIsLoading(true)
        try {
            if (userId) {
                await loadFromSupabase()
            } else {
                await loadFromLocalStorage()
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Load from localStorage
    const loadFromLocalStorage = async () => {
        try {
            const stored = localStorage.getItem(options.localKey)
            if (stored) {
                const parsed = JSON.parse(stored)
                setData(parsed)
            }
        } catch (error) {
            console.error(`Error loading from localStorage (${options.localKey}):`, error)
        }
    }

    // Load from Supabase
    const loadFromSupabase = async () => {
        try {
            const { data: supabaseData, error } = await supabase
                .from(options.tableName)
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error

            if (supabaseData) {
                setData(supabaseData as T[])
                // Cache in localStorage for offline access
                saveToLocalStorage(supabaseData as T[])
            }
        } catch (error) {
            console.error(`Error loading from Supabase (${options.tableName}):`, error)
            // Fallback to localStorage
            await loadFromLocalStorage()
        }
    }

    // Save to localStorage
    const saveToLocalStorage = (dataToSave: T[]) => {
        try {
            localStorage.setItem(options.localKey, JSON.stringify(dataToSave))
        } catch (error) {
            console.error(`Error saving to localStorage (${options.localKey}):`, error)
        }
    }

    // Save to Supabase
    const saveToSupabase = async (item: T) => {
        if (!userId) return

        try {
            const { error } = await supabase
                .from(options.tableName)
                .upsert({
                    ...item,
                    user_id: userId
                })

            if (error) throw error
        } catch (error) {
            console.error(`Error saving to Supabase (${options.tableName}):`, error)
        }
    }

    // Add new item
    const addItem = async (item: T) => {
        const newData = [...data, item]
        setData(newData)

        if (userId) {
            // Signed in: Save to Supabase + cache locally
            await saveToSupabase(item)
            saveToLocalStorage(newData)
        } else {
            // Not signed in: Save to localStorage only
            saveToLocalStorage(newData)
        }
    }

    // Update existing item
    const updateItem = async (itemId: string, updates: Partial<T>) => {
        const newData = data.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        )
        setData(newData)

        if (userId) {
            const updatedItem = newData.find(item => item.id === itemId)
            if (updatedItem) {
                await saveToSupabase(updatedItem)
            }
            saveToLocalStorage(newData)
        } else {
            saveToLocalStorage(newData)
        }
    }

    // Delete item
    const deleteItem = async (itemId: string) => {
        const newData = data.filter(item => item.id !== itemId)
        setData(newData)

        if (userId) {
            try {
                await supabase
                    .from(options.tableName)
                    .delete()
                    .eq('id', itemId)
                    .eq('user_id', userId)
            } catch (error) {
                console.error(`Error deleting from Supabase (${options.tableName}):`, error)
            }
            saveToLocalStorage(newData)
        } else {
            saveToLocalStorage(newData)
        }
    }

    // Sync local data to Supabase (when user signs in)
    const syncLocalToSupabase = async () => {
        if (!userId) return

        try {
            const stored = localStorage.getItem(options.localKey)
            if (!stored) return

            const localData: T[] = JSON.parse(stored)

            // Upload each item to Supabase
            for (const item of localData) {
                await saveToSupabase(item)
            }

            console.log(`✅ Synced ${localData.length} items to Supabase (${options.tableName})`)

            // Reload from Supabase to get any server-side data
            await loadFromSupabase()
        } catch (error) {
            console.error(`Error syncing to Supabase (${options.tableName}):`, error)
        }
    }

    // Clear all data (useful for testing or user request)
    const clearAll = async () => {
        setData([])
        localStorage.removeItem(options.localKey)

        if (userId) {
            try {
                await supabase
                    .from(options.tableName)
                    .delete()
                    .eq('user_id', userId)
            } catch (error) {
                console.error(`Error clearing Supabase data (${options.tableName}):`, error)
            }
        }
    }

    return {
        data,
        isLoading,
        addItem,
        updateItem,
        deleteItem,
        syncLocalToSupabase,
        clearAll,
        refresh: loadData
    }
}
