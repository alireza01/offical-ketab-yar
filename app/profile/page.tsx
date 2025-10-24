import { ProfileForm } from '@/components/profile/profile-form'
import { ReadingHistory } from '@/components/profile/reading-history'
import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Profile | Ketab Yar',
  description: 'Your profile',
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileForm user={user} profile={profile} />
        <ReadingHistory userId={user.id} />
      </div>
    </div>
  )
}
