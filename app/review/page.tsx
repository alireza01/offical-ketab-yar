import { DailyQuizClient } from '@/components/review/daily-quiz-client'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'آزمون روزانه | کتاب‌یار',
  description: 'آزمون روزانه واژگان با سیستم تکرار فاصله‌دار و گیمیفیکیشن',
}

// Pure CSR for review page (Agent 2: Zero server load)
export default async function ReviewPage() {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">آزمون روزانه واژگان</h1>
        <p className="text-muted-foreground">
          با آزمون روزانه، واژگان خود را مرور کنید و XP کسب کنید
        </p>
      </div>
      <DailyQuizClient userId={user.id} />
    </div>
  )
}
