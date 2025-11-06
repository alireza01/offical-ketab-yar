'use client'

import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface NativeToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose?: () => void
}

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

const styles = {
    success: 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400',
}

export function NativeToast({
    message,
    type = 'info',
    duration = 3000,
    onClose
}: NativeToastProps) {
    const [isVisible, setIsVisible] = useState(true)
    const Icon = icons[type]

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            onClose?.()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                        "fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50",
                        "flex items-center gap-3 px-4 py-3 rounded-2xl",
                        "border-2 backdrop-blur-xl shadow-2xl",
                        "min-w-[280px] max-w-[90vw] md:max-w-md",
                        "bottom-nav-safe",
                        styles[type]
                    )}
                >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium flex-1">{message}</p>
                    <button
                        onClick={() => {
                            setIsVisible(false)
                            onClose?.()
                        }}
                        className="flex-shrink-0 hover:opacity-70 transition-opacity"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Toast Manager Hook
let toastId = 0
const toastCallbacks = new Map<number, () => void>()

export function useNativeToast() {
    const [toasts, setToasts] = useState<Array<{
        id: number
        message: string
        type: ToastType
    }>>([])

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = toastId++
        setToasts(prev => [...prev, { id, message, type }])

        const removeToast = () => {
            setToasts(prev => prev.filter(t => t.id !== id))
            toastCallbacks.delete(id)
        }

        toastCallbacks.set(id, removeToast)
        return id
    }

    const success = (message: string) => showToast(message, 'success')
    const error = (message: string) => showToast(message, 'error')
    const warning = (message: string) => showToast(message, 'warning')
    const info = (message: string) => showToast(message, 'info')

    const ToastContainer = () => (
        <>
            {toasts.map(toast => (
                <NativeToast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => toastCallbacks.get(toast.id)?.()}
                />
            ))}
        </>
    )

    return {
        showToast,
        success,
        error,
        warning,
        info,
        ToastContainer,
    }
}
