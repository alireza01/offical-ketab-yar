/**
 * Offline Indicator Component
 * Shows connection status and sync queue
 */

'use client'

import { useOfflineSync } from '@/hooks/use-offline-sync'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

export function OfflineIndicator() {
    const isOnline = useOnlineStatus()
    const { isSyncing, queueSize } = useOfflineSync()

    return (
        <AnimatePresence>
            {(!isOnline || queueSize > 0) && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-16 left-1/2 z-50 -translate-x-1/2"
                >
                    <div
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm ${isOnline
                                ? 'bg-blue-500/90 text-white'
                                : 'bg-orange-500/90 text-white'
                            }`}
                    >
                        {isOnline ? (
                            <>
                                {isSyncing ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </motion.div>
                                ) : (
                                    <Wifi className="h-4 w-4" />
                                )}
                                <span>
                                    {isSyncing
                                        ? `در حال همگام‌سازی ${queueSize} مورد...`
                                        : `${queueSize} مورد در صف همگام‌سازی`}
                                </span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="h-4 w-4" />
                                <span>حالت آفلاین</span>
                                {queueSize > 0 && (
                                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                        {queueSize}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
