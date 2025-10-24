import { SupportClient } from '@/components/support/support-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'پشتیبانی | کتاب‌یار',
    description: 'با تیم پشتیبانی کتاب‌یار در ارتباط باشید',
}

export default function SupportPage() {
    return <SupportClient />
}
