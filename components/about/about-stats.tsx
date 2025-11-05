'use client'

const stats = [
  { value: '10,000+', label: 'Active Readers' },
  { value: '500+', label: 'Books Available' },
  { value: '50,000+', label: 'Words Learned' },
  { value: '95%', label: 'Satisfaction Rate' }
]

export function AboutStats() {
  return (
    <section className="py-16 bg-[#D4AF37]/10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
