import { StatusClient } from '@/components/status/status-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'وضعیت سرویس و آپتایم | کتاب‌یار - مانیتورینگ لحظه‌ای',
    description: 'بررسی وضعیت لحظه‌ای سرویس‌های کتاب‌یار: وب‌سایت، API، پایگاه داده و هوش مصنوعی. آپتایم 99.96% و مانیتورینگ 24/7.',
    keywords: ['وضعیت سرویس', 'آپتایم', 'مانیتورینگ', 'status page', 'uptime'],
    openGraph: {
        title: 'وضعیت سرویس کتاب‌یار',
        description: 'تمام سیستم‌ها عملیاتی - آپتایم 99.96%',
        type: 'website',
        locale: 'fa_IR',
        siteName: 'کتاب‌یار',
    },
    twitter: {
        card: 'summary',
        title: 'وضعیت سرویس کتاب‌یار',
        description: 'تمام سیستم‌ها عملیاتی - آپتایم 99.96%',
    },
    alternates: {
        canonical: '/status',
    },
}

export default function StatusPage() {
    return <StatusClient />
}
