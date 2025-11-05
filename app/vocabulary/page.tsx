import { VocabularyClient } from '@/components/vocabulary/vocabulary-client-simple'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'واژگان | کتاب‌یار',
  description: 'مدیریت واژگان با سیستم تکرار فاصله‌دار و گیمیفیکیشن',
}

// Pure CSR for vocabulary page (Agent 2: Zero server load)
export default async function VocabularyPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">واژگان من</h1>
        <p className="text-muted-foreground">
          مدیریت، مرور و تسلط بر واژگان انگلیسی با سیستم هوشمند
        </p>
      </div>
      <VocabularyClient userId={user.id} />
    </div>
  )
}
