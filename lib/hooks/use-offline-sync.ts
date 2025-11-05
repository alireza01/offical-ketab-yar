/**
 * Offline Sync Hook
 * 
 * Agent 2 (Performance): Automatic sync when back online
 * Agent 3 (Psychology): Seamless UX - users never lose progress
 */

'use client'

import { logger } from '@/lib/logger'
import { addToSyncQueue, clearSyncQueue, getSyncQueue } from '@/lib/pwa/offline-storage'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export interface SyncStatus {
  isOnline: boolean
  isSyncing: boolean
  queueSize: number
  lastSyncAt: Date | null
  error: string | null
}

export function useOfflineSync() {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    queueSize: 0,
    lastSyncAt: null,
    error: null,
  })

  const syncQueue = useCallback(async () => {
    if (!status.isOnline || status.isSyncing) return

    try {
      setStatus(prev => ({ ...prev, isSyncing: true, error: null }))

      const queue = await getSyncQueue()

      if (queue.length === 0) {
        setStatus(prev => ({ ...prev, isSyncing: false, queueSize: 0 }))
        return
      }

      logger.info(`Syncing ${queue.length} queued items`, { context: 'useOfflineSync' })

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      for (const item of queue) {
        try {
          switch (item.type) {
            case 'xp':
              await supabase.rpc('add_user_xp', {
                p_user_id: user.id,
                p_xp_amount: item.data.amount,
              })
              break

            case 'progress':
              await supabase.rpc('update_reading_progress', {
                p_user_id: user.id,
                p_book_id: item.data.bookId,
                p_current_page: item.data.currentPage,
                p_total_pages: item.data.totalPages,
                p_progress_percentage: item.data.progressPercentage,
              })
              break

            case 'vocabulary':
              await supabase
                .from('vocabulary')
                .insert({
                  user_id: user.id,
                  ...item.data,
                })
              break
          }
        } catch (error) {
          logger.error(`Failed to sync item: ${item.type}`, error, { context: 'useOfflineSync' })
        }
      }

      await clearSyncQueue()

      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        queueSize: 0,
        lastSyncAt: new Date(),
      }))

      logger.info('Sync completed successfully', { context: 'useOfflineSync' })
    } catch (error) {
      logger.error('Sync failed', error, { context: 'useOfflineSync' })
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      }))
    }
  })

  const updateQueueSize = async () => {
    const queue = await getSyncQueue()
    setStatus(prev => ({ ...prev, queueSize: queue.length }))
  }

  useEffect(() => {
    const handleOnline = () => {
      logger.info('Device is online', { context: 'useOfflineSync' })
      setStatus(prev => ({ ...prev, isOnline: true }))
      syncQueue()
    }

    const handleOffline = () => {
      logger.info('Device is offline', { context: 'useOfflineSync' })
      setStatus(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (navigator.onLine) {
      syncQueue()
    }

    updateQueueSize()
    const interval = setInterval(updateQueueSize, 10000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [syncQueue])

  return {
    status,
    syncNow: syncQueue,
    addToQueue: addToSyncQueue,
  }
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
