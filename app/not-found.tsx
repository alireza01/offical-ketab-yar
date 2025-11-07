import { Button } from '@/components/ui/button'
import { BookOpen, Home, Search } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '404 - Page Not Found | Ketab-Yar',
    description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Animated 404 */}
                <div className="relative">
                    <div className="text-[150px] md:text-[200px] font-bold text-gold/10 select-none animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-bounce">
                            <BookOpen className="w-24 h-24 md:w-32 md:h-32 text-gold" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-600">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                        Page Not Found
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off into another chapter.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
                    <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-white min-w-[200px]">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                        <Link href="/library">
                            <Search className="mr-2 h-5 w-5" />
                            Browse Library
                        </Link>
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-border/50 animate-in fade-in slide-in-from-bottom-2 duration-800 delay-300">
                    <p className="text-sm text-muted-foreground mb-4">
                        Or try one of these popular pages:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/dashboard"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Dashboard
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/vocabulary"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Vocabulary
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/profile"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Profile
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/help"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Help Center
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-gold/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl animate-pulse" />
            </div>
        </div>
    )
}
