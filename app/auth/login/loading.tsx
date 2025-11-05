import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="mx-auto h-9 w-32" />
        <Skeleton className="mx-auto h-5 w-64" />
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <div className="text-center">
        <Skeleton className="mx-auto h-4 w-48" />
      </div>
    </div>
  )
}
