'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    BookOpen,
    Clock,
    DollarSign,
    Eye,
    TrendingUp,
    Users
} from 'lucide-react'

// TODO: Fetch real analytics data
const mockAnalytics = {
    totalUsers: 10234,
    activeUsers: 3421,
    totalBooks: 1247,
    totalRevenue: 45678,
    avgSessionTime: '24m 32s',
    pageViews: 156789,
}

export function AnalyticsDashboard() {
    const stats = [
        {
            title: 'Total Users',
            value: mockAnalytics.totalUsers.toLocaleString(),
            icon: Users,
            change: '+12.5%',
            trend: 'up',
        },
        {
            title: 'Active Users (30d)',
            value: mockAnalytics.activeUsers.toLocaleString(),
            icon: TrendingUp,
            change: '+8.2%',
            trend: 'up',
        },
        {
            title: 'Total Books',
            value: mockAnalytics.totalBooks.toLocaleString(),
            icon: BookOpen,
            change: '+23',
            trend: 'up',
        },
        {
            title: 'Revenue (Monthly)',
            value: `$${mockAnalytics.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            change: '+15.3%',
            trend: 'up',
        },
        {
            title: 'Avg Session Time',
            value: mockAnalytics.avgSessionTime,
            icon: Clock,
            change: '+2m 15s',
            trend: 'up',
        },
        {
            title: 'Page Views',
            value: mockAnalytics.pageViews.toLocaleString(),
            icon: Eye,
            change: '+18.7%',
            trend: 'up',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <span className="text-green-600">{stat.change}</span> from last month
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Charts Placeholder */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Chart coming soon (use Recharts)
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Chart coming soon (use Recharts)
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Books */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Books</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Book Title {i}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {Math.floor(Math.random() * 1000)} readers
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{Math.floor(Math.random() * 100)}%</p>
                                    <p className="text-sm text-muted-foreground">completion</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* TODO: Add real charts with Recharts, export functionality, date range picker */}
        </div>
    )
}
