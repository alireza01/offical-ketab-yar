'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'

// Agent 3 (Psychology): Strong CTA with FOMO and social proof
export function AboutCTA() {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Agent 2: GPU-optimized background animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-gold-400/5 to-transparent" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            {/* Floating elements - Agent 2: transform only */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-10 left-10 w-20 h-20 bg-gold-500/10 rounded-full blur-xl will-change-transform"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl will-change-transform"
            />

            <div className="container relative mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Agent 3: Urgency badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-sm font-medium mb-6 border border-gold-500/20"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>۵۰ امتیاز هدیه برای کاربران جدید</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 bg-clip-text text-transparent">
                            آماده شروع سفر یادگیری
                        </span>
                        <br />
                        <span className="text-foreground">هستید؟</span>
                    </h2>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        به بیش از <strong className="text-foreground">۱۰,۰۰۰ خواننده</strong> بپیوندید که هر روز با کتاب‌یار زبان انگلیسی خود را تقویت می‌کنند
                    </p>

                    {/* Agent 3: Clear primary and secondary CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white shadow-xl shadow-gold-500/30 border-0 h-14 px-8 text-lg font-semibold group"
                        >
                            <Link href="/auth/register">
                                <BookOpen className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                شروع رایگان
                                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-lg font-semibold border-2 hover:bg-accent"
                        >
                            <Link href="/library">
                                مشاهده کتاب‌ها
                            </Link>
                        </Button>
                    </div>

                    {/* Agent 3: Trust signals */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span>بدون نیاز به کارت اعتباری</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span>لغو در هر زمان</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span>پشتیبانی ۲۴/۷</span>
                        </div>
                    </div>

                    {/* Agent 3: Social proof with avatars */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex flex-col items-center gap-4"
                    >
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-12 h-12 rounded-full border-4 border-background bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold"
                                >
                                    {String.fromCharCode(65 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">۲۳۴</strong> نفر امروز به ما پیوستند
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
