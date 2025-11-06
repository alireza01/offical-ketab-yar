import { DashboardEnhanced } from '@/components/dashboard/dashboard-enhanced'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'داشبورد | کتاب‌یار',
  description: 'داشبورد مطالعه شما - پیشرفت، استریک و دستاوردهای شما',
  robots: {
    index: false, // Agent 1: Block from Google
    follow: false
  }
}

// Pure CSR for dashboard (Agent 2: Zero server load)
// Component is already client-side ('use client' in dashboard-enhanced.tsx)
export default function DashboardPage() {
  return <DashboardEnhanced />
}
