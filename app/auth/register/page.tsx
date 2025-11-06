import { Metadata } from 'next'
import dynamicImport from 'next/dynamic'
import { Suspense } from 'react'
import RegisterLoading from './loading'

const RegisterForm = dynamicImport(() => import('@/components/auth/register-form'), {
    loading: () => <RegisterLoading />,
})

export const metadata: Metadata = {
    title: 'ثبت‌نام در کتاب‌یار',
    description: 'حساب کاربری جدید بسازید و سفر یادگیری خود را آغاز کنید',
    robots: {
        index: false,
        follow: false,
    },
}

// Force dynamic rendering for auth pages
export const dynamic = 'force-dynamic'

export default function RegisterPage() {
    return (
        <div className="container flex min-h-screen items-center justify-center py-8">
            <div className="w-full max-w-md">
                <Suspense fallback={<RegisterLoading />}>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    )
}
