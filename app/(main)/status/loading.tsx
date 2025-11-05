import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function StatusLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-12 w-96 mx-auto mb-4" />
                    <Skeleton className="h-6 w-64 mx-auto" />
                </div>

                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Overall Status Skeleton */}
                    <Card className="p-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </Card>

                    {/* Services Status Skeleton */}
                    <Card className="p-8">
                        <Skeleton className="h-8 w-48 mb-6" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Deployment Info Skeleton */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <Card key={i} className="p-6">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
