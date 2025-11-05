'use client'

import { Award, Shield, Users, Zap } from 'lucide-react'

const signals = [
   {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected'
   },
   {
      icon: Award,
      title: 'Premium Quality',
      description: 'Curated collection of bestsellers'
   },
   {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of active readers'
   },
   {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Optimized for best performance'
   }
]

export function AboutTrustSignals() {
   return (
      <section className="py-16">
         <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
               {signals.map((signal, index) => {
                  const Icon = signal.icon
                  return (
                     <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 mb-4">
                           <Icon className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                        <h3 className="font-semibold mb-2">{signal.title}</h3>
                        <p className="text-sm text-muted-foreground">{signal.description}</p>
                     </div>
                  )
               })}
            </div>
         </div>
      </section>
   )
}
