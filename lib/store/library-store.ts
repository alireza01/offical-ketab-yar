import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Library Store
 * Agent 2 (Performance): Client-side state management with persistence
 * Agent 3 (Psychology): Remember user preferences
 */

interface LibraryState {
    viewMode: 'grid' | 'list'
    setViewMode: (mode: 'grid' | 'list') => void
}

export const useLibraryStore = create<LibraryState>()(
    persist(
        (set) => ({
            viewMode: 'grid',
            setViewMode: (mode) => set({ viewMode: mode }),
        }),
        {
            name: 'library-preferences',
        }
    )
)
