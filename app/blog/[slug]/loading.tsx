import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Blog Post Loading State
 * Agent 1 (SEO): SSG page skeleton
 */
export default function BlogPostLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <article className="container mx-auto px-4 py-12">
                        <div className="max-w-3xl mx-auto space-y-8">
                            {/* Header */}
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-3/4" shimmer />
                                <div className="flex items-center gap-4">
                                    <Skeleton variant="avatar" shimmer />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" shimmer />
                                        <Skeleton className="h-3 w-24" shimmer />
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <Skeleton className="aspect-video w-full rounded-lg" shimmer />

                            {/* Content */}
                            <div className="space-y-4">
                                {[...Array(12)].map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-full" shimmer />
                                ))}
                                <Skeleton className="h-4 w-2/3" shimmer />
                            </div>
                        </div>
                    </article>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                    <article className="px-4 py-6 space-y-6">
                        {/* Header */}
                        <div className="space-y-3">
                            <Skeleton className="h-9 w-full" shimmer />
                            <Skeleton className="h-9 w-3/4" shimmer />
                            <div className="flex items-center gap-3">
                                <Skeleton variant="avatar" className="size-10" shimmer />
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-24" shimmer />
                                    <Skeleton className="h-2 w-20" shimmer />
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <Skeleton className="aspect-video w-full rounded-lg" shimmer />

                        {/* Content */}
                        <div className="space-y-3">
                            {[...Array(15)].map((_, i) => (
                                <Skeleton key={i} className="h-3 w-full" shimmer />
                            ))}
                            <Skeleton className="h-3 w-2/3" shimmer />
                        </div>
                    </article>
                </div>
            </div>
        </>
    )
}
