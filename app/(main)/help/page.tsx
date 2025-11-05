import { HelpClient } from '@/components/help/help-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'مرکز راهنمایی و سوالات متداول | کتاب‌یار - پلتفرم هوشمند مطالعه',
    description: 'پاسخ سوالات متداول درباره کتاب‌یار: نحوه ثبت‌نام، خواندن کتاب، استفاده از هوش مصنوعی، اشتراک و پرداخت. راهنمای کامل استفاده از پلتفرم.',
    keywords: ['راهنمای کتاب‌یار', 'سوالات متداول', 'آموزش کتاب‌یار', 'پشتیبانی', 'FAQ'],
    openGraph: {
        title: 'مرکز راهنمایی کتاب‌یار',
        description: 'پاسخ تمام سوالات شما درباره استفاده از کتاب‌یار',
        type: 'website',
        locale: 'fa_IR',
        siteName: 'کتاب‌یار',
    },
    twitter: {
        card: 'summary',
        title: 'مرکز راهنمایی کتاب‌یار',
        description: 'پاسخ تمام سوالات شما درباره استفاده از کتاب‌یار',
    },
    alternates: {
        canonical: '/help',
    },
}

export default function HelpPage() {
    // JSON-LD structured data for FAQ
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'چگونه در کتاب‌یار ثبت‌نام کنم؟',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'برای ثبت‌نام، روی دکمه "ورود / ثبت‌نام" در بالای صفحه کلیک کنید. می‌توانید با ایمیل یا حساب گوگل خود ثبت‌نام کنید.'
                }
            },
            {
                '@type': 'Question',
                name: 'آیا استفاده از کتاب‌یار رایگان است؟',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'بله! کتاب‌یار یک نسخه رایگان دارد که به شما امکان می‌دهد 1 روز به صورت پرمیوم از تمام امکانات استفاده کنید.'
                }
            },
            {
                '@type': 'Question',
                name: 'چگونه یک کتاب را بخوانم؟',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'روی کتاب مورد نظر کلیک کنید و سپس دکمه "شروع خواندن" را بزنید. صفحه خواندن با امکانات پیشرفته باز می‌شود.'
                }
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <HelpClient />
        </>
    )
}
