import { Button } from '@/components/ui/button'
import { BookOpen, FileQuestion, Home, Newspaper } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Blog Post Not Found | Ketab-Yar',
    description: 'The blog post you are looking for could not be found.',
}

export default function BlogNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Animated Icon */}
                <div className="relative flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative animate-float">
                            <FileQuestion className="w-32 h-32 md:w-40 md:h-40 text-gold" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground">
                        Article Not Found
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
                        This blog post doesn't exist or may have been moved to another location.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                    <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-white min-w-[200px]">
                        <Link href="/blog">
                            <Newspaper className="mr-2 h-5 w-5" />
                            View All Posts
                        </Link>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="min-w-[200px]">
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-border/50 animate-fade-in-delayed">
                    <p className="text-sm text-muted-foreground mb-4">
                        Explore other sections:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/library"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1"
                        >
                            <BookOpen className="w-3 h-3" />
                            Library
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="/dashboard"
                            className="text-sm text-gold hover:text-gold/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Dashboard
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-10px) rotate(5deg);
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

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
