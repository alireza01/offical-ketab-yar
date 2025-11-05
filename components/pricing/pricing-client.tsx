"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'

interface PricingClientProps {
    currentSubscription: {
        subscription_tier: string
        subscription_expires_at: string | null
        name: string
    } | null
}

export function PricingClient({ currentSubscription }: PricingClientProps) {
    const plans = [
        {
            name: 'رایگان',
            price: '0',
            period: 'برای همیشه',
            features: [
                '2-3 کتاب رایگان',
                'حداکثر 20 کلمه در لیست واژگان',
                'دسترسی به ویژگی‌های پایه',
                'سیستم XP و استریک'
            ],
            tier: 'free',
            highlighted: false
        },
        {
            name: 'ماهانه',
            price: '266,000',
            period: 'در ماه',
            features: [
                'دسترسی نامحدود به تمام کتاب‌ها',
                'واژگان نامحدود',
                'دستیار هوش مصنوعی',
                'فلش‌کارت پیشرفته',
                'آزمون‌های هوشمند',
                'دانلود آفلاین'
            ],
            tier: 'monthly',
            highlighted: true
        },
        {
            name: '3 ماهه',
            price: '720,000',
            period: 'هر 3 ماه',
            originalPrice: '798,000',
            discount: '10%',
            features: [
                'تمام ویژگی‌های پرمیوم',
                '10% تخفیف',
                'پشتیبانی اولویت‌دار'
            ],
            tier: 'quarterly',
            highlighted: false
        },
        {
            name: 'سالانه',
            price: '2,660,000',
            period: 'در سال',
            originalPrice: '3,192,000',
            discount: '17%',
            features: [
                'تمام ویژگی‌های پرمیوم',
                '17% تخفیف',
                'پشتیبانی VIP',
                'دسترسی زودهنگام به ویژگی‌های جدید'
            ],
            tier: 'yearly',
            highlighted: false
        }
    ]

    const currentTier = currentSubscription?.subscription_tier || 'free'

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">قیمت‌گذاری کتاب‌یار</h1>
                <p className="text-xl text-muted-foreground">
                    پلن مناسب خود را انتخاب کنید و یادگیری را شروع کنید
                </p>
            </div>

            {currentSubscription && currentTier !== 'free' && (
                <Card className="mb-8 border-[#D4AF37]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">اشتراک فعلی شما</p>
                                <p className="text-2xl font-bold">
                                    {plans.find(p => p.tier === currentTier)?.name}
                                </p>
                            </div>
                            {currentSubscription.subscription_expires_at && (
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">تاریخ انقضا</p>
                                    <p className="font-semibold">
                                        {new Date(currentSubscription.subscription_expires_at).toLocaleDateString('fa-IR')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.tier}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className={`relative ${plan.highlighted
                                    ? 'border-[#D4AF37] shadow-lg scale-105'
                                    : 'border-[#D4AF37]/20'
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8956A] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <Crown className="w-4 h-4" />
                                        محبوب‌ترین
                                    </div>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-center">
                                    <div className="mb-2">{plan.name}</div>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-sm text-muted-foreground">تومان</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {plan.period}
                                    </div>
                                    {plan.originalPrice && (
                                        <div className="text-sm text-muted-foreground line-through mt-1">
                                            {plan.originalPrice} تومان
                                        </div>
                                    )}
                                    {plan.discount && (
                                        <div className="text-sm text-green-500 font-semibold mt-1">
                                            {plan.discount} تخفیف
                                        </div>
                                    )}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full ${plan.highlighted
                                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8956A] hover:from-[#C9A961] hover:to-[#D4AF37]'
                                            : ''
                                        }`}
                                    variant={plan.highlighted ? 'default' : 'outline'}
                                    disabled={currentTier === plan.tier}
                                >
                                    {currentTier === plan.tier
                                        ? 'پلن فعلی'
                                        : plan.tier === 'free'
                                            ? 'پلن فعلی'
                                            : 'خرید اشتراک'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                    سوالی دارید؟{' '}
                    <a href="/support" className="text-[#D4AF37] hover:underline">
                        با ما تماس بگیرید
                    </a>
                </p>
            </div>
        </div>
    )
}
