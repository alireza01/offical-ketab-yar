import { Card, CardContent } from '@/components/ui/card'
import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Profile Page Loading State
 * Agent 2 (Performance): Matches exact layout
 * Agent 3 (Psychology): Smooth skeleton transitions
 */
export default function ProfileLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:block space-y-8">
                        {/* Header */}
                        <div className="flex items-center gap-6">
                            <Skeleton variant="avatar" className="size-24" shimmer />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-8 w-48" shimmer />
                                <Skeleton className="h-4 w-64" shimmer />
                                <div className="flex gap-2">
                                    <Skeleton className="h-9 w-32 rounded-lg" shimmer />
                                    <Skeleton className="h-9 w-28 rounded-lg" shimmer />
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="pt-6">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" shimmer />
                                            <Skeleton className="h-8 w-16" shimmer />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="space-y-4">
                            <div className="flex gap-4 border-b">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-24" shimmer />
                                ))}
                            </div>

                            {/* Tab Content */}
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

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <Skeleton variant="avatar" className="size-20 mx-auto" shimmer />
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-40 mx-auto" shimmer />
                                <Skeleton className="h-4 w-48 mx-auto" shimmer />
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Skeleton className="h-9 w-28 rounded-lg" shimmer />
                                <Skeleton className="h-9 w-24 rounded-lg" shimmer />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="pt-4 text-center">
                                        <Skeleton className="h-3 w-20 mx-auto mb-2" shimmer />
                                        <Skeleton className="h-7 w-12 mx-auto" shimmer />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="space-y-4">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-20 rounded-full flex-shrink-0" shimmer />
                                ))}
                            </div>

                            {/* Tab Content */}
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
