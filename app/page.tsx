/**
 * ✅ AGENT 1 (SEO): Homepage optimized for maximum Google visibility
 * ✅ AGENT 2 (Performance): Dynamic imports for below-fold components
 * ✅ AGENT 3 (Psychology): Smooth section transitions for engagement
 */

import { ContinueReading } from '@/components/home/continue-reading'
import { HeroSection } from '@/components/home/hero-section'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

/**
 * ✅ AGENT 2 (Performance): Dynamic imports for below-fold sections
 * These components load after initial page render, improving FCP and LCP
 */
const RecentlyAddedBooks = dynamic(
  () => import('@/components/home/recently-added-books').then(mod => ({ default: mod.RecentlyAddedBooks })),
  {
    loading: () => <div className="h-96 skeleton" />,
    ssr: true, // Still SSR for SEO, but code-split for performance
  }
)

const HighestRatedBooks = dynamic(
  () => import('@/components/home/highest-rated-books').then(mod => ({ default: mod.HighestRatedBooks })),
  {
    loading: () => <div className="h-96 skeleton" />,
    ssr: true,
  }
)

const MostReadBooks = dynamic(
  () => import('@/components/home/most-read-books').then(mod => ({ default: mod.MostReadBooks })),
  {
    loading: () => <div className="h-96 skeleton" />,
    ssr: true,
  }
)

const CTASection = dynamic(
  () => import('@/components/home/cta-section').then(mod => ({ default: mod.CTASection })),
  {
    loading: () => <div className="h-64 skeleton" />,
    ssr: true,
  }
)

/**
 * ✅ AGENT 1 (SEO): Rich metadata with keywords for homepage
 */
export const metadata: Metadata = {
  title: 'کتاب‌یار | پلتفرم هوشمند مطالعه آنلاین با AI - بیش از 1000 کتاب برتر دنیا',
  description: 'تجربه مطالعه متفاوت با هوش مصنوعی Gemini 2.5 Flash، پشتیبانی دوزبانه فارسی-انگلیسی، ورق زدن واقعی صفحات، واژگان هوشمند و گیمیفیکیشن. دسترسی به بیش از 1000 کتاب برتر دنیا.',
  keywords: [
    'کتاب آنلاین',
    'مطالعه آنلاین',
    'یادگیری زبان انگلیسی',
    'کتاب انگلیسی',
    'دوزبانه',
    'هوش مصنوعی',
    'Gemini AI',
    'واژگان انگلیسی',
    'کتاب‌یار',
  ],
  openGraph: {
    title: 'کتاب‌یار | پلتفرم هوشمند مطالعه آنلاین با AI',
    description: 'تجربه مطالعه متفاوت با هوش مصنوعی، پشتیبانی دوزبانه و ورق زدن واقعی صفحات',
    type: 'website',
    url: 'https://ketabyar.ir',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'کتاب‌یار - پلتفرم مطالعه آنلاین',
      },
    ],
  },
  alternates: {
    canonical: 'https://ketabyar.ir',
  },
}

/**
 * ✅ AGENT 3 (Psychology): Smooth page transitions and section reveals
 * Creates engaging flow that keeps users scrolling
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Above-fold: Critical content loads immediately */}
      <HeroSection />
      <ContinueReading />

      {/* Below-fold: Lazy-loaded sections for performance */}
      <div className="space-y-16 md:space-y-24">
        <RecentlyAddedBooks />
        <HighestRatedBooks />
        <MostReadBooks />
        <CTASection />
      </div>
    </div>
  )
}
