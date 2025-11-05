'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

const faqs = [
    {
        question: 'آیا می‌توانم قبل از خرید امتحان کنم؟',
        answer: 'بله! شما می‌توانید 1 روز کامل به صورت رایگان از تمام امکانات پرمیوم استفاده کنید. نیازی به کارت اعتباری نیست.',
    },
    {
        question: 'آیا می‌توانم اشتراک را لغو کنم؟',
        answer: 'بله، می‌توانید هر زمان که بخواهید اشتراک خود را لغو کنید. تا پایان دوره پرداخت شده، به تمام امکانات دسترسی خواهید داشت.',
    },
    {
        question: 'چه روش‌های پرداختی پشتیبانی می‌شود؟',
        answer: 'ما از تمام کارت‌های بانکی ایرانی و درگاه‌های پرداخت معتبر پشتیبانی می‌کنیم. پرداخت کاملاً امن و رمزنگاری شده است.',
    },
    {
        question: 'آیا ضمانت بازگشت وجه دارید؟',
        answer: 'بله! اگر در 7 روز اول از خرید خود راضی نبودید، کل مبلغ را بدون هیچ سوالی بازگردانیم.',
    },
    {
        question: 'چند کتاب در دسترس است؟',
        answer: 'بیش از 1000 کتاب انگلیسی با ترجمه فارسی در دسترس است و هر هفته کتاب‌های جدید اضافه می‌شود.',
    },
    {
        question: 'آیا می‌توانم در چند دستگاه استفاده کنم؟',
        answer: 'بله، می‌توانید با یک اشتراک در تمام دستگاه‌های خود (موبایل، تبلت، کامپیوتر) استفاده کنید.',
    },
    {
        question: 'تفاوت پلن‌ها در چیست؟',
        answer: 'تمام پلن‌ها دسترسی کامل به همه امکانات را دارند. تفاوت فقط در مدت زمان و میزان تخفیف است. پلن سالانه بیشترین تخفیف (30%) را دارد.',
    },
    {
        question: 'آیا هزینه مخفی دارد؟',
        answer: 'خیر! قیمتی که می‌بینید همان قیمت نهایی است. هیچ هزینه مخفی یا اضافی وجود ندارد.',
    },
]

export function PricingFAQ() {
    return (
        <div className="py-20 bg-gradient-to-b from-muted/30 to-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 mb-6">
                        <HelpCircle className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        سوالات متداول
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        پاسخ سوالات رایج درباره اشتراک و قیمت‌گذاری
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <Card className="p-8">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-right hover:text-gold-600">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
