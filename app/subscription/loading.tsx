import { Card } from '@/components/ui/card'
import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Subscription Page Loading State
 * Agent 2 (Performance): Responsive skeleton
 * Agent 3 (Psychology): Premium loading experience
 */
export default function SubscriptionLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
                {/* Desktop Layout */}
                <div className="hidden md:block">
                    <div className="container mx-auto px-4">
                        {/* Header Skeleton */}
                        <div className="text-center mb-16">
                            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" shimmer />
                            <Skeleton className="h-12 w-96 mx-auto mb-4" shimmer />
                            <Skeleton className="h-6 w-[600px] mx-auto mb-6" shimmer />
                            <Skeleton className="h-10 w-64 mx-auto" shimmer />
                        </div>

                        {/* Featured Plan Skeleton */}
                        <div className="mb-16 max-w-5xl mx-auto">
                            <Card className="p-10">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <Skeleton className="h-20 w-20 rounded-2xl" shimmer />
                                        <Skeleton className="h-10 w-48" shimmer />
                                        <Skeleton className="h-16 w-64" shimmer />
                                        <Skeleton className="h-14 w-full" shimmer />
                                    </div>
                                    <div className="space-y-4">
                                        <Skeleton className="h-8 w-32" shimmer />
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <Skeleton key={i} className="h-6 w-full" shimmer />
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Other Plans Skeleton */}
                        <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="p-8">
                                    <Skeleton className="h-16 w-16 rounded-xl mx-auto mb-4" shimmer />
                                    <Skeleton className="h-8 w-32 mx-auto mb-2" shimmer />
                                    <Skeleton className="h-4 w-48 mx-auto mb-6" shimmer />
                                    <Skeleton className="h-16 w-full mb-8" shimmer />
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((j) => (
                                            <Skeleton key={j} className="h-5 w-full" shimmer />
                                        ))}
                                    </div>
                                    <Skeleton className="h-12 w-full mt-8" shimmer />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                    <div className="container mx-auto px-4">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" shimmer />
                            <Skeleton className="h-10 w-5/6 mx-auto mb-3" shimmer />
                            <Skeleton className="h-5 w-full mx-auto mb-4" shimmer />
                            <Skeleton className="h-9 w-48 mx-auto" shimmer />
                        </div>

                        {/* Featured Plan */}
                        <div className="mb-12">
                            <Card className="p-6">
                                <div className="space-y-6">
                                    <Skeleton className="h-16 w-16 rounded-2xl mx-auto" shimmer />
                                    <Skeleton className="h-8 w-40 mx-auto" shimmer />
                                    <Skeleton className="h-14 w-56 mx-auto" shimmer />
                                    <Skeleton className="h-12 w-full" shimmer />
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((i) => (
                                            <Skeleton key={i} className="h-5 w-full" shimmer />
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Other Plans */}
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <Card key={i} className="p-6">
                                    <Skeleton className="h-12 w-12 rounded-xl mx-auto mb-3" shimmer />
                                    <Skeleton className="h-7 w-28 mx-auto mb-2" shimmer />
                                    <Skeleton className="h-4 w-40 mx-auto mb-4" shimmer />
                                    <Skeleton className="h-14 w-full mb-6" shimmer />
                                    <div className="space-y-2">
                                        {[1, 2, 3].map((j) => (
                                            <Skeleton key={j} className="h-4 w-full" shimmer />
                                        ))}
                                    </div>
                                    <Skeleton className="h-11 w-full mt-6" shimmer />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
