'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const features = [
    { name: 'تعداد کتاب', free: '2-3 کتاب', premium: '1000+ کتاب' },
    { name: 'دستیار هوش مصنوعی', free: 'محدود', premium: 'نامحدود' },
    { name: 'ذخیره واژگان', free: '20 کلمه', premium: 'نامحدود' },
    { name: 'فلش کارت', free: false, premium: true },
    { name: 'دانلود آفلاین', free: false, premium: true },
    { name: 'حذف تبلیغات', free: false, premium: true },
    { name: 'پشتیبانی اولویت‌دار', free: false, premium: true },
    { name: 'گزارش‌های پیشرفته', free: false, premium: true },
    { name: 'نشان‌های ویژه', free: false, premium: true },
    { name: 'دسترسی زودهنگام', free: false, premium: true },
]

export function FeatureComparison() {
    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        مقایسه امکانات
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        ببینید با اشتراک پرمیوم چه امکاناتی به دست می‌آورید
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="overflow-hidden">
                        <div className="grid grid-cols-3 bg-muted/50 p-4 font-bold border-b">
                            <div className="text-right">امکانات</div>
                            <div className="text-center">رایگان</div>
                            <div className="text-center">
                                <Badge className="bg-gradient-to-r from-gold-600 to-gold-500">
                                    پرمیوم
                                </Badge>
                            </div>
                        </div>

                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="grid grid-cols-3 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                            >
                                <div className="text-right font-medium">{feature.name}</div>
                                <div className="text-center">
                                    {typeof feature.free === 'boolean' ? (
                                        feature.free ? (
                                            <Check className="h-5 w-5 text-green-600 mx-auto" />
                                        ) : (
                                            <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                                        )
                                    ) : (
                                        <span className="text-sm text-muted-foreground">{feature.free}</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    {typeof feature.premium === 'boolean' ? (
                                        feature.premium ? (
                                            <Check className="h-5 w-5 text-gold-600 mx-auto" />
                                        ) : (
                                            <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                                        )
                                    ) : (
                                        <span className="text-sm font-semibold text-gold-600">{feature.premium}</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
