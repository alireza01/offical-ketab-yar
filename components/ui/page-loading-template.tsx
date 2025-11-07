'use client'

import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from 'react'

/**
 * Reusable Page Loading Template
 * Agent 2 (Performance): Consistent loading patterns
 * Agent 3 (Psychology): Premium loading experience
 */

interface PageLoadingTemplateProps {
    /**
     * Desktop layout content
     */
    desktop: ReactNode
    /**
     * Mobile layout content
     */
    mobile: ReactNode
    /**
     * Show loading bar at top
     */
    showLoadingBar?: boolean
}

export function PageLoadingTemplate({
    desktop,
    mobile,
    showLoadingBar = true,
}: PageLoadingTemplateProps) {
    return (
        <>
            {showLoadingBar && <LoadingBar />}

            <div className="min-h-screen">
                {/* Desktop Layout */}
                <div className="hidden md:block">{desktop}</div>

                {/* Mobile Layout */}
                <div className="md:hidden">{mobile}</div>
            </div>
        </>
    )
}

/**
 * Common skeleton patterns for reuse
 */
export const SkeletonPatterns = {
    /**
     * Book card skeleton (for grids)
     */
    BookCard: ({ shimmer = true }: { shimmer?: boolean }) => (
        <div className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer={shimmer} />
            <Skeleton className="h-4 w-full" shimmer={shimmer} />
            <Skeleton className="h-3 w-2/3" shimmer={shimmer} />
            <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded-full" shimmer={shimmer} />
                <Skeleton className="h-3 w-12" shimmer={shimmer} />
            </div>
        </div>
    ),

    /**
     * User profile header skeleton
     */
    ProfileHeader: ({ shimmer = true }: { shimmer?: boolean }) => (
        <div className="flex items-center gap-4">
            <Skeleton variant="avatar" className="size-16" shimmer={shimmer} />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-40" shimmer={shimmer} />
                <Skeleton className="h-4 w-56" shimmer={shimmer} />
            </div>
        </div>
    ),

    /**
     * Stats card skeleton
     */
    StatsCard: ({ shimmer = true }: { shimmer?: boolean }) => (
        <div className="space-y-2">
            <Skeleton className="h-4 w-24" shimmer={shimmer} />
            <Skeleton className="h-8 w-16" shimmer={shimmer} />
            <Skeleton className="h-3 w-20" shimmer={shimmer} />
        </div>
    ),

    /**
     * Text content skeleton (paragraphs)
     */
    TextContent: ({ lines = 4, shimmer = true }: { lines?: number; shimmer?: boolean }) => (
        <div className="space-y-2">
            {[...Array(lines)].map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
                    shimmer={shimmer}
                />
            ))}
        </div>
    ),

    /**
     * Blog post card skeleton
     */
    BlogCard: ({ shimmer = true }: { shimmer?: boolean }) => (
        <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" shimmer={shimmer} />
            <div className="space-y-2">
                <Skeleton className="h-6 w-full" shimmer={shimmer} />
                <Skeleton className="h-4 w-full" shimmer={shimmer} />
                <Skeleton className="h-4 w-2/3" shimmer={shimmer} />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton variant="avatar" className="size-8" shimmer={shimmer} />
                <Skeleton className="h-4 w-24" shimmer={shimmer} />
            </div>
        </div>
    ),

    /**
     * Comment/Review skeleton
     */
    Comment: ({ shimmer = true }: { shimmer?: boolean }) => (
        <div className="flex items-start gap-4">
            <Skeleton variant="avatar" shimmer={shimmer} />
            <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" shimmer={shimmer} />
                    <Skeleton className="h-4 w-24" shimmer={shimmer} />
                </div>
                <Skeleton className="h-4 w-20" shimmer={shimmer} />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" shimmer={shimmer} />
                    <Skeleton className="h-4 w-full" shimmer={shimmer} />
                    <Skeleton className="h-4 w-3/4" shimmer={shimmer} />
                </div>
            </div>
        </div>
    ),
}
