import { StatusClient } from '@/components/status/status-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'وضعیت سرویس | کتاب‌یار',
    description: 'وضعیت و آپتایم سرویس‌های کتاب‌یار',
}

export default function StatusPage() {
    return <StatusClient />
}
