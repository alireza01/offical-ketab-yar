import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
            <Card>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Skeleton className="w-32 h-32 rounded-full" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-24 w-48" />
                            <Skeleton className="h-24 w-48" />
                        </div>
                    </div>
                </div>
            </Card>

            <Skeleton className="h-12 w-full" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-96" />
                <Skeleton className="h-96" />
            </div>
        </div>
    )
}
