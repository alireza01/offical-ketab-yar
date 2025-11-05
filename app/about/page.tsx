import { AboutFeatures } from '@/components/about/about-features'
import { AboutHero } from '@/components/about/about-hero'
import { AboutMission } from '@/components/about/about-mission'
import { AboutStats } from '@/components/about/about-stats'
import { AboutTeam } from '@/components/about/about-team'
import type { Metadata } from 'next'

// Force static generation for SEO (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 604800 // Revalidate once per week

export const metadata: Metadata = {
  title: 'درباره کتاب‌یار | پلتفرم هوشمند مطالعه دوزبانه با AI',
  description: 'کتاب‌یار - پلتفرم پیشرو مطالعه آنلاین با هوش مصنوعی Gemini. ماموریت ما: تبدیل یادگیری زبان به یک تجربه لذت‌بخش و اعتیادآور. بیش از 1000 کتاب، 10000+ کاربر فعال، پشتیبانی 24/7.',
  keywords: ['درباره ما', 'کتاب‌یار', 'تیم', 'ماموریت', 'چشم‌انداز', 'about us', 'mission', 'team'],
  alternates: {
    canonical: 'https://ketabyar.ir/about',
  },
  openGraph: {
    title: 'درباره کتاب‌یار - پلتفرم هوشمند مطالعه دوزبانه',
    description: 'ماموریت ما: تبدیل یادگیری زبان به یک تجربه لذت‌بخش. بیش از 10000 کاربر فعال و 1000+ کتاب',
    url: 'https://ketabyar.ir/about',
    type: 'website',
    images: ['/og-about.png'],
  },
}

export default function AboutPage() {
  // Organization JSON-LD Schema for SEO (Agent 1)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'کتاب‌یار',
    alternateName: 'Ketab-Yar',
    url: 'https://ketabyar.ir',
    logo: 'https://ketabyar.ir/logo.png',
    description: 'پلتفرم هوشمند مطالعه دوزبانه با هوش مصنوعی',
    foundingDate: '2025',
    founders: [
      {
        '@type': 'Person',
        name: 'تیم کتاب‌یار'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR'
    },
    sameAs: [
      'https://twitter.com/ketabyar',
      'https://instagram.com/ketabyar',
      'https://github.com/ketabyar'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@ketabyar.com',
      contactType: 'Customer Support',
      availableLanguage: ['Persian', 'English']
    }
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen">
        <AboutHero />
        <AboutStats />
        <AboutMission />
        <AboutFeatures />
        <AboutTeam />
      </div>
    </>
  )
}
