import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Analytics | Admin | کتاب‌یار',
    description: 'Platform analytics and insights',
}

export const dynamic = 'force-dynamic'

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Platform statistics, user behavior, and performance metrics
                </p>
            </div>

            <AnalyticsDashboard />
        </div>
    )
}
