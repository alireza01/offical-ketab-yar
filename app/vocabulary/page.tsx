import { VocabularyManager } from '@/components/vocabulary/vocabulary-manager'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'واژگان | کتاب‌یار',
  description: 'مدیریت واژگان شما',
}

export const dynamic = 'force-dynamic'

export default async function VocabularyPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VocabularyManager userId={user.id} />
    </div>
  )
}
