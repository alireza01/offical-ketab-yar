// Loading state for subscription page
// Agent 2: Skeleton screens for better UX

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SubscriptionLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-12 w-96 mx-auto mb-4" />
                    <Skeleton className="h-6 w-[600px] mx-auto mb-6" />
                    <Skeleton className="h-10 w-64 mx-auto" />
                </div>

                {/* Featured Plan Skeleton */}
                <div className="mb-16 max-w-5xl mx-auto">
                    <Card className="p-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <Skeleton className="h-20 w-20 rounded-2xl" />
                                <Skeleton className="h-10 w-48" />
                                <Skeleton className="h-16 w-64" />
                                <Skeleton className="h-14 w-full" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-32" />
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} className="h-6 w-full" />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Other Plans Skeleton */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-8">
                            <Skeleton className="h-16 w-16 rounded-xl mx-auto mb-4" />
                            <Skeleton className="h-8 w-32 mx-auto mb-2" />
                            <Skeleton className="h-4 w-48 mx-auto mb-6" />
                            <Skeleton className="h-16 w-full mb-8" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((j) => (
                                    <Skeleton key={j} className="h-5 w-full" />
                                ))}
                            </div>
                            <Skeleton className="h-12 w-full mt-8" />
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
