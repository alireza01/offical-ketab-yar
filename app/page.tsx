import { ContinueReading } from '@/components/home/continue-reading'
import { CTASection } from '@/components/home/cta-section'
import { HeroSection } from '@/components/home/hero-section'
import { HighestRatedBooks } from '@/components/home/highest-rated-books'
import { MostReadBooks } from '@/components/home/most-read-books'
import { RecentlyAddedBooks } from '@/components/home/recently-added-books'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'کتاب‌یار | پلتفرم هوشمند مطالعه دوزبانه با AI',
  description: 'بیش از 1000 کتاب انگلیسی را رایگان و دوزبانه بخوانید. با هوش مصنوعی Gemini، واژگان هوشمند، گیمیفیکیشن و تجربه مطالعه واقع‌گرایانه. شروع رایگان بدون نیاز به کارت اعتباری.',
  alternates: {
    canonical: 'https://ketabyar.ir',
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
