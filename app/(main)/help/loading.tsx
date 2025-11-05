import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function HelpLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-20">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-16">
                    <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
                    <Skeleton className="h-12 w-96 mx-auto mb-4" />
                    <Skeleton className="h-6 w-[600px] mx-auto mb-8" />
                    <Skeleton className="h-14 w-full max-w-2xl mx-auto" />
                </div>

                {/* FAQ Categories Skeleton */}
                <div className="max-w-5xl mx-auto space-y-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <Skeleton className="w-14 h-14 rounded-xl" />
                                <Skeleton className="h-8 w-48" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="space-y-2">
                                        <Skeleton className="h-6 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
