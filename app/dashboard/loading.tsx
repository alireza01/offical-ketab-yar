import { Card, CardContent } from "@/components/ui/card"
import { LoadingBar } from "@/components/ui/loading-bar"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Dashboard Loading State
 * Agent 2 (Performance): CSR page with responsive skeleton
 * Agent 3 (Psychology): Engaging dashboard feel
 */
export default function DashboardLoading() {
  return (
    <>
      <LoadingBar />

      <div className="min-h-screen">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" shimmer />
              <Skeleton className="h-4 w-48" shimmer />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" shimmer />
                        <Skeleton className="h-6 w-12" shimmer />
                      </div>
                      <Skeleton className="size-10 rounded-full" shimmer />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="mb-4 h-6 w-48" shimmer />
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="size-12 rounded" shimmer />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" shimmer />
                            <Skeleton className="h-3 w-3/4" shimmer />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="mb-4 h-6 w-32" shimmer />
                    <div className="space-y-4">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" shimmer />
                            <Skeleton className="h-4 w-16" shimmer />
                          </div>
                          <Skeleton className="h-2 w-full rounded-full" shimmer />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" shimmer />
              <Skeleton className="h-3 w-36" shimmer />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" shimmer />
                      <Skeleton className="h-6 w-10" shimmer />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <Card>
              <CardContent className="p-4">
                <Skeleton className="mb-4 h-5 w-32" shimmer />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded" shimmer />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-full" shimmer />
                        <Skeleton className="h-2 w-2/3" shimmer />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card>
              <CardContent className="p-4">
                <Skeleton className="mb-3 h-5 w-24" shimmer />
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" shimmer />
                        <Skeleton className="h-3 w-12" shimmer />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" shimmer />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
