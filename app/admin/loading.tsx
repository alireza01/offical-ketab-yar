import { Skeleton } from '@/components/ui/skeleton'

export default function AdminLoading() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-64" />
                <Skeleton className="col-span-3 h-64" />
            </div>
        </div>
    )
}
