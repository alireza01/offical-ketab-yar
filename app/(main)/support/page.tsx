import { SupportClient } from '@/components/support/support-client'
import { Metadata } from 'next'

// Force static generation for SEO (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day

export const metadata: Metadata = {
    title: 'تماس با پشتیبانی | کتاب‌یار - پاسخگویی 24/7',
    description: 'با تیم پشتیبانی کتاب‌یار در ارتباط باشید. پاسخگویی سریع در کمتر از 4 ساعت. ایمیل: support@ketabyar.com - پشتیبانی 24/7 در خدمت شماست.',
    keywords: ['پشتیبانی', 'تماس', 'support', 'contact', 'ارتباط', 'کمک'],
    alternates: {
        canonical: 'https://ketabyar.ir/support',
    },
    openGraph: {
        title: 'تماس با پشتیبانی کتاب‌یار - پاسخگویی 24/7',
        description: 'تیم پشتیبانی کتاب‌یار آماده کمک به شماست. پاسخ سریع در کمتر از 4 ساعت.',
        url: 'https://ketabyar.ir/support',
        type: 'website',
        images: ['/og-support.png'],
    },
}

export default function SupportPage() {
    return <SupportClient />
}
