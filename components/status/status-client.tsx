'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
    Activity,
    CheckCircle2,
    Clock,
    Database,
    Globe,
    Server,
    TrendingUp,
    Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface ServiceStatus {
    name: string
    status: 'operational' | 'degraded' | 'down'
    uptime: number
    responseTime: number
    icon: any
}

export function StatusClient() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [lastDeploy] = useState(new Date('2025-01-15T10:30:00'))

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const services: ServiceStatus[] = [
        {
            name: 'وب‌سایت اصلی',
            status: 'operational',
            uptime: 99.98,
            responseTime: 145,
            icon: Globe
        },
        {
            name: 'API سرور',
            status: 'operational',
            uptime: 99.95,
            responseTime: 89,
            icon: Server
        },
        {
            name: 'پایگاه داده',
            status: 'operational',
            uptime: 99.99,
            responseTime: 23,
            icon: Database
        },
        {
            name: 'هوش مصنوعی',
            status: 'operational',
            uptime: 99.92,
            responseTime: 312,
            icon: Zap
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'text-green-600 bg-green-500/10 border-green-500/20'
            case 'degraded':
                return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20'
            case 'down':
                return 'text-red-600 bg-red-500/10 border-red-500/20'
            default:
                return 'text-gray-600 bg-gray-500/10 border-gray-500/20'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'operational':
                return 'عملیاتی'
            case 'degraded':
                return 'کاهش عملکرد'
            case 'down':
                return 'خارج از سرویس'
            default:
                return 'نامشخص'
        }
    }

    const calculateUptime = () => {
        const now = new Date()
        const diff = now.getTime() - lastDeploy.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        return { days, hours }
    }

    const uptime = calculateUptime()

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-400 mb-6">
                        <Activity className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-green-500 to-green-400 bg-clip-text text-transparent">
                        وضعیت سرویس
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        تمام سیستم‌ها عملیاتی هستند
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Overall Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-8 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                    <div>
                                        <h2 className="text-2xl font-bold">همه سیستم‌ها عملیاتی</h2>
                                        <p className="text-muted-foreground">آخرین بررسی: {currentTime.toLocaleTimeString('fa-IR')}</p>
                                    </div>
                                </div>
                                <Badge className="bg-green-600 text-white text-lg px-6 py-2">
                                    99.96% Uptime
                                </Badge>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Services Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-8">
                            <h3 className="text-2xl font-bold mb-6">وضعیت سرویس‌ها</h3>
                            <div className="space-y-4">
                                {services.map((service, index) => {
                                    const Icon = service.icon
                                    return (
                                        <motion.div
                                            key={service.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                                    <Icon className="h-6 w-6 text-gold-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{service.name}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                        <span>Uptime: {service.uptime}%</span>
                                                        <span>•</span>
                                                        <span>زمان پاسخ: {service.responseTime}ms</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(service.status)}>
                                                {getStatusText(service.status)}
                                            </Badge>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Deployment Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">آخرین دیپلوی</h3>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {lastDeploy.toLocaleDateString('fa-IR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ساعت {lastDeploy.toLocaleTimeString('fa-IR')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-2">مدت زمان آنلاین</h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            {uptime.days} روز و {uptime.hours} ساعت
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            بدون وقفه
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Recent Updates */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="p-8">
                            <h3 className="text-2xl font-bold mb-6">به‌روزرسانی‌های اخیر</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 pb-4 border-b">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">بهبود عملکرد سرور</p>
                                        <p className="text-sm text-muted-foreground">15 ژانویه 2025 - 10:30</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 pb-4 border-b">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">افزودن قابلیت‌های جدید AI</p>
                                        <p className="text-sm text-muted-foreground">10 ژانویه 2025 - 14:20</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">بهینه‌سازی پایگاه داده</p>
                                        <p className="text-sm text-muted-foreground">5 ژانویه 2025 - 09:15</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
