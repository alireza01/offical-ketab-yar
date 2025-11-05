/**
 * Offline Queue Store - PWA Offline Sync Management
 * Implements Agent 2's PWA strategy for offline functionality
 * Queues operations when offline and syncs when back online
 */

import { createClient } from '@/lib/supabase/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type QueuedOperationType =
    | 'add_xp'
    | 'update_streak'
    | 'reading_session'
    | 'add_vocabulary'
    | 'update_vocabulary'
    | 'delete_vocabulary'
    | 'update_progress'
    | 'add_highlight'
    | 'add_bookmark'

interface QueuedOperation {
    id: string
    type: QueuedOperationType
    data: Record<string, unknown>
    timestamp: number
    retryCount: number
    userId: string
}

interface OfflineQueueState {
    // State
    queue: QueuedOperation[]
    isSyncing: boolean
    isOnline: boolean
    lastSyncAt: number | null
    syncErrors: Array<{ operation: QueuedOperation; error: string }>

    // Actions
    addToQueue: (type: QueuedOperationType, data: Record<string, unknown>, userId: string) => void
    removeFromQueue: (id: string) => void
    syncQueue: () => Promise<void>
    clearQueue: () => void
    setOnlineStatus: (isOnline: boolean) => void
    retryFailedOperations: () => Promise<void>

    // Helpers
    getQueueSize: () => number
    hasFailedOperations: () => boolean
}

const initialState = {
    queue: [],
    isSyncing: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSyncAt: null,
    syncErrors: [],
}

export const useOfflineQueueStore = create<OfflineQueueState>()(
    persist(
        (set, get) => ({
            ...initialState,

            addToQueue: (type, data, userId) => {
                const operation: QueuedOperation = {
                    id: `${type}-${Date.now()}-${Math.random()}`,
                    type,
                    data,
                    timestamp: Date.now(),
                    retryCount: 0,
                    userId,
                }

                set((state) => ({
                    queue: [...state.queue, operation],
                }))

                // Auto-sync if online
                if (get().isOnline && !get().isSyncing) {
                    get().syncQueue()
                }
            },

            removeFromQueue: (id) => {
                set((state) => ({
                    queue: state.queue.filter((op) => op.id !== id),
                }))
            },

            syncQueue: async () => {
                const { queue, isSyncing, isOnline } = get()

                if (isSyncing || !isOnline || queue.length === 0) {
                    return
                }

                set({ isSyncing: true, syncErrors: [] })

                const supabase = createClient()
                const errors: Array<{ operation: QueuedOperation; error: string }> = []

                for (const operation of queue) {
                    try {
                        await processOperation(supabase, operation)
                        get().removeFromQueue(operation.id)
                    } catch (error) {
                        console.error(`Failed to sync operation ${operation.id}:`, error)

                        // Increment retry count
                        set((state) => ({
                            queue: state.queue.map((op) =>
                                op.id === operation.id
                                    ? { ...op, retryCount: op.retryCount + 1 }
                                    : op
                            ),
                        }))

                        // Remove if too many retries
                        if (operation.retryCount >= 3) {
                            errors.push({
                                operation,
                                error: error instanceof Error ? error.message : 'Unknown error',
                            })
                            get().removeFromQueue(operation.id)
                        }
                    }
                }

                set({
                    isSyncing: false,
                    lastSyncAt: Date.now(),
                    syncErrors: errors,
                })
            },

            clearQueue: () => {
                set({ queue: [], syncErrors: [] })
            },

            setOnlineStatus: (isOnline) => {
                set({ isOnline })

                // Auto-sync when coming back online
                if (isOnline && !get().isSyncing && get().queue.length > 0) {
                    get().syncQueue()
                }
            },

            retryFailedOperations: async () => {
                const { syncErrors } = get()

                for (const { operation } of syncErrors) {
                    get().addToQueue(operation.type, operation.data, operation.userId)
                }

                set({ syncErrors: [] })
                await get().syncQueue()
            },

            getQueueSize: () => {
                return get().queue.length
            },

            hasFailedOperations: () => {
                return get().syncErrors.length > 0
            },
        }),
        {
            name: 'ketab-yar-offline-queue',
            partialize: (state) => ({
                queue: state.queue,
                syncErrors: state.syncErrors,
            }),
        }
    )
)

/**
 * Process a queued operation
 */
async function processOperation(supabase: ReturnType<typeof createClient>, operation: QueuedOperation) {
    switch (operation.type) {
        case 'add_xp':
            await supabase.rpc('add_user_xp', {
                p_user_id: operation.userId,
                p_xp_amount: operation.data.amount,
            })
            break

        case 'update_streak':
            await supabase.rpc('update_user_streak', {
                p_user_id: operation.userId,
            })
            break

        case 'reading_session':
            await supabase.from('reading_sessions').insert({
                user_id: operation.userId,
                book_id: operation.data.bookId,
                pages_read: operation.data.pagesRead,
                duration_minutes: operation.data.durationMinutes,
                xp_earned: operation.data.xpEarned,
            })
            break

        case 'add_vocabulary':
            await supabase.from('user_words').insert({
                ...operation.data,
                user_id: operation.userId,
            })
            break

        case 'update_vocabulary':
            await supabase
                .from('user_words')
                .update(operation.data.updates)
                .eq('id', operation.data.id)
                .eq('user_id', operation.userId)
            break

        case 'delete_vocabulary':
            await supabase
                .from('user_words')
                .delete()
                .eq('id', operation.data.id)
                .eq('user_id', operation.userId)
            break

        case 'update_progress':
            await supabase
                .from('user_library')
                .update({
                    current_page: operation.data.currentPage,
                    progress_percentage: operation.data.progressPercentage,
                })
                .eq('user_id', operation.userId)
                .eq('book_id', operation.data.bookId)
            break

        case 'add_highlight':
            await supabase.from('highlights').insert({
                ...operation.data,
                user_id: operation.userId,
            })
            break

        case 'add_bookmark':
            await supabase.from('bookmarks').insert({
                ...operation.data,
                user_id: operation.userId,
            })
            break

        default:
            throw new Error(`Unknown operation type: ${operation.type}`)
    }
}

/**
 * Hook to set up online/offline listeners
 */
export function useOfflineSync() {
    const { setOnlineStatus, syncQueue } = useOfflineQueueStore()

    if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
            setOnlineStatus(true)
            syncQueue()
        })

        window.addEventListener('offline', () => {
            setOnlineStatus(false)
        })
    }
}
