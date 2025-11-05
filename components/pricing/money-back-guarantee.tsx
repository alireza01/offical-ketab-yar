'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react'
import Link from 'next/link'

export function MoneyBackGuarantee() {
    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-gold-600/5" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-600/10 rounded-full blur-3xl" />

                        <div className="relative p-8 md:p-12">
                            <div className="grid md:grid-cols-[auto,1fr] gap-8 items-center">
                                {/* Icon */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="flex justify-center md:justify-start"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gold-500/30 rounded-full blur-2xl" />
                                        <div className="relative w-24 h-24 bg-gradient-to-br from-gold-600 to-gold-400 rounded-full flex items-center justify-center shadow-2xl">
                                            <Shield className="h-12 w-12 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <div className="text-center md:text-right">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                        ضمانت 100% بازگشت وجه
                                    </h2>
                                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                        اگر در 7 روز اول از خرید خود راضی نبودید، کل مبلغ را بدون هیچ سوال و شرطی بازمی‌گردانیم.
                                        ما به کیفیت محصولمان اطمینان کامل داریم.
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <span className="text-sm">بدون سوال</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <span className="text-sm">بازگشت سریع</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            <span className="text-sm">100% تضمین</span>
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 shadow-lg shadow-gold-500/30"
                                        asChild
                                    >
                                        <Link href="#plans">
                                            شروع رایگان
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
