import { PricingClient } from '@/components/pricing/pricing-client'
import { PricingComparison } from '@/components/pricing/pricing-comparison'
import { PricingFAQ } from '@/components/pricing/pricing-faq'
import { PricingTestimonials } from '@/components/pricing/pricing-testimonials'
import type { Metadata } from 'next'

// Force static generation for SEO (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: 'قیمت‌گذاری و اشتراک | شروع رایگان | تخفیف ویژه 30% | کتاب‌یار',
  description: 'اشتراک کتاب‌یار با 1 روز رایگان. پلن ماهانه 299 هزار تومان، 3 ماهه با 11% تخفیف، سالانه با 30% تخفیف. دسترسی نامحدود به 1000+ کتاب انگلیسی. ضمانت بازگشت وجه.',
  keywords: [
    'قیمت کتاب‌یار',
    'اشتراک کتاب‌یار',
    'پلن پرمیوم',
    'تخفیف اشتراک',
    'اشتراک ماهانه',
    'اشتراک سالانه',
    'pricing',
    'subscription',
    'premium plan',
    'discount',
  ],
  alternates: {
    canonical: 'https://ketabyar.ir/subscription',
  },
  openGraph: {
    title: 'قیمت‌گذاری کتاب‌یار - شروع رایگان با تخفیف ویژه 30%',
    description: 'اشتراک کتاب‌یار با 1 روز رایگان. دسترسی نامحدود به 1000+ کتاب انگلیسی. تخفیف ویژه تا 30%',
    url: 'https://ketabyar.ir/subscription',
    type: 'website',
    images: ['/og-pricing.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'قیمت‌گذاری کتاب‌یار - تخفیف ویژه 30%',
    description: 'شروع رایگان با دسترسی نامحدود به 1000+ کتاب',
    images: ['/og-pricing.png'],
  },
}

export default function SubscriptionPage() {
  // JSON-LD Product/Offer Schema for SEO (Agent 1 - CRITICAL for conversions)
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'اشتراک پرمیوم کتاب‌یار',
    description: 'دسترسی نامحدود به بیش از 1000 کتاب انگلیسی با ترجمه فارسی',
    brand: {
      '@type': 'Brand',
      name: 'کتاب‌یار',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'اشتراک ماهانه',
        price: '299000',
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
        url: 'https://ketabyar.ir/subscription',
        priceValidUntil: '2025-12-31',
      },
      {
        '@type': 'Offer',
        name: 'اشتراک 3 ماهه',
        price: '799000',
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
        url: 'https://ketabyar.ir/subscription',
        priceValidUntil: '2025-12-31',
      },
      {
        '@type': 'Offer',
        name: 'اشتراک سالانه',
        price: '2499000',
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
        url: 'https://ketabyar.ir/subscription',
        priceValidUntil: '2025-12-31',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1247',
    },
  }

  // FAQ Schema for rich snippets (Agent 1)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'آیا می‌توانم قبل از خرید امتحان کنم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله! شما می‌توانید 1 روز کامل به صورت رایگان از تمام امکانات پرمیوم استفاده کنید. نیازی به کارت اعتباری نیست.',
        },
      },
      {
        '@type': 'Question',
        name: 'آیا ضمانت بازگشت وجه دارید؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله! اگر در 7 روز اول از خرید خود راضی نبودید، کل مبلغ را بدون هیچ سوالی بازگردانیم.',
        },
      },
    ],
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PricingClient />
      <PricingTestimonials />
      <PricingComparison />
      <PricingFAQ />
    </>
  )
}
