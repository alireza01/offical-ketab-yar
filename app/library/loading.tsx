import { LoadingBar } from '@/components/ui/loading-bar'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Library Page Loading State
 * Agent 2 (Performance): Responsive skeleton matching exact layout
 * Agent 3 (Psychology): Smooth loading experience
 */
export default function LibraryLoading() {
  return (
    <>
      <LoadingBar />

      <div className="min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 space-y-4">
              <Skeleton className="h-12 w-64" shimmer />
              <Skeleton className="h-10 w-full max-w-md" shimmer />
              <div className="flex gap-2 flex-wrap">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" shimmer />
                ))}
              </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-5 gap-6">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                  <Skeleton className="h-4 w-full" shimmer />
                  <Skeleton className="h-3 w-2/3" shimmer />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" shimmer />
                    <Skeleton className="h-3 w-12" shimmer />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6 space-y-3">
              <Skeleton className="h-10 w-48" shimmer />
              <Skeleton className="h-9 w-full" shimmer />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full flex-shrink-0" shimmer />
                ))}
              </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" shimmer />
                  <Skeleton className="h-3 w-full" shimmer />
                  <Skeleton className="h-3 w-2/3" shimmer />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-2 w-2 rounded-full" shimmer />
                    <Skeleton className="h-2 w-10" shimmer />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
