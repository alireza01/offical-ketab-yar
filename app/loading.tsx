/**
 * ✅ AGENT 3 (Psychology): Premium loading experience with skeleton screens
 * Creates anticipation and maintains user engagement during load
 * ✅ AGENT 2 (Performance): Skeleton screens prevent layout shift (CLS = 0)
 */

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Premium Progress Bar (Agent 3 - Visual Feedback) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gold-500/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 animate-pulse"
          style={{ width: '60%' }}
        />
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-transparent">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content Skeleton */}
            <div className="space-y-6">
              <div className="skeleton h-12 w-3/4 rounded-lg" />
              <div className="skeleton h-8 w-full rounded-lg" />
              <div className="skeleton h-6 w-5/6 rounded-lg" />
              <div className="flex gap-4 mt-8">
                <div className="skeleton h-12 w-32 rounded-lg" />
                <div className="skeleton h-12 w-32 rounded-lg" />
              </div>
            </div>

            {/* Image Skeleton */}
            <div className="skeleton h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Book Grid Skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton h-10 w-24 rounded-lg" />
        </div>

        {/* Book Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Book Cover */}
              <div className="skeleton aspect-[2/3] w-full rounded-lg" />
              {/* Book Title */}
              <div className="skeleton h-4 w-full rounded" />
              {/* Book Author */}
              <div className="skeleton h-3 w-3/4 rounded" />
              {/* Rating */}
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Text with Animation (Agent 3 - Engagement) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-background/80 backdrop-blur-xl border border-gold-500/20 rounded-full px-6 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gold-600 dark:text-gold-400">
              در حال بارگذاری تجربه پریمیوم...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 
