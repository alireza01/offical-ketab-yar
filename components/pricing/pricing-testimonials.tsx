'use client'

// Testimonials section for pricing page
// Agent 3: Social proof psychology

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const testimonials = [
    {
        name: 'سارا احمدی',
        role: 'دانشجوی مهندسی',
        avatar: '/avatars/user-1.jpg',
        rating: 5,
        text: 'کتاب‌یار واقعاً زبان انگلیسی من رو تغییر داد. الان می‌تونم کتاب‌های اصلی رو بدون مشکل بخونم. دستیار AI فوق‌العادست!',
    },
    {
        name: 'امیر حسینی',
        role: 'برنامه‌نویس',
        avatar: '/avatars/user-2.jpg',
        rating: 5,
        text: 'بهترین سرمایه‌گذاری برای یادگیری زبان. هر روز 30 دقیقه می‌خونم و نتیجه‌اش رو تو کارم می‌بینم. ارزش هر ریالش رو داره.',
    },
    {
        name: 'مریم کریمی',
        role: 'معلم زبان',
        avatar: '/avatars/user-3.jpg',
        rating: 5,
        text: 'به عنوان معلم زبان، کتاب‌یار رو به همه دانش‌آموزام پیشنهاد می‌دم. سیستم گیمیفیکیشنش عالیه و بچه‌ها عاشقشن!',
    },
]

export function PricingTestimonials() {
    return (
        <div className="py-20 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 mb-6">
                        <Quote className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        نظر کاربران ما
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        بیش از 10,000 کاربر فعال به ما اعتماد کرده‌اند
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-right flex-1">
                                        <h4 className="font-bold">{testimonial.name}</h4>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-right">
                                    "{testimonial.text}"
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex flex-wrap justify-center gap-8 items-center"
                >
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gold-600">10,000+</div>
                        <div className="text-sm text-muted-foreground">کاربر فعال</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gold-600">4.8/5</div>
                        <div className="text-sm text-muted-foreground">امتیاز کاربران</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gold-600">1,000+</div>
                        <div className="text-sm text-muted-foreground">کتاب دوزبانه</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gold-600">95%</div>
                        <div className="text-sm text-muted-foreground">رضایت کاربران</div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
