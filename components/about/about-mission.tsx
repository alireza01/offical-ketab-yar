'use client'

import { motion } from 'framer-motion'
import { Target, Heart, Zap } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'ماموریت ما',
    description: 'ما می‌خواهیم یادگیری زبان انگلیسی را از طریق مطالعه کتاب، آسان، لذت‌بخش و موثر کنیم. با ترکیب تکنولوژی پیشرفته و طراحی زیبا، تجربه‌ای بی‌نظیر ارائه می‌دهیم.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Heart,
    title: 'ارزش‌های ما',
    description: 'کیفیت، نوآوری و تمرکز بر کاربر در قلب تمام کارهای ما قرار دارد. ما به یادگیری مادام‌العمر و قدرت تحول‌آفرین کتاب‌ها اعتقاد داریم.',
    gradient: 'from-red-500 to-rose-500'
  },
  {
    icon: Zap,
    title: 'چشم‌انداز ما',
    description: 'تبدیل شدن به بزرگ‌ترین پلتفرم مطالعه دوزبانه در جهان و کمک به میلیون‌ها نفر برای یادگیری زبان‌های جدید از طریق مطالعه کتاب‌های محبوبشان.',
    gradient: 'from-amber-500 to-orange-500'
  }
]

export function AboutMission() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">چرا کتاب‌یار؟</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ما با اشتیاق به ساخت بهترین تجربه مطالعه برای زبان‌آموزان متعهد هستیم
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="h-full p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300">
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
