/**
 * Sync Indicator Component
 * Agent 3 (Psychology): Reassuring sync status
 * 
 * Features:
 * - Shows sync status
 * - Unsynced count
 * - Manual sync trigger
 * - Offline indicator
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { getSyncStatus, onSyncProgress, syncOfflineData, type SyncProgress } from '@/lib/storage/sync-manager'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Cloud, CloudOff, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SyncIndicator() {
    const [isOnline, setIsOnline] = useState(true)
    const [unsyncedCount, setUnsyncedCount] = useState(0)
    const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    // Check online status
    useEffect(() => {
        const updateOnlineStatus = () => setIsOnline(navigator.onLine)

        updateOnlineStatus()
        window.addEventListener('online', updateOnlineStatus)
        window.addEventListener('offline', updateOnlineStatus)

        return () => {
            window.removeEventListener('online', updateOnlineStatus)
            window.removeEventListener('offline', updateOnlineStatus)
        }
    }, [])

    // Load sync status
    useEffect(() => {
        loadSyncStatus()

        // Refresh every 10 seconds
        const interval = setInterval(loadSyncStatus, 10000)
        return () => clearInterval(interval)
    }, [])

    // Listen to sync progress
    useEffect(() => {
        const unsubscribe = onSyncProgress((progress) => {
            setSyncProgress(progress)

            // Reload status after sync completes
            if (progress.status === 'success' || progress.status === 'error') {
                setTimeout(loadSyncStatus, 1000)
            }
        })

        return unsubscribe
    }, [])

    async function loadSyncStatus() {
        try {
            const status = await getSyncStatus()
            setUnsyncedCount(status.unsyncedCount)
            setIsOnline(status.isOnline)
        } catch (error) {
            console.error('Error loading sync status:', error)
        }
    }

    async function handleManualSync() {
        try {
            await syncOfflineData()
        } catch (error) {
            console.error('Error syncing:', error)
        }
    }

    const isSyncing = syncProgress?.status === 'syncing'
    const syncPercentage = syncProgress ? (syncProgress.synced / syncProgress.total) * 100 : 0

    // Don't show if everything is synced and online (but always show during development)
    const shouldShow = unsyncedCount > 0 || !isOnline || syncProgress || process.env.NODE_ENV === 'development'

    if (!shouldShow) {
        return null
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'relative gap-2',
                        !isOnline && 'text-orange-500',
                        unsyncedCount > 0 && 'text-blue-500'
                    )}
                >
                    {/* Icon */}
                    {isSyncing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </motion.div>
                    ) : !isOnline ? (
                        <CloudOff className="h-4 w-4" />
                    ) : unsyncedCount > 0 ? (
                        <Cloud className="h-4 w-4" />
                    ) : (
                        <Cloud className="h-4 w-4 text-green-500" />
                    )}

                    {/* Badge */}
                    {unsyncedCount > 0 && !isSyncing && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {unsyncedCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">وضعیت همگام‌سازی</h4>
                        {isOnline ? (
                            <Badge variant="outline" className="gap-1">
                                <Wifi className="h-3 w-3" />
                                آنلاین
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="gap-1 text-orange-500">
                                <WifiOff className="h-3 w-3" />
                                آفلاین
                            </Badge>
                        )}
                    </div>

                    {/* Sync Progress */}
                    {isSyncing && syncProgress && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">در حال همگام‌سازی...</span>
                                <span className="font-medium">
                                    {syncProgress.synced} / {syncProgress.total}
                                </span>
                            </div>
                            <Progress value={syncPercentage} className="h-2" />
                            <p className="text-xs text-muted-foreground">{syncProgress.message}</p>
                        </div>
                    )}

                    {/* Unsynced Count */}
                    {!isSyncing && unsyncedCount > 0 && (
                        <div className="rounded-lg bg-blue-500/10 p-3 text-sm">
                            <p className="font-medium text-blue-700 dark:text-blue-400">
                                {unsyncedCount} مورد همگام‌نشده
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isOnline
                                    ? 'برای همگام‌سازی دکمه زیر را بزنید'
                                    : 'با اتصال به اینترنت، خودکار همگام‌سازی می‌شود'}
                            </p>
                        </div>
                    )}

                    {/* Success Message */}
                    {!isSyncing && unsyncedCount === 0 && syncProgress?.status === 'success' && (
                        <div className="rounded-lg bg-green-500/10 p-3 text-sm">
                            <p className="font-medium text-green-700 dark:text-green-400">
                                ✓ همه چیز همگام است
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                تمام تغییرات شما ذخیره شده است
                            </p>
                        </div>
                    )}

                    {/* Offline Info */}
                    {!isOnline && (
                        <div className="rounded-lg bg-orange-500/10 p-3 text-sm">
                            <p className="font-medium text-orange-700 dark:text-orange-400">
                                حالت آفلاین
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                تغییرات شما ذخیره می‌شود و با اتصال به اینترنت همگام‌سازی خواهد شد
                            </p>
                        </div>
                    )}

                    {/* Manual Sync Button */}
                    {isOnline && unsyncedCount > 0 && !isSyncing && (
                        <Button
                            onClick={handleManualSync}
                            className="w-full"
                            size="sm"
                        >
                            <RefreshCw className="ml-2 h-4 w-4" />
                            همگام‌سازی اکنون
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
