import { Skeleton } from '@/components/ui/skeleton'

/**
 * Loading state for books module
 * ✅ AGENT 3 (PSYCHOLOGY): Skeleton screens instead of spinners
 * ✅ AGENT 2 (PERFORMANCE): Prevents layout shift
 */
export default function BooksLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section Skeleton */}
            <div className="relative bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-transparent">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-[300px,1fr] gap-8 lg:gap-12">
                        {/* Book Cover Skeleton */}
                        <div className="flex justify-center md:justify-start">
                            <Skeleton className="w-[300px] h-[450px] rounded-lg" />
                        </div>

                        {/* Book Info Skeleton */}
                        <div className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                            </div>

                            {/* Rating & Stats */}
                            <div className="flex gap-6">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-20" />
                            </div>

                            {/* Genres */}
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>

                            {/* Languages */}
                            <Skeleton className="h-5 w-48" />

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Skeleton className="h-12 w-40" />
                                <Skeleton className="h-12 w-40" />
                                <Skeleton className="h-12 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs Skeleton */}
            <div className="container mx-auto px-4 py-12">
                <div className="space-y-8">
                    {/* Tabs */}
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Related Books */}
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-64" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Progress Bar (Agent 3's touch) */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gold-500/20 z-50">
                <div className="h-full bg-gold-500 animate-pulse" style={{ width: '60%' }} />
            </div>
        </div>
    )
}
