import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { createServerClient } from '@/lib/supabase/server'
import { BookOpen, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function getAdminStats() {
  const supabase = await createServerClient()

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
        <h1 className="text-3xl font-bold tracking-tight">پنل مدیریت</h1>
        <p className="text-muted-foreground">
          خوش آمدید به پنل مدیریت کتاب‌یار
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <AdminStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>فعالیت‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              سیستم ردیابی فعالیت به زودی اضافه می‌شود...
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>دسترسی سریع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/books/new"
              className="hover:bg-accent block rounded-lg p-3 transition-colors"
            >
              <div className="font-medium">افزودن کتاب جدید</div>
              <div className="text-muted-foreground text-sm">
                انتشار کتاب جدید در کتابخانه
              </div>
            </a>
            <a
              href="/admin/books"
              className="hover:bg-accent block rounded-lg p-3 transition-colors"
            >
              <div className="font-medium">مدیریت کتاب‌ها</div>
              <div className="text-muted-foreground text-sm">
                مشاهده و ویرایش تمام کتاب‌ها
              </div>
            </a>
            <div className="hover:bg-accent/50 block rounded-lg p-3 opacity-50 cursor-not-allowed">
              <div className="font-medium">مدیریت کاربران</div>
              <div className="text-muted-foreground text-sm">
                فاز ۲ - به زودی
              </div>
            </div>
            <div className="hover:bg-accent/50 block rounded-lg p-3 opacity-50 cursor-not-allowed">
              <div className="font-medium">آنالیتیکس</div>
              <div className="text-muted-foreground text-sm">
                فاز ۲ - به زودی
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
