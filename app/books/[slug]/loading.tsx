import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Book Detail Page Loading State
 * Agent 2 (Performance): Matches exact layout for smooth transition
 * Agent 3 (Psychology): Premium feel with shimmer effects
 */
export default function BookDetailLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Book Cover */}
                            <div className="lg:col-span-1">
                                <Skeleton variant="book-cover" className="w-full h-[450px] mx-auto" shimmer />
                            </div>

                            {/* Right: Book Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div className="space-y-3">
                                    <Skeleton className="h-10 w-3/4" shimmer />
                                    <Skeleton className="h-6 w-1/2" shimmer />
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <Skeleton variant="avatar" shimmer />
                                    <Skeleton className="h-5 w-32" shimmer />
                                </div>

                                {/* Rating & Stats */}
                                <div className="flex items-center gap-6">
                                    <Skeleton className="h-6 w-24" shimmer />
                                    <Skeleton className="h-6 w-20" shimmer />
                                    <Skeleton className="h-6 w-28" shimmer />
                                </div>

                                {/* Genres */}
                                <div className="flex gap-2 flex-wrap">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-20 rounded-full" shimmer />
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-20" shimmer />
                                    <Skeleton className="h-4 w-full" shimmer />
                                    <Skeleton className="h-4 w-full" shimmer />
                                    <Skeleton className="h-4 w-3/4" shimmer />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Skeleton variant="button" className="h-12 w-40" shimmer />
                                    <Skeleton variant="button" className="h-12 w-32" shimmer />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-6">
                        {/* Book Cover */}
                        <Skeleton variant="book-cover" className="w-48 h-72 mx-auto" shimmer />

                        {/* Title */}
                        <div className="space-y-2 text-center">
                            <Skeleton className="h-8 w-3/4 mx-auto" shimmer />
                            <Skeleton className="h-5 w-1/2 mx-auto" shimmer />
                        </div>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-2">
                            <Skeleton variant="avatar" className="size-10" shimmer />
                            <Skeleton className="h-4 w-28" shimmer />
                        </div>

                        {/* Rating */}
                        <div className="flex justify-center gap-4">
                            <Skeleton className="h-5 w-20" shimmer />
                            <Skeleton className="h-5 w-24" shimmer />
                        </div>

                        {/* Genres */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-7 w-16 rounded-full" shimmer />
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" shimmer />
                            <Skeleton className="h-4 w-full" shimmer />
                            <Skeleton className="h-4 w-2/3" shimmer />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full rounded-lg" shimmer />
                            <Skeleton className="h-10 w-full rounded-lg" shimmer />
                        </div>
                    </div>

                    {/* Related Books Section */}
                    <div className="mt-16 space-y-6">
                        <Skeleton className="h-8 w-48" shimmer />
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                                    <Skeleton className="h-4 w-full" shimmer />
                                    <Skeleton className="h-3 w-2/3" shimmer />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
