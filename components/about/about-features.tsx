import { BookOpen, Globe, Sparkles, Trophy } from 'lucide-react'

export function AboutFeatures() {
    const features = [
        { icon: BookOpen, title: 'Bilingual Reading', description: 'Switch between languages instantly' },
        { icon: Sparkles, title: 'Smart Vocabulary', description: 'Build your word collection' },
        { icon: Trophy, title: 'Gamification', description: 'Earn XP and maintain streaks' },
        { icon: Globe, title: 'Global Library', description: 'Access thousands of books' },
    ]

    return (
        <section className="py-12 bg-muted/50">
            <div className="container">
                <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div key={feature.title} className="p-6 rounded-lg border bg-card text-center">
                                <Icon className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
