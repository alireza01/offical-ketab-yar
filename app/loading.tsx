import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gold-500/20 z-50">
        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 animate-pulse" style={{ width: '60%' }} />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section Skeleton */}
        <div className="mb-16 space-y-6">
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>

        {/* Book Grid Skeleton */}
        <div className="space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
