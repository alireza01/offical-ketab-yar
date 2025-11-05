'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

const team = [
    { name: 'Sarah Johnson', role: 'Founder & CEO', initials: 'SJ' },
    { name: 'Michael Chen', role: 'Head of Content', initials: 'MC' },
    { name: 'Amir Hosseini', role: 'Lead Developer', initials: 'AH' },
    { name: 'Emma Williams', role: 'UX Designer', initials: 'EW' }
]

export function AboutTeam() {
    return (
        <section className="py-16">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
                <div className="grid md:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <Card key={index} className="text-center">
                            <CardContent className="pt-6">
                                <Avatar className="w-24 h-24 mx-auto mb-4">
                                    <AvatarFallback className="bg-[#D4AF37] text-white text-2xl">
                                        {member.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
