/**
 * ✅ AGENT 3 (PSYCHOLOGY): Hook for guest mode with smart conversion triggers
 * ✅ AGENT 2 (PERFORMANCE): Zero server load, all localStorage
 */

'use client'

import { GUEST_LIMITS, guestStorage } from '@/lib/storage/guest-storage'
import { useEffect, useState } from 'react'

export function useGuestMode() {
    const [isGuest, setIsGuest] = useState(false)
    const [stats, setStats] = useState(guestStorage.getStatistics())

    useEffect(() => {
        setIsGuest(guestStorage.isGuestMode())
        setStats(guestStorage.getStatistics())
    }, [])

    const enableGuestMode = () => {
        guestStorage.enableGuestMode()
        setIsGuest(true)
    }

    const disableGuestMode = () => {
        guestStorage.disableGuestMode()
        setIsGuest(false)
    }

    const refreshStats = () => {
        setStats(guestStorage.getStatistics())
    }

    // ✅ AGENT 3: Conversion triggers
    const shouldShowSignupPrompt = () => {
        return (
            stats.vocabularyCount >= GUEST_LIMITS.MAX_VOCABULARY ||
            stats.booksReadCount >= GUEST_LIMITS.MAX_BOOKS_READ ||
            stats.isNearLimit
        )
    }

    const getSignupMessage = () => {
        if (stats.vocabularyCount >= GUEST_LIMITS.MAX_VOCABULARY) {
            return 'لیست واژگان شما پر شده! با ثبت‌نام، واژگان نامحدود ذخیره کنید.'
        }
        if (stats.booksReadCount >= GUEST_LIMITS.MAX_BOOKS_READ) {
            return 'پیشرفت شما عالیه! با ثبت‌نام، داده‌هایتان را از دست ندهید.'
        }
        if (stats.isNearLimit) {
            return `فقط ${GUEST_LIMITS.MAX_VOCABULARY - stats.vocabularyCount} جا برای واژه جدید! با ثبت‌نام، محدودیت نداشته باشید.`
        }
        return 'با ثبت‌نام، پیشرفت خود را در همه دستگاه‌ها ذخیره کنید.'
    }

    return {
        isGuest,
        stats,
        enableGuestMode,
        disableGuestMode,
        refreshStats,
        shouldShowSignupPrompt,
        getSignupMessage,
        limits: GUEST_LIMITS,
    }
}
