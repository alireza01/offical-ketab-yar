import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LoadingBar } from "@/components/ui/loading-bar"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Auth Page Loading State
 * Agent 2 (Performance): Fast loading skeleton
 * Agent 3 (Psychology): Premium auth experience
 */
export default function AuthLoading() {
  return (
    <>
      <LoadingBar />

      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <Skeleton className="mx-auto h-8 w-3/4" shimmer />
            <Skeleton className="h-4 w-full" shimmer />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" shimmer />
            <Skeleton className="h-10 w-full" shimmer />
            <Skeleton className="h-10 w-full" shimmer />
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <Skeleton className="h-px w-full" shimmer />
              </div>
              <div className="relative flex justify-center">
                <Skeleton className="mx-auto h-4 w-16" shimmer />
              </div>
            </div>
            <Skeleton className="h-10 w-full" shimmer />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
