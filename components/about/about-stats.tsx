'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Star, Award } from 'lucide-react'

const stats = [
  {
    icon: BookOpen,
    value: '1000+',
    label: 'کتاب',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Users,
    value: '50K+',
    label: 'کاربر فعال',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Star,
    value: '4.8',
    label: 'امتیاز کاربران',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: Award,
    value: '100K+',
    label: 'ساعت مطالعه',
    gradient: 'from-green-500 to-emerald-500'
  }
]

export function AboutStats() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
