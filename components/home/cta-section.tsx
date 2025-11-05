import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-r from-[#D4AF37] to-[#B8956A]">
            <div className="container text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Ready to Start Your Reading Journey?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Join thousands of readers improving their English through bilingual books
                </p>
                <Link href="/auth/register">
                    <Button size="lg" variant="secondary" className="bg-white text-[#D4AF37] hover:bg-white/90">
                        Get Started for Free
                    </Button>
                </Link>
            </div>
        </section>
    )
}
