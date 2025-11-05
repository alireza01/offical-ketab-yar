'use client'

import { motion } from 'framer-motion'
import { Search, BookOpen, Brain, Trophy, ArrowLeft } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'کتاب مورد علاقه را پیدا کنید',
    description: 'از میان هزاران کتاب در ژانرهای مختلف، کتاب مناسب خود را انتخاب کنید',
    color: 'from-blue-500 to-cyan-500',
    delay: 0
  },
  {
    icon: BookOpen,
    title: 'شروع به مطالعه کنید',
    description: 'با تجربه ورق زدن واقعی صفحات و امکانات پیشرفته مطالعه، غرق در دنیای کتاب شوید',
    color: 'from-purple-500 to-pink-500',
    delay: 0.1
  },
  {
    icon: Brain,
    title: 'با AI یاد بگیرید',
    description: 'از هوش مصنوعی برای یادگیری کلمات جدید، ترجمه و گفتگو با کتاب استفاده کنید',
    color: 'from-amber-500 to-orange-500',
    delay: 0.2
  },
  {
    icon: Trophy,
    title: 'دستاوردها را جمع کنید',
    description: 'با تکمیل چالش‌ها و رسیدن به اهداف، دستاوردها و امتیازات کسب کنید',
    color: 'from-green-500 to-emerald-500',
    delay: 0.3
  }
]

export function HowItWorks() {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">چگونه</span>
            {' '}
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              کار می‌کند؟
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            در چهار مرحله ساده، سفر یادگیری خود را با کتاب‌یار آغاز کنید
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay }}
                  className="relative group"
                >
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 right-0 w-full h-0.5 bg-gradient-to-l from-gold-500/50 to-transparent -z-10" />
                  )}

                  <div className="relative h-full">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                      {index + 1}
                    </div>

                    <div className="h-full p-6 pt-8 rounded-2xl bg-card border border-border hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-gold-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">آماده شروع هستید؟</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-semibold shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 transition-all duration-300"
            >
              همین حالا شروع کنید
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
