'use client'

import { motion } from 'framer-motion'
import { Sparkles, Globe, Trophy, BookOpen, Brain, Zap } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'یادگیری هوشمند با AI',
    description: 'گفتگو با کتاب، دریافت معنی فوری و ساخت واژگان شخصی با هوش مصنوعی Gemini 2.5 Flash',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Globe,
    title: 'پشتیبانی دوزبانه',
    description: 'تغییر آسان بین انگلیسی و فارسی با حالت مطالعه کنار هم برای زبان‌آموزان',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Trophy,
    title: 'بازی‌وارسازی',
    description: 'کسب دستاوردها، پیگیری روزهای متوالی و رقابت در جدول امتیازات در حین مطالعه',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: BookOpen,
    title: 'تجربه واقعی مطالعه',
    description: 'ورق زدن صفحات با انیمیشن واقع‌گرایانه، هایلایت، یادداشت و نشانک‌گذاری',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Brain,
    title: 'سیستم واژگان هوشمند',
    description: 'ذخیره خودکار کلمات، فلش‌کارت، آزمون و سیستم تکرار فاصله‌دار برای یادگیری بهتر',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Zap,
    title: 'عملکرد سریع',
    description: 'بارگذاری فوری صفحات، کش هوشمند و تجربه روان بدون تاخیر',
    gradient: 'from-rose-500 to-red-500'
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">چرا کتاب‌یار؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            تجربه مطالعه‌ای بی‌نظیر با امکانات پیشرفته و هوش مصنوعی
          </p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={item}
                className="group relative"
              >
                <div className="relative h-full p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-gold-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
