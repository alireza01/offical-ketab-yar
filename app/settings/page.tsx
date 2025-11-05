import { Skeleton } from '@/components/ui/skeleton'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Agent 2 (Performance): Convert to CSR with dynamic imports
const SettingsClient = dynamic(() => import('@/components/settings/settings-client'), {
  loading: () => <SettingsSkeleton />,
})

// Agent 1 (SEO): Block from search engines
export const metadata: Metadata = {
  title: 'تنظیمات | کتاب‌یار',
  description: 'تنظیمات خواندن، اعلان‌ها و حریم خصوصی',
  robots: {
    index: false,
    follow: false,
  },
}

function SettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-12 w-full max-w-md" />
      <Skeleton className="h-96 w-full max-w-4xl" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsClient />
    </Suspense>
  )
}
