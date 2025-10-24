'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Check, Crown, Flame, Gift, Rocket, Sparkles, Star, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface PricingPlan {
    id: string
    name: string
    price: number
    originalPrice?: number
    duration: string
    months: number
    description: string
    features: string[]
    icon: any
    color: string
    bgGradient: string
    badge?: string
    savings?: string
}

export function PricingClient() {
    const plans: PricingPlan[] = [
        {
            id: 'free',
            name: 'رایگان',
            price: 0,
            duration: '1 روز',
            months: 0,
            description: 'برای شروع و آشنایی',
            icon: Gift,
            color: 'text-gray-600',
            bgGradient: 'from-gray-500/10 to-gray-600/10',
            features: ['دسترسی 1 روزه', 'خواندن کتاب', 'دستیار هوش مصنوعی', 'ذخیره واژگان']
        },
        {
            id: 'monthly',
            name: 'ماهانه',
            price: 299000,
            duration: '1 ماه',
            months: 1,
            description: 'برای شروع',
            icon: Star,
            color: 'text-purple-600',
            bgGradient: 'from-purple-500/10 to-purple-600/10',
            features: ['تمام امکانات پرمیوم', 'خواندن نامحدود', 'دستیار AI پیشرفته', 'پشتیبانی 24/7']
        },
        {
            id: 'quarterly',
            name: '3 ماهه',
            price: 799000,
            originalPrice: 897000,
            duration: '3 ماه',
            months: 3,
            description: 'بهترین ارزش - محبوب‌ترین!',
            icon: Crown,
            color: 'text-gold-600',
            bgGradient: 'from-gold-500/10 to-gold-600/10',
            badge: '🔥 پرفروش‌ترین',
            savings: '98,000 تومان',
            features: ['تمام امکانات پرمیوم', '11% تخفیف ویژه', 'دسترسی زودهنگام', 'پشتیبانی VIP', 'گزارش‌های پیشرفته', 'هدایای ویژه', 'بدون تبلیغات', 'نشان ویژه']
        },
        {
            id: 'annual',
            name: 'سالانه',
            price: 2499000,
            originalPrice: 3588000,
            duration: '1 سال',
            months: 12,
            description: 'حداکثر صرفه‌جویی',
            icon: Rocket,
            color: 'text-emerald-600',
            bgGradient: 'from-emerald-500/10 to-emerald-600/10',
            badge: '30% تخفیف',
            savings: '1,089,000 تومان',
            features: ['تمام امکانات 3 ماهه', '30% تخفیف ویژه', 'نشان VIP طلایی', 'پشتیبانی اختصاصی', 'جلسات مشاوره', 'ضمانت بازگشت وجه']
        }
    ]

    const getMonthlyPrice = (price: number, months: number) => {
        if (months === 0) return 0
        return Math.round(price / months)
    }

    const handleSubscribe = (planId: string) => {
        toast.success('در حال انتقال به درگاه پرداخت...')
    }

    const featuredPlan = plans.find(p => p.id === 'quarterly')!

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 mb-6 shadow-2xl shadow-gold-500/30">
                        <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 bg-clip-text text-transparent">
                        پلن مناسب خود را انتخاب کنید
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        با کتاب‌یار، یادگیری زبان انگلیسی را تجربه‌ای لذت‌بخش کنید
                    </p>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
                        <Badge className="bg-gradient-to-r from-gold-600 to-gold-500 text-white text-base px-6 py-2 shadow-lg">
                            <Gift className="ml-2 h-4 w-4" />
                            1 روز رایگان برای همه کاربران جدید
                        </Badge>
                    </motion.div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="mb-16">
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute -inset-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 rounded-3xl blur-xl opacity-20 animate-pulse" />
                        <Card className="relative border-2 border-gold-500 shadow-2xl shadow-gold-500/20 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-gold-600/5 to-gold-400/5" />
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                                <Badge className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-2 text-base shadow-xl">
                                    <Flame className="ml-2 h-5 w-5" />
                                    {featuredPlan.badge}
                                </Badge>
                            </div>
                            <div className="relative p-10">
                                <div className="grid md:grid-cols-2 gap-10 items-center">
                                    <div className="text-center md:text-right">
                                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center shadow-xl">
                                                <Crown className="h-10 w-10 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-4xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
                                                    پلن 3 ماهه
                                                </h2>
                                                <p className="text-base text-muted-foreground">بهترین ارزش</p>
                                            </div>
                                        </div>
                                        <div className="mb-8">
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                                <span className="text-lg text-muted-foreground line-through">
                                                    {featuredPlan.originalPrice?.toLocaleString('fa-IR')} تومان
                                                </span>
                                                <Badge variant="destructive" className="text-sm px-3 py-1">11% تخفیف</Badge>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex items-baseline justify-center md:justify-start gap-2">
                                                    <span className="text-6xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
                                                        {getMonthlyPrice(featuredPlan.price, featuredPlan.months).toLocaleString('fa-IR')}
                                                    </span>
                                                    <div className="flex flex-col text-right">
                                                        <span className="text-xl text-muted-foreground">تومان</span>
                                                        <span className="text-sm text-muted-foreground">در ماه</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-base text-muted-foreground mb-3 text-center md:text-right">
                                                قیمت کل: <span className="font-bold">{featuredPlan.price.toLocaleString('fa-IR')} تومان</span>
                                            </p>
                                            <p className="text-base text-gold-600 font-bold text-center md:text-right">
                                                💰 صرفه‌جویی {featuredPlan.savings}
                                            </p>
                                        </div>
                                        <Button onClick={() => handleSubscribe('quarterly')} size="lg" className="w-full h-14 text-lg bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white shadow-xl shadow-gold-500/30 hover:shadow-gold-500/50 transition-all">
                                            <Rocket className="ml-2 h-5 w-5" />
                                            همین الان خرید کنید
                                        </Button>
                                        <p className="text-center md:text-right text-sm text-muted-foreground mt-4">
                                            ⚡ فعال‌سازی فوری پس از پرداخت
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-6 text-center md:text-right">✨ امکانات ویژه</h3>
                                        <ul className="space-y-3">
                                            {featuredPlan.features.map((feature, i) => (
                                                <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Check className="h-4 w-4 text-gold-600" />
                                                    </div>
                                                    <span className="text-base text-right">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.filter(p => p.id !== 'quarterly').map((plan, index) => {
                        const Icon = plan.icon
                        const monthlyPrice = plan.months > 0 ? getMonthlyPrice(plan.price, plan.months) : 0
                        return (
                            <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="flex">
                                <Card className="relative overflow-hidden w-full hover:border-gold-500/50 transition-all duration-300 hover:shadow-lg flex flex-col">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} opacity-50`} />
                                    <div className="relative p-8 flex flex-col flex-grow">
                                        <div className="text-center mb-6">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.bgGradient} flex items-center justify-center mx-auto mb-4`}>
                                                <Icon className={`h-8 w-8 ${plan.color}`} />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                                        </div>
                                        {plan.badge && (
                                            <div className="text-center mb-4">
                                                <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-1">{plan.badge}</Badge>
                                            </div>
                                        )}
                                        <div className="text-center mb-8">
                                            {plan.originalPrice && (
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <span className="text-base text-muted-foreground line-through">{plan.originalPrice.toLocaleString('fa-IR')}</span>
                                                    <Badge variant="destructive" className="text-xs">{plan.savings}</Badge>
                                                </div>
                                            )}
                                            {plan.price === 0 ? (
                                                <div className="text-5xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">رایگان</div>
                                            ) : (
                                                <>
                                                    <div className="flex items-baseline justify-center gap-2 mb-1">
                                                        <span className="text-5xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
                                                            {monthlyPrice.toLocaleString('fa-IR')}
                                                        </span>
                                                        <div className="flex flex-col items-start">
                                                            <span className="text-base text-muted-foreground">تومان</span>
                                                            {plan.months > 1 && <span className="text-sm text-muted-foreground">در ماه</span>}
                                                        </div>
                                                    </div>
                                                    {plan.months > 1 && (
                                                        <p className="text-sm text-muted-foreground">قیمت کل: {plan.price.toLocaleString('fa-IR')} تومان</p>
                                                    )}
                                                </>
                                            )}
                                            <p className="text-sm text-muted-foreground mt-2">{plan.duration}</p>
                                        </div>
                                        <ul className="space-y-3 mb-8 flex-grow">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <Check className={`h-5 w-5 ${plan.color} flex-shrink-0 mt-0.5`} />
                                                    <span className="text-right">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button onClick={() => handleSubscribe(plan.id)} className="w-full" size="lg" variant={plan.id === 'annual' ? 'default' : 'outline'}>
                                            {plan.price === 0 ? 'شروع رایگان' : 'خرید اشتراک'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-20 max-w-4xl mx-auto">
                    <Card className="p-8 bg-gradient-to-br from-gold-500/5 to-gold-600/5 border-gold-500/20">
                        <h2 className="text-3xl font-bold text-center mb-8">چرا کتاب‌یار؟</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="h-8 w-8 text-gold-600" />
                                </div>
                                <h3 className="font-bold mb-2">هوش مصنوعی پیشرفته</h3>
                                <p className="text-sm text-muted-foreground">دستیار AI با Gemini 2.5 Flash</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Crown className="h-8 w-8 text-gold-600" />
                                </div>
                                <h3 className="font-bold mb-2">کتابخانه گسترده</h3>
                                <p className="text-sm text-muted-foreground">هزاران کتاب با ترجمه فارسی</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Zap className="h-8 w-8 text-gold-600" />
                                </div>
                                <h3 className="font-bold mb-2">یادگیری هوشمند</h3>
                                <p className="text-sm text-muted-foreground">فلش کارت و کوییز هوشمند</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-16 text-center">
                    <p className="text-muted-foreground mb-4">سوالی دارید؟</p>
                    <Button variant="outline" size="lg" asChild>
                        <a href="/help">مشاهده سوالات متداول</a>
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
