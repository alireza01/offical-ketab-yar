import { Button } from '@/components/ui/button'
import { BookOpen, Sparkles, Trophy } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="py-20 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8956A] bg-clip-text text-transparent">
                    Read Books in Two Languages
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Master English while enjoying your favorite books. Switch between Persian and English instantly.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/auth/register">
                        <Button size="lg" className="bg-[#D4AF37] hover:bg-[#C9A961]">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Start Reading Free
                        </Button>
                    </Link>
                    <Link href="/library">
                        <Button size="lg" variant="outline">
                            Browse Library
                        </Button>
                    </Link>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="p-6 rounded-lg border bg-card">
                        <BookOpen className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Bilingual Reading</h3>
                        <p className="text-sm text-muted-foreground">Switch between languages with one click</p>
                    </div>
                    <div className="p-6 rounded-lg border bg-card">
                        <Sparkles className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Smart Vocabulary</h3>
                        <p className="text-sm text-muted-foreground">Save words and build your vocabulary</p>
                    </div>
                    <div className="p-6 rounded-lg border bg-card">
                        <Trophy className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">Gamification</h3>
                        <p className="text-sm text-muted-foreground">Earn XP and maintain reading streaks</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
