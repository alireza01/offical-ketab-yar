import { LibraryClient } from '@/components/library'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'کتاب‌های من | کتاب‌یار',
  description: 'کتاب‌های در حال خواندن، تکمیل شده، علاقه‌مندی‌ها و کتاب‌های دانلود شده آفلاین',
  robots: {
    index: false,
    follow: false,
  },
}

// Force dynamic rendering (CSR) - Private zone
export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const supabase = await createServerClient()

  // Authentication check
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login?redirect=/my-books')
  }

  // Fetch user data for personalization
  const { data: userData } = await supabase
    .from('users')
    .select('name, xp, current_streak, subscription_tier')
    .eq('id', user.id)
    .single()

  return <LibraryClient userId={user.id} userData={userData} />
}
