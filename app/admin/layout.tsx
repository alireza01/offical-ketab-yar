import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { createServerClient } from '@/lib/supabase/server'
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
  // 🔥 DEV MODE: Skip all auth checks in local development
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // In DEV_MODE or without Supabase, allow admin access
  if (DEV_MODE || !supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
    console.log('🎭 Admin Layout: DEV_MODE active, granting admin access')
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          <div className="mb-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              🎭 <strong>Development Mode:</strong> Admin access granted without authentication
            </p>
          </div>
          {children}
        </main>
      </div>
    )
  }

  // 🔒 PRODUCTION MODE: Full authentication and authorization
  const supabase = await createServerClient()

  // Check authentication
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login?redirect=/admin')
  }

  // Check if user is admin (using users table as per blueprint)
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, email')
    .eq('id', user.id)
    .single()

  // Admin check: For MVP, check if email is in admin list or subscription_tier is 'admin'
  // TODO: Add proper admin role system in Phase 2
  const isAdmin = userData?.subscription_tier === 'admin' ||
    userData?.email?.endsWith('@ketabyar.com')

  if (!isAdmin) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {children}
      </main>
    </div>
  )
}
