import { StatusClient } from '@/components/status/status-client'
import { Metadata } from 'next'

// Force static generation with frequent revalidation (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 300 // Revalidate every 5 minutes for status updates

export const metadata: Metadata = {
    title: 'وضعیت سرویس و آپتایم | کتاب‌یار - مانیتورینگ لحظه‌ای',
    description: 'بررسی وضعیت لحظه‌ای سرویس‌های کتاب‌یار: وب‌سایت، API، پایگاه داده و هوش مصنوعی. آپتایم 99.96٪ و مانیتورینگ 24/7.',
    keywords: ['وضعیت سرویس', 'status', 'uptime', 'آپتایم', 'مانیتورینگ', 'سلامت سیستم'],
    alternates: {
        canonical: 'https://ketabyar.ir/status',
    },
    openGraph: {
        title: 'وضعیت سرویس کتاب‌یار - آپتایم 99.96٪',
        description: 'مانیتورینگ لحظه‌ای تمام سرویس‌های کتاب‌یار',
        url: 'https://ketabyar.ir/status',
        type: 'website',
        images: ['/og-status.png'],
    },
}

export default function StatusPage() {
    return <StatusClient />
}
