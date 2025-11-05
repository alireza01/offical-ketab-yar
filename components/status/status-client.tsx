'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

const services = [
    {
        name: 'وب‌سایت اصلی',
        status: 'operational',
        uptime: '99.98%',
        responseTime: '142ms'
    },
    {
        name: 'API سرور',
        status: 'operational',
        uptime: '99.96%',
        responseTime: '89ms'
    },
    {
        name: 'پایگاه داده',
        status: 'operational',
        uptime: '99.99%',
        responseTime: '12ms'
    },
    {
        name: 'هوش مصنوعی (Gemini)',
        status: 'operational',
        uptime: '99.94%',
        responseTime: '1.2s'
    },
    {
        name: 'ذخیره‌سازی فایل',
        status: 'operational',
        uptime: '99.97%',
        responseTime: '234ms'
    },
    {
        name: 'احراز هویت',
        status: 'operational',
        uptime: '99.95%',
        responseTime: '156ms'
    }
]

const incidents = [
    {
        date: '2025-01-15',
        title: 'کندی موقت در سرویس AI',
        description: 'به دلیل ترافیک بالا، سرویس هوش مصنوعی با کندی مواجه شد. مشکل در 12 دقیقه برطرف شد.',
        status: 'resolved',
        duration: '12 دقیقه'
    }
]

const StatusBadge = ({ status }: { status: string }) => {
    const config = {
        operational: {
            icon: CheckCircle2,
            label: 'عملیاتی',
            variant: 'default' as const,
            className: 'bg-green-500/10 text-green-700 border-green-500/20'
        },
        degraded: {
            icon: AlertCircle,
            label: 'کندی',
            variant: 'secondary' as const,
            className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
        },
        outage: {
            icon: AlertCircle,
            label: 'قطعی',
            variant: 'destructive' as const,
            className: 'bg-red-500/10 text-red-700 border-red-500/20'
        }
    }

    const { icon: Icon, label, className } = config[status as keyof typeof config] || config.operational

    return (
        <Badge variant="outline" className={className}>
            <Icon className="h-3 w-3 ml-1" />
            {label}
        </Badge>
    )
}

export function StatusClient() {
    const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 'degraded'

    return (
        <div className="container max-w-5xl py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">وضعیت سرویس</h1>
                <div className="flex items-center justify-center gap-2">
                    {overallStatus === 'operational' ? (
                        <>
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <p className="text-xl text-green-600 font-semibold">
                                تمام سیستم‌ها عملیاتی هستند
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                            <p className="text-xl text-yellow-600 font-semibold">
                                برخی سرویس‌ها با کندی مواجه هستند
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>آپتایم کلی</CardDescription>
                        <CardTitle className="text-3xl text-green-600">99.96%</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>زمان پاسخ میانگین</CardDescription>
                        <CardTitle className="text-3xl">156ms</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>مانیتورینگ</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <Clock className="h-6 w-6" />
                            24/7
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Services Status */}
            <Card>
                <CardHeader>
                    <CardTitle>وضعیت سرویس‌ها</CardTitle>
                    <CardDescription>
                        مانیتورینگ لحظه‌ای تمام سرویس‌های کتاب‌یار
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {services.map((service) => (
                        <div
                            key={service.name}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="space-y-1">
                                <h3 className="font-semibold">{service.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>آپتایم: {service.uptime}</span>
                                    <span>زمان پاسخ: {service.responseTime}</span>
                                </div>
                            </div>
                            <StatusBadge status={service.status} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card>
                <CardHeader>
                    <CardTitle>رویدادهای اخیر</CardTitle>
                    <CardDescription>
                        تاریخچه مشکلات و قطعی‌های سرویس
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {incidents.length > 0 ? (
                        <div className="space-y-4">
                            {incidents.map((incident, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg border bg-card space-y-2"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold">{incident.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {incident.description}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                                            برطرف شده
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{incident.date}</span>
                                        <span>مدت: {incident.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            هیچ رویداد قابل توجهی در 30 روز گذشته ثبت نشده است
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Subscribe to Updates */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>اطلاع از وضعیت سرویس</CardTitle>
                    <CardDescription>
                        برای دریافت اطلاعیه‌های وضعیت سرویس، ایمیل خود را وارد کنید
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
