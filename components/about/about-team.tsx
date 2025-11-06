'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Users } from 'lucide-react'
import Link from 'next/link'

export function AboutTeam() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">تیم</span>
            {' '}
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              کتاب‌یار
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            گروهی از متخصصان پرشور که به ایجاد بهترین تجربه مطالعه برای شما متعهد هستند
          </p>
        </motion.div>

        {/* Team Values */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {[
            {
              icon: Users,
              title: 'تیم متنوع',
              description: 'متخصصان در زمینه‌های مختلف از توسعه نرم‌افزار تا طراحی UX و آموزش زبان',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: MessageCircle,
              title: 'ارتباط شفاف',
              description: 'همیشه آماده شنیدن نظرات، پیشنهادات و انتقادات سازنده شما هستیم',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: Mail,
              title: 'پشتیبانی سریع',
              description: 'تیم پشتیبانی ما 24/7 آماده پاسخگویی به سوالات و حل مشکلات شماست',
              color: 'from-amber-500 to-orange-500'
            }
          ].map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 overflow-hidden text-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="relative space-y-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-gold-600 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/20 overflow-hidden text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.1),transparent_70%)]" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                  می‌خواهید با ما در ارتباط باشید؟
                </h3>
                <p className="text-muted-foreground text-lg mb-6">
                  سوال، پیشنهاد یا انتقادی دارید؟ ما همیشه مشتاق شنیدن نظرات شما هستیم
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gold-600 hover:bg-gold-700 text-white shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all duration-300"
                  asChild
                >
                  <Link href="/contact">
                    <Mail className="h-5 w-5" />
                    تماس با ما
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gold-500/30 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-gold-950/30 transition-all duration-200"
                  asChild
                >
                  <Link href="/help">
                    <MessageCircle className="h-5 w-5" />
                    مرکز راهنمایی
                  </Link>
                </Button>
              </div>

              {/* Contact info */}
              <div className="pt-6 border-t border-gold-500/20">
                <p className="text-sm text-muted-foreground">
                  ایمیل: <a href="mailto:support@ketabyar.com" className="text-gold-600 hover:text-gold-700 transition-colors">support@ketabyar.com</a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            به دنبال فرصت‌های شغلی هستید؟
          </p>
          <Button variant="outline" asChild>
            <Link href="/careers">
              مشاهده موقعیت‌های شغلی
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
