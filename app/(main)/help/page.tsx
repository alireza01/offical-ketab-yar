import { HelpClient } from '@/components/help/help-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'مرکز راهنمایی | کتاب‌یار',
    description: 'راهنما و سوالات متداول کتاب‌یار',
}

export default function HelpPage() {
    return <HelpClient />
}
