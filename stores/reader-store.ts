/**
 * Reader Store - Book Reader Preferences & State
 * Persists user reading preferences across sessions
 * Implements Agent 3's psychology strategy (personalization)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FontFamily = 'inter' | 'vazirmatn' | 'serif' | 'mono'
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
export type LineHeight = 'tight' | 'normal' | 'relaxed' | 'loose'
export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'night'
export type Language = 'en' | 'fa'
export type ReadingMode = 'single' | 'double' | 'scroll'

interface ReaderPreferences {
    fontFamily: FontFamily
    fontSize: FontSize
    lineHeight: LineHeight
    textAlign: TextAlign
    theme: ReaderTheme
    brightness: number // 0-100
    language: Language
    readingMode: ReadingMode
    showTranslation: boolean
    autoScroll: boolean
    autoScrollSpeed: number // words per minute
    enableAnimations: boolean // For Agent 2 performance toggle
    enableSounds: boolean
}

interface ReadingSession {
    bookId: string
    currentPage: number
    totalPages: number
    startTime: number
    pagesRead: number
}

interface ReaderState {
    // Preferences
    preferences: ReaderPreferences

    // Current session
    currentSession: ReadingSession | null

    // UI State
    isFullscreen: boolean
    showControls: boolean
    showDictionary: boolean
    selectedText: string | null

    // Actions - Preferences
    setFontFamily: (font: FontFamily) => void
    setFontSize: (size: FontSize) => void
    setLineHeight: (height: LineHeight) => void
    setTextAlign: (align: TextAlign) => void
    setTheme: (theme: ReaderTheme) => void
    setBrightness: (brightness: number) => void
    setLanguage: (language: Language) => void
    setReadingMode: (mode: ReadingMode) => void
    toggleTranslation: () => void
    toggleAnimations: () => void
    toggleSounds: () => void

    // Actions - Session
    startSession: (bookId: string, totalPages: number, startPage?: number) => void
    updatePage: (page: number) => void
    endSession: () => ReadingSession | null

    // Actions - UI
    toggleFullscreen: () => void
    toggleControls: () => void
    showDictionaryFor: (text: string) => void
    hideDictionary: () => void

    // Actions - Reset
    resetPreferences: () => void
    reset: () => void
}

const defaultPreferences: ReaderPreferences = {
    fontFamily: 'inter',
    fontSize: 'base',
    lineHeight: 'relaxed',
    textAlign: 'justify',
    theme: 'light',
    brightness: 100,
    language: 'en',
    readingMode: 'single',
    showTranslation: false,
    autoScroll: false,
    autoScrollSpeed: 200,
    enableAnimations: true,
    enableSounds: true,
}

const initialState = {
    preferences: defaultPreferences,
    currentSession: null,
    isFullscreen: false,
    showControls: true,
    showDictionary: false,
    selectedText: null,
}

export const useReaderStore = create<ReaderState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // Preference Actions
            setFontFamily: (fontFamily) => {
                set((state) => ({
                    preferences: { ...state.preferences, fontFamily },
                }))
            },

            setFontSize: (fontSize) => {
                set((state) => ({
                    preferences: { ...state.preferences, fontSize },
                }))
            },

            setLineHeight: (lineHeight) => {
                set((state) => ({
                    preferences: { ...state.preferences, lineHeight },
                }))
            },

            setTextAlign: (textAlign) => {
                set((state) => ({
                    preferences: { ...state.preferences, textAlign },
                }))
            },

            setTheme: (theme) => {
                set((state) => ({
                    preferences: { ...state.preferences, theme },
                }))
            },

            setBrightness: (brightness) => {
                set((state) => ({
                    preferences: { ...state.preferences, brightness: Math.max(0, Math.min(100, brightness)) },
                }))
            },

            setLanguage: (language) => {
                set((state) => ({
                    preferences: { ...state.preferences, language },
                }))
            },

            setReadingMode: (readingMode) => {
                set((state) => ({
                    preferences: { ...state.preferences, readingMode },
                }))
            },

            toggleTranslation: () => {
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        showTranslation: !state.preferences.showTranslation
                    },
                }))
            },

            toggleAnimations: () => {
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        enableAnimations: !state.preferences.enableAnimations
                    },
                }))
            },

            toggleSounds: () => {
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        enableSounds: !state.preferences.enableSounds
                    },
                }))
            },

            // Session Actions
            startSession: (bookId, totalPages, startPage = 0) => {
                set({
                    currentSession: {
                        bookId,
                        currentPage: startPage,
                        totalPages,
                        startTime: Date.now(),
                        pagesRead: 0,
                    },
                })
            },

            updatePage: (page) => {
                set((state) => {
                    if (!state.currentSession) return state

                    const pagesRead = Math.max(
                        state.currentSession.pagesRead,
                        page - state.currentSession.currentPage + state.currentSession.pagesRead
                    )

                    return {
                        currentSession: {
                            ...state.currentSession,
                            currentPage: page,
                            pagesRead,
                        },
                    }
                })
            },

            endSession: () => {
                const session = get().currentSession
                set({ currentSession: null })
                return session
            },

            // UI Actions
            toggleFullscreen: () => {
                set((state) => ({ isFullscreen: !state.isFullscreen }))
            },

            toggleControls: () => {
                set((state) => ({ showControls: !state.showControls }))
            },

            showDictionaryFor: (text) => {
                set({ showDictionary: true, selectedText: text })
            },

            hideDictionary: () => {
                set({ showDictionary: false, selectedText: null })
            },

            // Reset Actions
            resetPreferences: () => {
                set({ preferences: defaultPreferences })
            },

            reset: () => {
                set(initialState)
            },
        }),
        {
            name: 'ketab-yar-reader',
            partialize: (state) => ({
                preferences: state.preferences,
            }),
        }
    )
)
