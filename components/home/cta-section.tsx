'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Enhanced gradient background - Agent 3 Psychology */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-600 via-gold-500 to-gold-400" />
      {/* Subtle pattern overlay for depth */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10" />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">به جمع 50,000+ خواننده بپیوندید</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            آماده شروع مطالعه هستید؟
          </h2>
          <p className="text-xl mb-8 opacity-95 leading-relaxed drop-shadow-md">
            به هزاران خواننده در حال بهبود مهارت‌های انگلیسی بپیوندید و تجربه مطالعه‌ای متفاوت را آغاز کنید
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-gold-800 hover:bg-white/95 hover:text-gold-900 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
              asChild
            >
              <Link href="/library">
                <BookOpen className="ml-2 h-5 w-5" />
                مرور کتابخانه
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-2 border-white text-white hover:bg-white/20 hover:border-white hover:text-white backdrop-blur-sm transition-all duration-300 font-semibold"
              asChild
            >
              <Link href="/subscription">
                اشتراک ویژه
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>امتیاز 4.8 از 5</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>پرداخت امن</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>7 روز ضمانت بازگشت</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
