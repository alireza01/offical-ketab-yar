import { Card, CardContent } from '@/components/ui/card'
import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Admin Dashboard Loading State
 */
export default function AdminLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" shimmer />
                        <Skeleton className="h-4 w-96" shimmer />
                    </div>

                    {/* Stats Grid - Desktop */}
                    <div className="hidden md:grid md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" shimmer />
                                        <Skeleton className="h-8 w-16" shimmer />
                                        <Skeleton className="h-3 w-20" shimmer />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Stats Grid - Mobile */}
                    <div className="md:hidden grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20" shimmer />
                                        <Skeleton className="h-7 w-12" shimmer />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-32 mb-4" shimmer />
                                <Skeleton className="h-64 w-full" shimmer />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <Skeleton className="h-6 w-32 mb-4" shimmer />
                                <Skeleton className="h-64 w-full" shimmer />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-40 mb-4" shimmer />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton variant="avatar" className="size-10" shimmer />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" shimmer />
                                            <Skeleton className="h-3 w-2/3" shimmer />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
