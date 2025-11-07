import { Card, CardContent } from '@/components/ui/card'
import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Vocabulary Page Loading State
 * Agent 2 (Performance): Matches exact layout
 * Agent 3 (Psychology): Engaging skeleton with gold accents
 */
export default function VocabularyLoading() {
    return (
        <>
            <LoadingBar />

            <div className="min-h-screen" dir="rtl">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8 text-center space-y-2">
                        <Skeleton className="h-10 w-48 mx-auto" shimmer />
                        <Skeleton className="h-5 w-32 mx-auto" shimmer />
                    </div>

                    {/* Stats Cards - Desktop */}
                    <div className="hidden md:grid md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="bg-gradient-to-br from-gold/10 to-gold/5">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" shimmer />
                                            <Skeleton className="h-8 w-16" shimmer />
                                        </div>
                                        <Skeleton className="size-10 rounded-full" shimmer />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Stats Cards - Mobile */}
                    <div className="md:hidden grid grid-cols-2 gap-3 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="bg-gradient-to-br from-gold/10 to-gold/5">
                                <CardContent className="pt-4">
                                    <div className="text-center space-y-2">
                                        <Skeleton className="h-3 w-20 mx-auto" shimmer />
                                        <Skeleton className="h-7 w-12 mx-auto" shimmer />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Practice Button */}
                    <div className="mb-8 text-center">
                        <Skeleton className="h-12 w-64 mx-auto rounded-lg" shimmer />
                    </div>

                    {/* Info Card */}
                    <Card className="mb-8 bg-gold/5">
                        <CardContent className="pt-6 space-y-3">
                            <Skeleton className="h-6 w-48" shimmer />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" shimmer />
                                <Skeleton className="h-4 w-full" shimmer />
                                <Skeleton className="h-4 w-3/4" shimmer />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Books List Header */}
                    <Skeleton className="h-8 w-32 mb-4" shimmer />

                    {/* Books List - Desktop */}
                    <div className="hidden md:block space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="size-6 rounded" shimmer />
                                                <Skeleton className="h-6 w-48" shimmer />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-4 w-24" shimmer />
                                                    <Skeleton className="h-4 w-20" shimmer />
                                                </div>
                                                <Skeleton className="h-2 w-full rounded-full" shimmer />
                                            </div>

                                            <div className="flex gap-2">
                                                {[...Array(4)].map((_, j) => (
                                                    <Skeleton key={j} className="h-6 w-20 rounded-full" shimmer />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-10 w-28 rounded-lg" shimmer />
                                            <Skeleton className="h-10 w-28 rounded-lg" shimmer />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Books List - Mobile */}
                    <div className="md:hidden space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="size-5 rounded" shimmer />
                                        <Skeleton className="h-5 w-40" shimmer />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <Skeleton className="h-3 w-20" shimmer />
                                            <Skeleton className="h-3 w-16" shimmer />
                                        </div>
                                        <Skeleton className="h-2 w-full rounded-full" shimmer />
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                        {[...Array(3)].map((_, j) => (
                                            <Skeleton key={j} className="h-5 w-16 rounded-full" shimmer />
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <Skeleton className="h-9 flex-1 rounded-lg" shimmer />
                                        <Skeleton className="h-9 flex-1 rounded-lg" shimmer />
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
