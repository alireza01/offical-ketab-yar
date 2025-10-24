import { DailyQuiz } from '@/components/review/daily-quiz'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مرور | کتاب‌یار',
  description: 'مرور واژگان شما',
}

export default function ReviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">مرور روزانه</h1>
      <DailyQuiz />
    </div>
  )
}
