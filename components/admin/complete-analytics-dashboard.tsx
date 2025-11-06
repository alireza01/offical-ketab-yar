'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPlatformStats } from '@/lib/supabase/admin-actions'
import {
    BookOpen,
    Download,
    Shield,
    TrendingUp,
    UserCheck,
    UserX,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface PlatformStats {
    totalUsers: number
    adminUsers: number
    testUsers: number
    bannedUsers: number
    premiumUsers: number
    activeUsers: number
}

export function CompleteAnalyticsDashboard() {
    const [stats, setStats] = useState<PlatformStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    async function fetchStats() {
        try {
            setLoading(true)
            const data = await getPlatformStats()
            setStats(data)
        } catch (error) {
            console.error('Error fetching stats:', error)
            toast.error('Failed to load statistics')
        } finally {
            setLoading(false)
        }
    }

    async function exportStats() {
        if (!stats) return

        const csvContent = [
            ['Metric', 'Value'],
            ['Total Users', stats.totalUsers],
            ['Admin Users', stats.adminUsers],
            ['Test Users', stats.testUsers],
            ['Banned Users', stats.bannedUsers],
            ['Premium Users', stats.premiumUsers],
            ['Active Users (30d)', stats.activeUsers],
            ['Free Users', stats.totalUsers - stats.premiumUsers],
            ['Premium Conversion Rate', `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(2)}%`],
        ]
            .map(row => row.join(','))
            .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `platform-stats-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        toast.success('Statistics exported successfully')
    }

    if (loading) {
        return <div className="text-center py-8">Loading statistics...</div>
    }

    if (!stats) {
        return <div className="text-center py-8 text-muted-foreground">No data available</div>
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            description: 'All registered users',
            color: 'text-blue-600',
        },
        {
            title: 'Active Users (30d)',
            value: stats.activeUsers.toLocaleString(),
            icon: TrendingUp,
            description: 'Users active in last 30 days',
            color: 'text-green-600',
        },
        {
            title: 'Premium Users',
            value: stats.premiumUsers.toLocaleString(),
            icon: UserCheck,
            description: `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% conversion rate`,
            color: 'text-gold-600',
        },
        {
            title: 'Admin Users',
            value: stats.adminUsers.toLocaleString(),
            icon: Shield,
            description: 'Platform administrators',
            color: 'text-purple-600',
        },
        {
            title: 'Test Users',
            value: stats.testUsers.toLocaleString(),
            icon: BookOpen,
            description: 'Test accounts with unlimited access',
            color: 'text-orange-600',
        },
        {
            title: 'Banned Users',
            value: stats.bannedUsers.toLocaleString(),
            icon: UserX,
            description: 'Suspended accounts',
            color: 'text-red-600',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Export Button */}
            <div className="flex justify-end">
                <Button onClick={exportStats} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Statistics (CSV)
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-5 w-5 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Additional Metrics */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Free Users</span>
                                <span className="font-bold">{(stats.totalUsers - stats.premiumUsers).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Premium Users</span>
                                <span className="font-bold text-gold-600">{stats.premiumUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                                <span className="font-bold">
                                    {((stats.premiumUsers / stats.totalUsers) * 100).toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Active Users</span>
                                <span className="font-bold text-green-600">{stats.activeUsers.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Inactive Users</span>
                                <span className="font-bold text-orange-600">
                                    {(stats.totalUsers - stats.activeUsers).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Banned Users</span>
                                <span className="font-bold text-red-600">{stats.bannedUsers.toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Estimation (if premium users exist) */}
            {stats.premiumUsers > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Estimation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Monthly (avg $9.99)</p>
                                <p className="text-2xl font-bold text-gold-600">
                                    ${(stats.premiumUsers * 9.99).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Quarterly (avg $24.99)</p>
                                <p className="text-2xl font-bold text-gold-600">
                                    ${(stats.premiumUsers * 24.99).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Annual (avg $89.99)</p>
                                <p className="text-2xl font-bold text-gold-600">
                                    ${(stats.premiumUsers * 89.99).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Card */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">📊 Analytics Information</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Statistics are updated in real-time</li>
                        <li>• Active users = users who logged in within last 30 days</li>
                        <li>• Test users have unlimited premium features but cannot access admin panel</li>
                        <li>• Export CSV to analyze data in Excel or Google Sheets</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
