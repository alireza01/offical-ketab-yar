"use client"

import { logger } from '@/lib/logger'
import { useCallback, useEffect, useState } from 'react'

/**
 * Enhanced local storage hook with SSR support and type safety
 * Implements Agent 2's offline persistence strategy
 * 
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue)

    // Initialize from localStorage on mount (client-side only)
    useEffect(() => {
        if (typeof window === 'undefined') return

        try {
            const item = window.localStorage.getItem(key)
            if (item) {
                setStoredValue(JSON.parse(item))
            }
        } catch (error) {
            logger.error('Error reading from localStorage', error, {
                context: 'useLocalStorage',
                metadata: { key }
            })
        }
    }, [key])

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                // Allow value to be a function so we have same API as useState
                const valueToStore = value instanceof Function ? value(storedValue) : value

                // Save state
                setStoredValue(valueToStore)

                // Save to local storage
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore))
                }
            } catch (error) {
                logger.error('Error writing to localStorage', error, {
                    context: 'useLocalStorage',
                    metadata: { key }
                })
            }
        },
        [key, storedValue]
    )

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue)
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key)
            }
        } catch (error) {
            logger.error('Error removing from localStorage', error, {
                context: 'useLocalStorage',
                metadata: { key }
            })
        }
    }, [key, initialValue])

    return [storedValue, setValue, removeValue]
}

/**
 * Hook for session storage (cleared when tab closes)
 */
export function useSessionStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue)

    useEffect(() => {
        if (typeof window === 'undefined') return

        try {
            const item = window.sessionStorage.getItem(key)
            if (item) {
                setStoredValue(JSON.parse(item))
            }
        } catch (error) {
            logger.error('Error reading from sessionStorage', error, {
                context: 'useSessionStorage',
                metadata: { key }
            })
        }
    }, [key])

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value
                setStoredValue(valueToStore)

                if (typeof window !== 'undefined') {
                    window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
                }
            } catch (error) {
                logger.error('Error writing to sessionStorage', error, {
                    context: 'useSessionStorage',
                    metadata: { key }
                })
            }
        },
        [key, storedValue]
    )

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue)
            if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem(key)
            }
        } catch (error) {
            logger.error('Error removing from sessionStorage', error, {
                context: 'useSessionStorage',
                metadata: { key }
            })
        }
    }, [key, initialValue])

    return [storedValue, setValue, removeValue]
}
