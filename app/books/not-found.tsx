import { Button } from '@/components/ui/button'
import { BookX, Home, Library, TrendingUp } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Book Not Found | Ketab-Yar',
    description: 'The book you are looking for could not be found.',
}

export default function BookNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Animated Book Icon */}
                <div className="relative flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative animate-bounce-slow">
                            <BookX className="w-32 h-32 md:w-40 md:h-40 text-gold" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                        Book Not Found
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
                        This book doesn't exist in our library yet, or it may have been removed.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                    <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-white min-w-[200px]">
                        <Link href="/library">
                            <Library className="mr-2 h-5 w-5" />
                            Browse Library
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                {/* Suggestions */}
                <div className="pt-8 border-t border-border/50 animate-fade-in-delayed">
                    <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Check out our popular books instead:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/library?sort=popular"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Most Popular
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/library?sort=recent"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Recently Added
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/library?sort=rating"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Highest Rated
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.3s both;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
