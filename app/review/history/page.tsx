import { ReviewHistory } from '@/components/review/review-history'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'تاریخچه مرور | کتاب‌یار',
    description: 'مشاهده تاریخچه جلسات مرور و پیشرفت',
}

export const dynamic = 'force-dynamic'

export default async function ReviewHistoryPage() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ReviewHistory userId={user.id} />
        </div>
    )
}
