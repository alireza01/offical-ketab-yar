import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ForgotPasswordLoading() {
    return (
        <Card className="mx-auto max-w-md">
            <CardHeader className="space-y-2">
                <Skeleton className="mx-auto size-12 rounded-full" />
                <Skeleton className="mx-auto h-8 w-3/4" />
                <Skeleton className="mx-auto h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
}
