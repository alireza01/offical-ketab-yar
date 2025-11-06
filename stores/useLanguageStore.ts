import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LanguageMode = 'EN' | 'FA' | 'EN_FA' | 'FA_EN'

interface LanguageStore {
    mode: LanguageMode
    setMode: (mode: LanguageMode) => void
}

export const useLanguageStore = create<LanguageStore>()(
    persist(
        (set) => ({
            mode: 'EN_FA', // Default: English primary with Persian below
            setMode: (mode) => set({ mode }),
        }),
        {
            name: 'ketab-yar-language-mode',
        }
    )
)
