'use client'

import { motion } from 'framer-motion'
import { BookOpen, Brain, Globe, Heart, Shield, Sparkles, Trophy, Zap } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'هوش مصنوعی پیشرفته',
    description: 'استفاده از Gemini 2.5 Flash برای گفتگو با کتاب، ترجمه هوشمند و پیشنهادات شخصی‌سازی شده',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'دوزبانه کامل',
    description: 'پشتیبانی کامل از انگلیسی و فارسی با قابلیت تغییر آسان و مطالعه کنار هم',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BookOpen,
    title: 'کتابخانه غنی',
    description: 'بیش از 1000 کتاب در ژانرهای مختلف از کلاسیک‌ها تا پرفروش‌های روز',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Brain,
    title: 'یادگیری هوشمند',
    description: 'سیستم واژگان پیشرفته با فلش‌کارت، تکرار فاصله‌دار و آزمون‌های تعاملی',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Trophy,
    title: 'گیمیفیکیشن',
    description: 'سیستم XP، استریک روزانه، لیگ‌های هفتگی و دستاوردهای متنوع برای انگیزه بیشتر',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Zap,
    title: 'عملکرد سریع',
    description: 'بارگذاری فوری، کش هوشمند و تجربه روان حتی با اینترنت ضعیف',
    color: 'from-rose-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'امنیت بالا',
    description: 'رمزنگاری داده‌ها، احراز هویت امن و حفاظت کامل از حریم خصوصی کاربران',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Heart,
    title: 'پشتیبانی 24/7',
    description: 'تیم پشتیبانی حرفه‌ای آماده پاسخگویی به سوالات و حل مشکلات شما',
    color: 'from-pink-500 to-rose-500'
  }
]

export function AboutFeatures() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">امکانات</span>
            {' '}
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              پیشرفته
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            تکنولوژی‌ها و ویژگی‌هایی که کتاب‌یار را از سایر پلتفرم‌ها متمایز می‌کند
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative"
              >
                <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-gold-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold mb-6 text-foreground">
            ساخته شده با بهترین تکنولوژی‌ها
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              Next.js 15
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              TypeScript
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              Supabase
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              Gemini 2.5 Flash
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              Framer Motion
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              Tailwind CSS
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border">
              shadcn/ui
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
