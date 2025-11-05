import { Skeleton } from '@/components/ui/skeleton'

export default function LibraryLoading() {
  return (
    <div className="min-h-screen">
      {/* Progress Bar (Agent 3 - Psychology) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gold-500/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-gold-600 to-gold-400 animate-pulse"
          style={{ width: '60%' }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </div>

        {/* Book Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
