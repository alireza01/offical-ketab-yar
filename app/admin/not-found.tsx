import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function AdminNotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileQuestion className="h-5 w-5" />
                        صفحه یافت نشد
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        صفحه مورد نظر شما در پنل مدیریت یافت نشد.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/admin">بازگشت به داشبورد</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
