import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Blog Page Loading State
 * Agent 1 (SEO): SSG page with skeleton for smooth UX
 * Agent 3 (Psychology): Premium blog feel
 */
export default function BlogLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-gold/10 to-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <Skeleton className="h-8 w-32 mx-auto rounded-full" shimmer />
                            <Skeleton className="h-12 w-3/4 mx-auto" shimmer />
                            <Skeleton className="h-6 w-full mx-auto" shimmer />
                            <Skeleton className="h-6 w-2/3 mx-auto" shimmer />
                            <Skeleton className="h-12 w-48 mx-auto rounded-lg" shimmer />
                        </div>
                    </div>
                </section>

                {/* Featured Posts */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-10 w-48 mb-8" shimmer />

                        {/* Desktop Grid */}
                        <div className="hidden md:grid md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-video w-full rounded-lg" shimmer />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-full" shimmer />
                                        <Skeleton className="h-4 w-full" shimmer />
                                        <Skeleton className="h-4 w-2/3" shimmer />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Skeleton variant="avatar" className="size-8" shimmer />
                                        <Skeleton className="h-4 w-24" shimmer />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Grid */}
                        <div className="md:hidden space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="aspect-video w-full rounded-lg" shimmer />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-full" shimmer />
                                        <Skeleton className="h-3 w-full" shimmer />
                                        <Skeleton className="h-3 w-3/4" shimmer />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Skeleton variant="avatar" className="size-7" shimmer />
                                        <Skeleton className="h-3 w-20" shimmer />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All Posts */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <Skeleton className="h-10 w-32 mb-8" shimmer />

                        {/* Desktop Grid */}
                        <div className="hidden md:grid md:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-video w-full rounded-lg" shimmer />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-full" shimmer />
                                        <Skeleton className="h-4 w-full" shimmer />
                                        <Skeleton className="h-4 w-2/3" shimmer />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Grid */}
                        <div className="md:hidden space-y-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="aspect-video w-full rounded-lg" shimmer />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-full" shimmer />
                                        <Skeleton className="h-3 w-full" shimmer />
                                        <Skeleton className="h-3 w-3/4" shimmer />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
