'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Sparkles, Target, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export function AboutHero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-gold-50 via-white to-gold-100/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,97,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,175,55,0.05),transparent_50%)]" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/20">
              <Sparkles className="h-4 w-4 text-gold-600 dark:text-gold-400" />
              <span className="text-sm font-semibold text-gold-700 dark:text-gold-400">
                درباره کتاب‌یار
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">ما</span>
              {' '}
              <span className="inline-block bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                یادگیری زبان
              </span>
              {' '}
              <span className="text-foreground">را</span>
              <br />
              <span className="text-foreground">به یک</span>
              {' '}
              <span className="inline-block bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                تجربه لذت‌بخش
              </span>
              {' '}
              <span className="text-foreground">تبدیل می‌کنیم</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            کتاب‌یار با ترکیب هوش مصنوعی پیشرفته، گیمیفیکیشن هوشمند و تجربه کاربری بی‌نظیر،
            پلتفرمی است که یادگیری زبان انگلیسی را از طریق مطالعه کتاب به یک سفر هیجان‌انگیز تبدیل می‌کند.
          </motion.p>

          {/* Key values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8"
          >
            {[
              { icon: Target, label: 'ماموریت‌محور', description: 'تمرکز بر نتیجه' },
              { icon: Users, label: 'کاربرمحور', description: 'تجربه بی‌نظیر' },
              { icon: Zap, label: 'نوآورانه', description: 'فناوری پیشرفته' },
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-card border border-border hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{value.label}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              size="lg"
              className="group bg-gold-600 hover:bg-gold-700 text-white text-lg px-8 h-14 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all duration-300"
              asChild
            >
              <Link href="/library">
                <BookOpen className="h-5 w-5" />
                شروع مطالعه
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14 border-2 border-gold-500/30 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-gold-950/30 transition-all duration-200"
              asChild
            >
              <Link href="/help">
                راهنما و پشتیبانی
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
