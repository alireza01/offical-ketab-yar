'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface ReaderClientProps {
    bookId: string
    userId: string
}

export function ReaderClient({ bookId, userId }: ReaderClientProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    )
}
