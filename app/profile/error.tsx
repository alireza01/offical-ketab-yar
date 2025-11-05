'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function ProfileError({
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="border-red-200">
                <CardContent className="p-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 p-4 rounded-full">
                            <AlertCircle className="w-12 h-12 text-red-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری پروفایل</h2>
                    <p className="text-muted-foreground mb-6">
                        متأسفانه در بارگذاری اطلاعات پروفایل شما مشکلی پیش آمد.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={reset} className="bg-[#D4AF37] hover:bg-[#C9A961]">
                            تلاش مجدد
                        </Button>
                        <Button variant="outline" asChild>
                            <a href="/dashboard">بازگشت به داشبورد</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
