'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
    {
        name: 'Alex Thompson',
        role: 'English Learner',
        content: 'Ketab-Yar transformed my English learning journey. Reading bilingual books is so much more effective than traditional methods!',
        initials: 'AT'
    },
    {
        name: 'Maryam Rezaei',
        role: 'Book Enthusiast',
        content: 'I love how I can switch between languages seamlessly. The vocabulary builder is a game-changer!',
        initials: 'MR'
    },
    {
        name: 'David Kim',
        role: 'Student',
        content: 'The gamification features keep me motivated. I\'ve read more books in 3 months than I did all last year!',
        initials: 'DK'
    }
]

export function AboutTestimonials() {
    return (
        <section className="py-16 bg-muted/50">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">What Our Readers Say</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar>
                                        <AvatarFallback className="bg-[#D4AF37] text-white">
                                            {testimonial.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
