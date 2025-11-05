import { BookReviewSelector } from '@/components/review/book-review-selector'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'مرور روزانه | کتاب‌یار',
  description: 'سیستم مرور هوشمند واژگان با الگوریتم تکرار فاصله‌دار',
}

export const dynamic = 'force-dynamic'

export default async function ReviewPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">مرور واژگان</h1>
        <p className="text-muted-foreground mt-1">
          کلمات خود را بر اساس کتاب مرور کنید
        </p>
      </div>
      <BookReviewSelector userId={user.id} />
    </div>
  )
}
