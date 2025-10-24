'use client'

import { motion } from 'framer-motion'
import { BookOpen, Sparkles } from 'lucide-react'

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gold-50 via-white to-gold-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            درباره کتاب‌یار
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 bg-clip-text text-transparent">
              همراه هوشمند
            </span>
            <br />
            <span className="text-foreground">مطالعه شما</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            کتاب‌یار یک پلتفرم مطالعه آنلاین پیشرفته است که با ترکیب هوش مصنوعی، طراحی زیبا و تجربه کاربری بی‌نظیر، یادگیری زبان انگلیسی را برای فارسی‌زبانان آسان و لذت‌بخش می‌کند.
          </p>

          <div className="mt-12 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 rounded-full blur-2xl opacity-30" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-gold-600 to-gold-400 rounded-full flex items-center justify-center shadow-2xl">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
