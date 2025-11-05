'use client'

// Feature comparison table
// Agent 3: Clear value proposition

import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const features = [
    { name: 'تعداد کتاب‌های قابل خواندن', free: '3 کتاب', premium: 'نامحدود' },
    { name: 'دستیار هوش مصنوعی', free: 'محدود', premium: 'نامحدود' },
    { name: 'ذخیره واژگان', free: '20 کلمه', premium: 'نامحدود' },
    { name: 'فلش کارت هوشمند', free: false, premium: true },
    { name: 'کوییز و تمرین', free: 'محدود', premium: 'نامحدود' },
    { name: 'دانلود آفلاین', free: false, premium: true },
    { name: 'حذف تبلیغات', free: false, premium: true },
    { name: 'گزارش پیشرفت پیشرفته', free: false, premium: true },
    { name: 'پشتیبانی اولویت‌دار', free: false, premium: true },
    { name: 'دسترسی زودهنگام به کتاب‌های جدید', free: false, premium: true },
    { name: 'نشان‌های ویژه', free: false, premium: true },
    { name: 'رقابت در لیگ‌ها', free: 'محدود', premium: 'کامل' },
]

export function PricingComparison() {
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
                        ببینید با پرمیوم چه امکاناتی به دست می‌آورید
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
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-right p-6 font-bold text-lg">امکانات</th>
                                        <th className="text-center p-6 font-bold text-lg bg-muted/30">رایگان</th>
                                        <th className="text-center p-6 font-bold text-lg bg-gradient-to-br from-gold-500/10 to-gold-600/10">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-gold-600">پرمیوم</span>
                                                <span className="text-xs bg-gold-600 text-white px-2 py-1 rounded-full">توصیه می‌شود</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((feature, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="p-4 text-right font-medium">{feature.name}</td>
                                            <td className="p-4 text-center bg-muted/10">
                                                {typeof feature.free === 'boolean' ? (
                                                    feature.free ? (
                                                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground">{feature.free}</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center bg-gradient-to-br from-gold-500/5 to-gold-600/5">
                                                {typeof feature.premium === 'boolean' ? (
                                                    feature.premium ? (
                                                        <Check className="h-5 w-5 text-gold-600 mx-auto" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                                    )
                                                ) : (
                                                    <span className="font-bold text-gold-600">{feature.premium}</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
