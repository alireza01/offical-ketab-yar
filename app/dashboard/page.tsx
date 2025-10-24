import { CurrentlyReading } from '@/components/dashboard/currently-reading'
import { ReadingStats } from '@/components/dashboard/reading-stats'
import { RecommendedBooks } from '@/components/dashboard/recommended-books'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'داشبورد | کتاب‌یار',
  description: 'داشبورد مطالعه شما',
}

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">داشبورد من</h1>
      <div className="grid gap-6">
        <ReadingStats />
        <CurrentlyReading />
        <RecommendedBooks />
      </div>
    </div>
  )
}
