import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Mail } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'تأیید ایمیل | کتاب‌یار',
    description: 'لطفاً ایمیل خود را تأیید کنید',
    robots: {
        index: false,
        follow: false,
    },
}

export default function VerifyEmailPage() {
    return (
        <div className="container flex min-h-screen items-center justify-center py-8">
            <div className="w-full max-w-md">
                <Card className="border-gold/20">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/10">
                            <Mail className="size-6 text-gold" />
                        </div>
                        <CardTitle className="text-2xl font-bold">ایمیل خود را تأیید کنید</CardTitle>
                        <CardDescription>
                            یک ایمیل تأیید برای شما ارسال شده است
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Alert>
                            <CheckCircle className="size-4" />
                            <AlertDescription>
                                لطفاً صندوق ورودی ایمیل خود را بررسی کنید و روی لینک تأیید کلیک کنید.
                                اگر ایمیل را نمی‌بینید، پوشه اسپم را هم چک کنید.
                            </AlertDescription>
                        </Alert>

                        <div className="rounded-lg bg-muted p-4 text-sm">
                            <p className="mb-2 font-semibold">چرا باید ایمیل را تأیید کنم؟</p>
                            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                                <li>امنیت حساب کاربری شما</li>
                                <li>دریافت اطلاعیه‌های مهم</li>
                                <li>بازیابی رمز عبور در صورت نیاز</li>
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-2">
                        <Link href="/auth/login" className="w-full">
                            <Button variant="outline" className="w-full">
                                بازگشت به صفحه ورود
                            </Button>
                        </Link>
                        <div className="text-center text-xs text-muted-foreground">
                            ایمیل دریافت نکردید؟ چند دقیقه صبر کنید یا دوباره تلاش کنید
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
