import { LoginForm } from '@/components/auth'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'ورود | کتاب‌یار',
    description: 'ورود به حساب کاربری کتاب‌یار',
}

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">خوش آمدید</h1>
                <p className="text-muted-foreground">
                    برای ادامه به حساب کاربری خود وارد شوید
                </p>
            </div>

            <LoginForm />

            <div className="text-center text-sm">
                <span className="text-muted-foreground">حساب کاربری ندارید؟ </span>
                <Link
                    href="/auth/register"
                    className="text-gold hover:text-gold/80 font-medium transition-colors"
                >
                    ثبت‌نام کنید
                </Link>
            </div>
        </div>
    )
}
