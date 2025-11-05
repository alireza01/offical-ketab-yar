'use client'

import { motion } from 'framer-motion'
import { Award, Lock, RefreshCw, Shield, Users, Zap } from 'lucide-react'

const badges = [
    {
        icon: Shield,
        title: 'پرداخت امن',
        description: 'رمزنگاری SSL',
    },
    {
        icon: RefreshCw,
        title: 'ضمانت بازگشت وجه',
        description: '7 روز',
    },
    {
        icon: Lock,
        title: 'حریم خصوصی',
        description: '100% محافظت شده',
    },
    {
        icon: Award,
        title: 'کیفیت تضمین شده',
        description: 'محتوای پرمیوم',
    },
    {
        icon: Users,
        title: '10,000+ کاربر',
        description: 'راضی و فعال',
    },
    {
        icon: Zap,
        title: 'پشتیبانی 24/7',
        description: 'همیشه در دسترس',
    },
]

export function TrustBadges() {
    return (
        <div className="py-12 border-y border-border bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600/20 to-gold-400/20 flex items-center justify-center mb-3">
                                    <Icon className="h-6 w-6 text-gold-600" />
                                </div>
                                <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
