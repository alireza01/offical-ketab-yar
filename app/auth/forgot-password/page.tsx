import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import { Metadata } from 'next'
import { Suspense } from 'react'
import ForgotPasswordLoading from './loading'

export const metadata: Metadata = {
    title: 'بازیابی رمز عبور | کتاب‌یار',
    description: 'رمز عبور خود را فراموش کرده‌اید؟ نگران نباشید، می‌توانید آن را بازیابی کنید',
    robots: {
        index: false,
        follow: false,
    },
}

// Force dynamic rendering for auth pages
export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
    return (
        <div className="container flex min-h-screen items-center justify-center py-8">
            <div className="w-full max-w-md">
                <Suspense fallback={<ForgotPasswordLoading />}>
                    <ForgotPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
