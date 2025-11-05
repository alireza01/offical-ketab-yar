import { createServerClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'ورود | کتاب‌یار',
    description: 'ورود به حساب کاربری کتاب‌یار',
    robots: {
        index: false,
        follow: false,
    },
}

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // If user is already logged in, redirect to dashboard
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gold/5 p-4">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    )
}
