import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Author Detail Page Loading State
 * Agent 1 (SEO): SSG page skeleton
 * Agent 2 (Performance): Matches exact layout
 */
export default function AuthorDetailLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Left: Author Info */}
                            <div className="lg:col-span-1 space-y-6">
                                <Skeleton variant="avatar" className="size-48 mx-auto" shimmer />
                                <div className="text-center space-y-3">
                                    <Skeleton className="h-8 w-40 mx-auto" shimmer />
                                    <Skeleton className="h-4 w-32 mx-auto" shimmer />
                                    <Skeleton className="h-4 w-24 mx-auto" shimmer />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" shimmer />
                                    <Skeleton className="h-4 w-full" shimmer />
                                    <Skeleton className="h-4 w-3/4" shimmer />
                                </div>
                            </div>

                            {/* Right: Books */}
                            <div className="lg:col-span-3 space-y-6">
                                <Skeleton className="h-10 w-48" shimmer />
                                <div className="grid grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="space-y-3">
                                            <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                                            <Skeleton className="h-4 w-full" shimmer />
                                            <Skeleton className="h-3 w-2/3" shimmer />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-6">
                        {/* Author Info */}
                        <div className="text-center space-y-4">
                            <Skeleton variant="avatar" className="size-32 mx-auto" shimmer />
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-40 mx-auto" shimmer />
                                <Skeleton className="h-4 w-28 mx-auto" shimmer />
                                <Skeleton className="h-4 w-20 mx-auto" shimmer />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" shimmer />
                            <Skeleton className="h-4 w-full" shimmer />
                            <Skeleton className="h-4 w-2/3" shimmer />
                        </div>

                        {/* Books */}
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-32" shimmer />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                                        <Skeleton className="h-3 w-full" shimmer />
                                        <Skeleton className="h-3 w-2/3" shimmer />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
