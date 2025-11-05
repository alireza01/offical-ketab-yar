import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function SupportLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-12 w-80 mx-auto mb-4" />
                    <Skeleton className="h-6 w-[600px] mx-auto" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Form Skeleton */}
                    <div className="lg:col-span-2">
                        <Card className="p-8">
                            <Skeleton className="h-8 w-32 mb-6" />
                            <div className="space-y-6">
                                <div>
                                    <Skeleton className="h-4 w-16 mb-2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div>
                                    <Skeleton className="h-4 w-16 mb-2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div>
                                    <Skeleton className="h-4 w-16 mb-2" />
                                    <Skeleton className="h-32 w-full" />
                                </div>
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </Card>
                    </div>

                    {/* Info Cards Skeleton */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-6">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-full" />
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
