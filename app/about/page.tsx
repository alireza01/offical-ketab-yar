import { AboutFAQ } from '@/components/about/about-faq'
import { AboutFeatures } from '@/components/about/about-features'
import { AboutHero } from '@/components/about/about-hero'
import { AboutMission } from '@/components/about/about-mission'
import { AboutStats } from '@/components/about/about-stats'
import { AboutTeam } from '@/components/about/about-team'
import { AboutTestimonials } from '@/components/about/about-testimonials'
import { AboutTrustSignals } from '@/components/about/about-trust-signals'
import type { Metadata } from 'next'

// Agent 1 (SEO): Enhanced metadata with keywords and Open Graph
export const metadata: Metadata = {
  title: 'درباره کتاب‌یار | پلتفرم هوشمند مطالعه دوزبانه با AI',
  description: 'کتاب‌یار یک پلتفرم مطالعه آنلاین پیشرفته با هوش مصنوعی Gemini است که یادگیری زبان انگلیسی را از طریق مطالعه کتاب‌های دوزبانه آسان و لذت‌بخش می‌کند. بیش از 1000 کتاب، 50 هزار کاربر فعال.',
  keywords: ['کتاب‌یار', 'مطالعه دوزبانه', 'یادگیری زبان انگلیسی', 'هوش مصنوعی', 'کتاب آنلاین', 'Gemini AI'],
  openGraph: {
    title: 'درباره کتاب‌یار | پلتفرم هوشمند مطالعه دوزبانه',
    description: 'پلتفرم مطالعه آنلاین با هوش مصنوعی، بیش از 1000 کتاب دوزبانه و 50 هزار کاربر فعال',
    type: 'website',
    locale: 'fa_IR',
    siteName: 'کتاب‌یار',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'درباره کتاب‌یار | پلتفرم هوشمند مطالعه',
    description: 'یادگیری زبان انگلیسی از طریق مطالعه کتاب‌های دوزبانه با هوش مصنوعی',
  },
  alternates: {
    canonical: '/about',
  },
}

// Agent 1 (SEO): JSON-LD structured data for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'کتاب‌یار',
  alternateName: 'Ketab-Yar',
  url: 'https://ketab-yar.com',
  logo: 'https://ketab-yar.com/logo.png',
  description: 'پلتفرم هوشمند مطالعه دوزبانه با هوش مصنوعی',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/ketabyar',
    'https://instagram.com/ketabyar',
    'https://linkedin.com/company/ketabyar',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@ketab-yar.com',
    availableLanguage: ['Persian', 'English'],
  },
}

// Agent 1 (SEO): FAQ Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'کتاب‌یار چطور کار می‌کنه؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'کتاب‌یار یک پلتفرم مطالعه آنلاین است که کتاب‌ها رو به صورت دوزبانه (انگلیسی و فارسی) ارائه می‌ده. شما می‌تونید با یک کلیک بین دو زبان جابجا بشید، کلمات جدید رو ذخیره کنید و با هوش مصنوعی درباره محتوای کتاب گفتگو کنید.'
      }
    },
    {
      '@type': 'Question',
      name: 'آیا کتاب‌یار رایگان است؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'بله! ما یک پلن رایگان داریم که شامل دسترسی به چندین کتاب پرفروش و کلاسیک می‌شه. برای دسترسی به کل کتابخانه و امکانات پیشرفته، می‌تونید پلن پرمیوم رو انتخاب کنید.'
      }
    },
    {
      '@type': 'Question',
      name: 'هوش مصنوعی کتاب‌یار چه کمکی می‌کنه؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'هوش مصنوعی Gemini 2.5 Flash ما می‌تونه به سوالات شما درباره محتوای کتاب پاسخ بده، مفاهیم پیچیده رو توضیح بده، معنی کلمات رو با مثال بیاره و حتی به عنوان یک معلم زبان شخصی عمل کنه.'
      }
    }
  ]
}

export default function AboutPage() {
  return (
    <>
      {/* Agent 1 (SEO): Inject JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen">
        <AboutHero />
        <AboutStats />
        <AboutMission />
        <AboutFeatures />
        <AboutTrustSignals />
        <AboutTestimonials />
        <AboutFAQ />
        <AboutTeam />
      </div>
    </>
  )
}
