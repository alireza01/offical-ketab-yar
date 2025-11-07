import { Card, CardContent } from '@/components/ui/card'
import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Review Page Loading State
 */
export default function ReviewLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <Skeleton className="h-10 w-64" shimmer />

                            {[...Array(5)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <Skeleton variant="avatar" shimmer />
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Skeleton className="h-5 w-32" shimmer />
                                                    <Skeleton className="h-4 w-24" shimmer />
                                                </div>
                                                <Skeleton className="h-4 w-20" shimmer />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-full" shimmer />
                                                    <Skeleton className="h-4 w-full" shimmer />
                                                    <Skeleton className="h-4 w-3/4" shimmer />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-4">
                        <Skeleton className="h-8 w-48" shimmer />

                        {[...Array(5)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Skeleton variant="avatar" className="size-10" shimmer />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-24" shimmer />
                                            <Skeleton className="h-3 w-16" shimmer />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-full" shimmer />
                                        <Skeleton className="h-3 w-full" shimmer />
                                        <Skeleton className="h-3 w-2/3" shimmer />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
