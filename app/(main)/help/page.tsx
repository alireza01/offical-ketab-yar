import { HelpClient } from '@/components/help/help-client'
import { Metadata } from 'next'

// Force static generation for SEO (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export const metadata: Metadata = {
    title: 'مرکز راهنمایی و سوالات متداول | کتاب‌یار - پاسخ تمام سوالات شما',
    description: 'راهنمای کامل استفاده از کتاب‌یار: نحوه ثبت‌نام، خواندن کتاب، استفاده از هوش مصنوعی، مدیریت اشتراک و پاسخ به بیش از 20 سوال متداول. پشتیبانی 24/7.',
    keywords: ['راهنما', 'سوالات متداول', 'FAQ', 'آموزش', 'پشتیبانی', 'کتاب‌یار', 'help', 'support'],
    alternates: {
        canonical: 'https://ketabyar.ir/help',
    },
    openGraph: {
        title: 'مرکز راهنمایی کتاب‌یار - پاسخ تمام سوالات شما',
        description: 'راهنمای کامل و سوالات متداول کتاب‌یار. پشتیبانی 24/7 در خدمت شماست.',
        url: 'https://ketabyar.ir/help',
        type: 'website',
        images: ['/og-help.png'],
    },
}

export default function HelpPage() {
    return <HelpClient />
}
