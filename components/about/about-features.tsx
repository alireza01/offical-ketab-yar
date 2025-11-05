'use client'

import { motion } from 'framer-motion'
import { Sparkles, Globe, BookOpen, Brain, Trophy, Zap, MessageSquare, Bookmark } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'هوش مصنوعی Gemini',
    description: 'دستیار هوشمند مطالعه با قدرت Google Gemini 2.5 Flash'
  },
  {
    icon: Globe,
    title: 'دوزبانه',
    description: 'پشتیبانی کامل از انگلیسی و فارسی با امکان تغییر آسان'
  },
  {
    icon: BookOpen,
    title: 'ورق زدن واقعی',
    description: 'انیمیشن واقع‌گرایانه ورق زدن صفحات با فیزیک پیشرفته'
  },
  {
    icon: Brain,
    title: 'واژگان هوشمند',
    description: 'ذخیره خودکار کلمات، فلش‌کارت و سیستم تکرار فاصله‌دار'
  },
  {
    icon: Trophy,
    title: 'بازی‌وارسازی',
    description: 'دستاوردها، جدول امتیازات و چالش‌های روزانه'
  },
  {
    icon: Zap,
    title: 'عملکرد سریع',
    description: 'بارگذاری فوری و تجربه روان بدون تاخیر'
  },
  {
    icon: MessageSquare,
    title: 'گفتگو با کتاب',
    description: 'پرسش و پاسخ با AI درباره محتوای کتاب'
  },
  {
    icon: Bookmark,
    title: 'هایلایت و یادداشت',
    description: 'ذخیره بخش‌های مهم با رنگ‌بندی و یادداشت‌برداری'
  }
]

export function AboutFeatures() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">امکانات پیشرفته</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            تکنولوژی‌های پیشرفته برای بهترین تجربه مطالعه
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
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                  <Icon className="h-6 w-6 text-gold-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
