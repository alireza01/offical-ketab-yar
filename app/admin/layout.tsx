import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin Dashboard | کتاب‌یار',
  description: 'Admin panel for managing Ketab Yar platform',
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login?redirect=/admin')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen" suppressHydrationWarning>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  )
}
