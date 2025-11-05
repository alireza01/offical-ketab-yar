import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const ResetPasswordForm = dynamic(() => import('@/components/auth/reset-password-form'), {
    loading: () => (
        <Card className="mx-auto max-w-md">
            <CardHeader className="space-y-2">
                <Skeleton className="mx-auto size-12 rounded-full" />
                <Skeleton className="mx-auto h-8 w-3/4" />
                <Skeleton className="mx-auto h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    ),
})

export const metadata: Metadata = {
    title: 'تنظیم رمز عبور جدید | کتاب‌یار',
    description: 'رمز عبور جدید خود را تنظیم کنید',
    robots: {
        index: false,
        follow: false,
    },
}

export default function ResetPasswordPage() {
    return (
        <div className="container flex min-h-screen items-center justify-center py-8">
            <div className="w-full max-w-md">
                <Suspense>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
