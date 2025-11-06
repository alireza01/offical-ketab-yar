import { CompleteAnalyticsDashboard } from '@/components/admin/complete-analytics-dashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analytics | Admin | کتاب‌یار',
    description: 'Platform analytics, statistics, and CSV export',
}

export const dynamic = 'force-dynamic'

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Statistics</h1>
                <p className="text-muted-foreground">
                    Complete platform statistics with CSV export
                </p>
            </div>

            <CompleteAnalyticsDashboard />
        </div>
    )
}
