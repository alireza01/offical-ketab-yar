import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * About Page Loading State
 * Agent 1 (SEO): SSG page skeleton
 */
export default function AboutLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Hero */}
                            <div className="text-center space-y-4">
                                <Skeleton className="h-14 w-3/4 mx-auto" shimmer />
                                <Skeleton className="h-6 w-2/3 mx-auto" shimmer />
                            </div>

                            {/* Content Sections */}
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="h-8 w-48" shimmer />
                                    <div className="space-y-2">
                                        {[...Array(4)].map((_, j) => (
                                            <Skeleton key={j} className="h-4 w-full" shimmer />
                                        ))}
                                        <Skeleton className="h-4 w-3/4" shimmer />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                    <div className="px-4 py-8 space-y-8">
                        {/* Hero */}
                        <div className="text-center space-y-3">
                            <Skeleton className="h-10 w-5/6 mx-auto" shimmer />
                            <Skeleton className="h-5 w-4/5 mx-auto" shimmer />
                        </div>

                        {/* Content */}
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-6 w-32" shimmer />
                                <div className="space-y-2">
                                    {[...Array(4)].map((_, j) => (
                                        <Skeleton key={j} className="h-3 w-full" shimmer />
                                    ))}
                                    <Skeleton className="h-3 w-2/3" shimmer />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
