import { SupportClient } from '@/components/support/support-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'تماس با پشتیبانی | کتاب‌یار - پاسخگویی 24/7',
    description: 'با تیم پشتیبانی کتاب‌یار در ارتباط باشید. پاسخگویی سریع در کمتر از 4 ساعت. ارسال تیکت، ایمیل و چت آنلاین.',
    keywords: ['پشتیبانی کتاب‌یار', 'تماس با ما', 'support', 'تیکت', 'راهنمایی'],
    openGraph: {
        title: 'پشتیبانی کتاب‌یار',
        description: 'تیم پشتیبانی ما آماده کمک به شماست - پاسخگویی 24/7',
        type: 'website',
        locale: 'fa_IR',
        siteName: 'کتاب‌یار',
    },
    twitter: {
        card: 'summary',
        title: 'پشتیبانی کتاب‌یار',
        description: 'تیم پشتیبانی ما آماده کمک به شماست',
    },
    alternates: {
        canonical: '/support',
    },
}

export default function SupportPage() {
    return <SupportClient />
}
