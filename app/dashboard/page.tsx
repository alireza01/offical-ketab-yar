import { DashboardClient } from '@/components/dashboard/dashboard-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'داشبورد | کتاب‌یار',
  description: 'داشبورد مطالعه شما - پیشرفت، استریک و دستاوردهای شما',
}

// Pure CSR for dashboard (Agent 2: Zero server load)
export default function DashboardPage() {
  return <DashboardClient />
}
