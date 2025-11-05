'use client'

import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// ✅ AGENT 2 (PERFORMANCE): Dynamic import for heavy reader component
const ReaderWithTracking = dynamic(
    () => import('@/components/reader/reader-with-tracking').then(mod => ({ default: mod.ReaderWithTracking })),
    {
        loading: () => <ReaderSkeleton />,
        ssr: false, // CSR only - zero server load
    }
)

function ReaderSkeleton() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-[600px] w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    )
}

interface ReaderClientProps {
    book: {
        id: string
        slug: string
        title: string
        subtitle: string | null
        author: string
        coverImage: string | null
        totalPages: number | null
        freePreviewPages: number
        isPremium: boolean
        contentEn: string[]
        contentFa: string[]
        contentEnUrl: string | null
        contentFaUrl: string | null
        genres: string[]
        userIsPremium: boolean
        currentPage: number
        progressPercentage: number
        status: string
    }
    userId: string
    isGuest: boolean
}

export function ReaderClient({ book, userId }: ReaderClientProps) {
    // Transform book data to match ReaderWithTracking interface
    const transformedBook = {
        ...book,
        contentEnUrl: null,
        contentFaUrl: null,
        status: 'published',
    }

    return <ReaderWithTracking book={transformedBook} userId={userId} />
}
