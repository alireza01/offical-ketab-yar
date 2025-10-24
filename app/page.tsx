import { ContinueReading } from '@/components/home/continue-reading'
import { CTASection } from '@/components/home/cta-section'
import { HeroSection } from '@/components/home/hero-section'
import { HighestRatedBooks } from '@/components/home/highest-rated-books'
import { MostReadBooks } from '@/components/home/most-read-books'
import { RecentlyAddedBooks } from '@/components/home/recently-added-books'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'کتاب‌یار | پلتفرم هوشمند مطالعه با AI',
  description: 'تجربه مطالعه متفاوت با هوش مصنوعی، پشتیبانی دوزبانه و ورق زدن واقعی صفحات',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ContinueReading />
      <RecentlyAddedBooks />
      <HighestRatedBooks />
      <MostReadBooks />
      <CTASection />
    </div>
  )
}
