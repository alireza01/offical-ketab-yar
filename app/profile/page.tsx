import { Skeleton } from '@/components/ui/skeleton'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Agent 2 (Performance): Convert to CSR with dynamic imports
const ProfileClient = dynamic(() => import('@/components/profile/profile-client'), {
  loading: () => <ProfileSkeleton />,
})

// Agent 1 (SEO): Block from search engines
export const metadata: Metadata = {
  title: 'پروفایل من | کتاب‌یار',
  description: 'مشاهده و ویرایش پروفایل، آمار مطالعه و دستاوردها',
  robots: {
    index: false,
    follow: false,
  },
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-6">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileClient />
    </Suspense>
  )
}
