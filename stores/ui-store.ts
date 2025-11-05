/**
 * UI Store - Global UI State Management
 * Manages modals, toasts, sidebar, and global UI elements
 * Implements Agent 3's psychology strategy (smooth UX)
 */

import { create } from 'zustand'

export type ModalType =
    | 'upgrade-prompt'
    | 'book-completion'
    | 'achievement-unlock'
    | 'vocabulary-limit'
    | 'confirm-delete'
    | 'share-highlight'
    | null

interface ModalData {
    title?: string
    description?: string
    data?: Record<string, unknown>
    onConfirm?: () => void
    onCancel?: () => void
}

interface Toast {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
}

interface UIState {
    // Modal State
    activeModal: ModalType
    modalData: ModalData | null

    // Sidebar State
    sidebarOpen: boolean
    sidebarCollapsed: boolean

    // Loading State
    globalLoading: boolean
    loadingMessage: string | null

    // Toast State
    toasts: Toast[]

    // Command Palette
    commandPaletteOpen: boolean

    // Mobile
    isMobile: boolean

    // Actions - Modal
    openModal: (type: ModalType, data?: ModalData) => void
    closeModal: () => void

    // Actions - Sidebar
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    toggleSidebarCollapse: () => void

    // Actions - Loading
    setGlobalLoading: (loading: boolean, message?: string) => void

    // Actions - Toast
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void

    // Actions - Command Palette
    toggleCommandPalette: () => void

    // Actions - Mobile
    setIsMobile: (isMobile: boolean) => void

    // Actions - Reset
    reset: () => void
}

const initialState = {
    activeModal: null as ModalType,
    modalData: null,
    sidebarOpen: true,
    sidebarCollapsed: false,
    globalLoading: false,
    loadingMessage: null,
    toasts: [],
    commandPaletteOpen: false,
    isMobile: false,
}

export const useUIStore = create<UIState>((set, get) => ({
    ...initialState,

    // Modal Actions
    openModal: (type, data) => {
        set({ activeModal: type, modalData: data || null })
    },

    closeModal: () => {
        set({ activeModal: null, modalData: null })
    },

    // Sidebar Actions
    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
    },

    setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
    },

    toggleSidebarCollapse: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    },

    // Loading Actions
    setGlobalLoading: (loading, message) => {
        set({ globalLoading: loading, loadingMessage: message || null })
    },

    // Toast Actions
    addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random()}`
        const newToast = { ...toast, id }

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }))

        // Auto-remove after duration
        const duration = toast.duration || 3000
        setTimeout(() => {
            get().removeToast(id)
        }, duration)
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }))
    },

    // Command Palette Actions
    toggleCommandPalette: () => {
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }))
    },

    // Mobile Actions
    setIsMobile: (isMobile) => {
        set({ isMobile })
    },

    // Reset
    reset: () => {
        set(initialState)
    },
}))

// Helper hooks for common UI patterns
export const useModal = () => {
    const { activeModal, modalData, openModal, closeModal } = useUIStore()
    return { activeModal, modalData, openModal, closeModal }
}

export const useToast = () => {
    const { addToast } = useUIStore()

    return {
        success: (message: string, duration?: number) =>
            addToast({ type: 'success', message, duration }),
        error: (message: string, duration?: number) =>
            addToast({ type: 'error', message, duration }),
        warning: (message: string, duration?: number) =>
            addToast({ type: 'warning', message, duration }),
        info: (message: string, duration?: number) =>
            addToast({ type: 'info', message, duration }),
    }
}

export const useSidebar = () => {
    const { sidebarOpen, sidebarCollapsed, toggleSidebar, setSidebarOpen, toggleSidebarCollapse } = useUIStore()
    return { sidebarOpen, sidebarCollapsed, toggleSidebar, setSidebarOpen, toggleSidebarCollapse }
}
