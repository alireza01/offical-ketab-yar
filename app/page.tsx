import { ContinueReading } from '@/components/home/continue-reading'
import { CTASection } from '@/components/home/cta-section'
import { HeroSection } from '@/components/home/hero-section'
import { HighestRatedBooks } from '@/components/home/highest-rated-books'
import { MostReadBooks } from '@/components/home/most-read-books'
import { RecentlyAddedBooks } from '@/components/home/recently-added-books'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'کتاب‌یار | دانلود رایگان کتاب انگلیسی | مطالعه دوزبانه با هوش مصنوعی',
  description: 'بیش از 1000 کتاب انگلیسی را رایگان و دوزبانه بخوانید. دانلود کتاب PDF، خلاصه کتاب، یادگیری زبان انگلیسی با کتاب. هوش مصنوعی Gemini، واژگان هوشمند، گیمیفیکیشن. شروع رایگان بدون کارت اعتباری.',
  keywords: [
    'دانلود رایگان کتاب',
    'کتاب انگلیسی',
    'مطالعه آنلاین',
    'یادگیری زبان انگلیسی',
    'خلاصه کتاب',
    'کتاب دوزبانه',
    'کتاب PDF',
    'free book download',
    'English books',
    'bilingual reading',
    'AI book reader',
    'کتاب‌یار',
    'Ketab-Yar',
  ],
  alternates: {
    canonical: 'https://ketabyar.ir',
    languages: {
      'fa': 'https://ketabyar.ir',
      'en': 'https://ketabyar.ir',
    },
  },
  openGraph: {
    title: 'کتاب‌یار | دانلود رایگان بیش از 1000 کتاب انگلیسی',
    description: 'مطالعه دوزبانه کتاب‌های انگلیسی با هوش مصنوعی. یادگیری زبان انگلیسی با کتاب. رایگان و بدون محدودیت.',
    url: 'https://ketabyar.ir',
    siteName: 'کتاب‌یار - Ketab-Yar',
    images: [
      {
        url: 'https://ketabyar.ir/og-image.png',
        width: 1200,
        height: 630,
        alt: 'کتاب‌یار - پلتفرم مطالعه دوزبانه',
      },
    ],
    locale: 'fa_IR',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'کتاب‌یار | دانلود رایگان کتاب انگلیسی',
    description: 'بیش از 1000 کتاب انگلیسی رایگان با مطالعه دوزبانه و هوش مصنوعی',
    images: ['https://ketabyar.ir/og-image.png'],
    site: '@ketabyar',
    creator: '@ketabyar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function HomePage() {
  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'کتاب‌یار',
    alternateName: 'Ketab-Yar',
    url: 'https://ketabyar.ir',
    description: 'پلتفرم هوشمند مطالعه دوزبانه با هوش مصنوعی برای یادگیری زبان انگلیسی',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ketabyar.ir/library?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'کتاب‌یار',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ketabyar.ir/logo.png'
      }
    }
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'کتاب‌یار',
    alternateName: 'Ketab-Yar',
    url: 'https://ketabyar.ir',
    logo: 'https://ketabyar.ir/logo.png',
    description: 'پلتفرم هوشمند مطالعه دوزبانه با AI',
    sameAs: [
      'https://twitter.com/ketabyar',
      'https://instagram.com/ketabyar',
      'https://github.com/ketabyar'
    ]
  }

  // FAQ Schema (Agent 1: For Google FAQ rich snippets)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'آیا کتاب‌یار رایگان است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله! کتاب‌یار کاملاً رایگان است. می‌توانید بیش از 1000 کتاب انگلیسی را به صورت دوزبانه (فارسی/انگلیسی) مطالعه کنید. برای دسترسی به ویژگی‌های پیشرفته مانند دانلود آفلاین و واژگان نامحدود، می‌توانید به نسخه پرمیوم ارتقا دهید.'
        }
      },
      {
        '@type': 'Question',
        name: 'چگونه با کتاب‌یار زبان انگلیسی یاد بگیرم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'کتاب‌یار با ارائه کتاب‌های دوزبانه، دیکشنری هوشمند، سیستم واژگان و هوش مصنوعی Gemini به شما کمک می‌کند تا با مطالعه کتاب‌های مورد علاقه‌تان، زبان انگلیسی را یاد بگیرید. هر کلمه ناشناخته را می‌توانید انتخاب کرده و معنی آن را ببینید.'
        }
      },
      {
        '@type': 'Question',
        name: 'آیا می‌توانم کتاب‌ها را دانلود کنم؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بله! کاربران پرمیوم می‌توانند کتاب‌ها را برای مطالعه آفلاین دانلود کنند. کتاب‌ها به صورت رمزنگاری شده ذخیره می‌شوند تا امنیت محتوا حفظ شود.'
        }
      },
      {
        '@type': 'Question',
        name: 'چند کتاب در کتاب‌یار موجود است؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'در حال حاضر بیش از 1000 کتاب انگلیسی در ژانرهای مختلف (رمان، علمی، خودسازی، تاریخی و...) در کتاب‌یار موجود است و هر روز کتاب‌های جدید اضافه می‌شوند.'
        }
      },
      {
        '@type': 'Question',
        name: 'هوش مصنوعی کتاب‌یار چگونه کار می‌کند؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'کتاب‌یار از هوش مصنوعی Gemini 2.5 Flash استفاده می‌کند. می‌توانید در حین مطالعه با کتاب چت کنید، سوالات خود را بپرسید و توضیحات بیشتری درباره محتوا دریافت کنید. AI متن صفحه فعلی و 5 صفحه قبلی را می‌خواند تا پاسخ‌های دقیق بدهد.'
        }
      }
    ]
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen">
        <HeroSection />
        <ContinueReading />
        <RecentlyAddedBooks />
        <HighestRatedBooks />
        <MostReadBooks />
        <CTASection />
      </div>
    </>
  )
}
