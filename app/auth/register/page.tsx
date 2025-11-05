import { RegisterForm } from '@/components/auth'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'ثبت‌نام | کتاب‌یار',
    description: 'ایجاد حساب کاربری جدید در کتاب‌یار',
}

export default function RegisterPage() {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">عضویت در کتاب‌یار</h1>
                <p className="text-muted-foreground">
                    سفر یادگیری خود را با ما شروع کنید
                </p>
                <p className="text-sm text-gold">
                    ✨ به جمع هزاران خواننده علاقه‌مند بپیوندید
                </p>
            </div>

            <RegisterForm />

            <div className="text-center text-sm">
                <span className="text-muted-foreground">قبلاً ثبت‌نام کرده‌اید؟ </span>
                <Link
                    href="/auth/login"
                    className="text-gold hover:text-gold/80 font-medium transition-colors"
                >
                    وارد شوید
                </Link>
            </div>
        </div>
    )
}
