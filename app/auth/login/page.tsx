import LoginForm from '@/components/auth/login-form'
import { Metadata } from 'next'
import { Suspense } from 'react'
import LoginLoading from './loading'

// Agent 1 (SEO): Block from search engines
export const metadata: Metadata = {
    title: 'ورود به کتاب‌یار',
    description: 'وارد حساب کاربری خود شوید و به دنیای کتاب‌های دوزبانه بپیوندید',
    robots: {
        index: false,
        follow: false,
    },
}

export default function LoginPage() {
    return (
        <div className="container flex min-h-screen items-center justify-center py-8">
            <div className="w-full max-w-md">
                <Suspense fallback={<LoginLoading />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
