/**
 * Offline Settings Page
 * Manage downloaded books and storage
 */

import { OfflineSettingsClient } from '@/components/settings/offline-settings-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'تنظیمات آفلاین',
    description: 'مدیریت کتاب‌های دانلود شده و حافظه آفلاین',
}

export default function OfflineSettingsPage() {
    return <OfflineSettingsClient />
}
