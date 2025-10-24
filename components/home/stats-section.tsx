'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { BookOpen, Users, Star, TrendingUp, Award, Globe } from 'lucide-react'

const stats = [
  {
    icon: BookOpen,
    value: 1000,
    suffix: '+',
    label: 'کتاب منتشر شده',
    description: 'در ژانرهای مختلف',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    value: 50000,
    suffix: '+',
    label: 'کاربر فعال',
    description: 'در سراسر جهان',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    label: 'رضایت کاربران',
    description: 'از 2,500+ نظر',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: TrendingUp,
    value: 95,
    suffix: '%',
    label: 'نرخ تکمیل',
    description: 'کتاب‌های شروع شده',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Award,
    value: 10000,
    suffix: '+',
    label: 'دستاورد کسب شده',
    description: 'توسط کاربران',
    color: 'from-rose-500 to-red-500'
  },
  {
    icon: Globe,
    value: 2,
    suffix: ' زبان',
    label: 'پشتیبانی کامل',
    description: 'انگلیسی و فارسی',
    color: 'from-indigo-500 to-purple-500'
  }
]

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(value * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, value, duration])

  return <span ref={ref}>{count.toLocaleString('fa-IR')}</span>
}

export function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.05),transparent_70%)]" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              اعداد و ارقام
            </span>
            {' '}
            <span className="text-foreground">صحبت می‌کنند</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            به جمع هزاران کاربر راضی بپیوندید که تجربه مطالعه خود را متحول کرده‌اند
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative space-y-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Value */}
                    <div className="text-3xl font-bold text-foreground">
                      <Counter value={stat.value} />
                      <span>{stat.suffix}</span>
                    </div>

                    {/* Label */}
                    <div>
                      <div className="font-semibold text-foreground/90 text-sm mb-1">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
