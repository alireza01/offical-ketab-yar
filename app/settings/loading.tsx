import { Card, CardContent } from '@/components/ui/card'
import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Settings Page Loading State
 * Agent 2 (Performance): Matches settings layout
 */
export default function SettingsLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <Skeleton className="h-10 w-48" shimmer />

                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="p-6 space-y-4">
                                        <Skeleton className="h-6 w-40" shimmer />
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, j) => (
                                                <div key={j} className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-32" shimmer />
                                                        <Skeleton className="h-3 w-48" shimmer />
                                                    </div>
                                                    <Skeleton className="h-6 w-12 rounded-full" shimmer />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-6">
                        <Skeleton className="h-8 w-32" shimmer />

                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-5 w-32" shimmer />
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className="flex items-center justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <Skeleton className="h-3 w-28" shimmer />
                                                    <Skeleton className="h-2 w-40" shimmer />
                                                </div>
                                                <Skeleton className="h-5 w-10 rounded-full" shimmer />
                                            </div>
                                        ))}
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
