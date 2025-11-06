import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalBooks },
    { count: totalUsers },
    { count: activeSubscriptions },
    { data: recentBooks },
  ] = await Promise.all([
    supabase.from('books').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase
      .from('books')
      .select('title, created_at, view_count')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    totalBooks: totalBooks || 0,
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    recentBooks: recentBooks || [],
  }
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function AdminStats() {
  const stats = await getAdminStats()

  const cards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: BookOpen,
      description: 'Published books',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: TrendingUp,
      description: 'Premium members',
    },
    {
      title: 'Revenue',
      value: `$${(stats.activeSubscriptions * 9.99).toFixed(2)}`,
      icon: DollarSign,
      description: 'Monthly recurring',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-muted-foreground text-xs">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Ketab Yar admin panel
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <AdminStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-accent block rounded-lg p-4 transition-colors border"
            >
              <div className="font-medium">📚 Manage Books</div>
              <div className="text-muted-foreground text-sm">
                Add/edit books in Sanity CMS
              </div>
            </a>
            <a
              href="/Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-accent block rounded-lg p-4 transition-colors border"
            >
              <div className="font-medium">✍️ Manage Blog</div>
              <div className="text-muted-foreground text-sm">
                Create blog posts in Sanity CMS
              </div>
            </a>
            <a
              href="/admin/users"
              className="hover:bg-accent block rounded-lg p-4 transition-colors border"
            >
              <div className="font-medium">👥 Manage Users</div>
              <div className="text-muted-foreground text-sm">
                Ban/unban, create test users
              </div>
            </a>
            <a
              href="/admin/ai-keys"
              className="hover:bg-accent block rounded-lg p-4 transition-colors border"
            >
              <div className="font-medium">🤖 AI Keys</div>
              <div className="text-muted-foreground text-sm">
                Manage Gemini API keys
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-950 dark:to-gold-900 border-gold-200 dark:border-gold-800">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">📌 Admin Panel Features</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">✅ User Management</h4>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Ban/unban users with reason tracking</li>
                <li>• Create test users with unlimited access</li>
                <li>• Make users admin or remove admin role</li>
                <li>• Export user data to CSV</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">✅ Content Management</h4>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Manage books via Sanity CMS</li>
                <li>• Create blog posts with rich editor</li>
                <li>• Manage authors and genres</li>
                <li>• All content is bilingual (EN/FA)</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">✅ Analytics & Stats</h4>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Real-time platform statistics</li>
                <li>• User growth and conversion rates</li>
                <li>• Revenue estimation</li>
                <li>• Export stats to CSV</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">✅ AI System</h4>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Manage multiple Gemini API keys</li>
                <li>• Automatic key rotation</li>
                <li>• Usage and error tracking</li>
                <li>• Fallback system for reliability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
