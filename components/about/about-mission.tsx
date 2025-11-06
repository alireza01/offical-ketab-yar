'use client'

import { motion } from 'framer-motion'
import { Eye, Heart, Lightbulb, Target } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'ماموریت ما',
    description: 'تبدیل یادگیری زبان انگلیسی از یک فرآیند خسته‌کننده به یک تجربه لذت‌بخش، اعتیادآور و موثر از طریق ترکیب مطالعه کتاب با فناوری هوش مصنوعی و گیمیفیکیشن هوشمند.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Eye,
    title: 'چشم‌انداز ما',
    description: 'ایجاد بزرگترین پلتفرم مطالعه دوزبانه در خاورمیانه که میلیون‌ها نفر را در مسیر یادگیری زبان و توسعه فردی یاری کند و الگویی جهانی برای آموزش زبان باشد.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: Heart,
    title: 'ارزش‌های ما',
    description: 'کیفیت بالا، نوآوری مداوم، تمرکز بر کاربر، دسترسی آسان برای همه، یادگیری مادام‌العمر، و ایجاد جامعه‌ای از خوانندگان و یادگیرندگان پرشور.',
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-500/10'
  },
  {
    icon: Lightbulb,
    title: 'نوآوری ما',
    description: 'استفاده از هوش مصنوعی Gemini 2.5 Flash برای ایجاد تجربه یادگیری شخصی‌سازی شده، سیستم گیمیفیکیشن پیشرفته برای افزایش انگیزه، و رابط کاربری بی‌نظیر برای مطالعه.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10'
  }
]

export function AboutMission() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">ماموریت و</span>
            {' '}
            <span className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent">
              ارزش‌های ما
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            آنچه ما را به حرکت وا می‌دارد و مسیر آینده ما را تعیین می‌کند
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-2xl bg-card border border-border hover:border-gold-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10 overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-gold-600 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/20 overflow-hidden">
            {/* Quote mark */}
            <div className="absolute top-4 right-4 text-8xl text-gold-500/10 font-serif leading-none">
              "
            </div>

            <div className="relative">
              <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6 text-center">
                ما معتقدیم که یادگیری زبان نباید یک کار سخت و خسته‌کننده باشد.
                با کتاب‌یار، هر روز مطالعه به یک ماجراجویی جدید تبدیل می‌شود.
              </p>
              <div className="text-center">
                <p className="text-gold-600 dark:text-gold-400 font-semibold">
                  تیم کتاب‌یار
                </p>
                <p className="text-sm text-muted-foreground">
                  بنیانگذاران و توسعه‌دهندگان
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
