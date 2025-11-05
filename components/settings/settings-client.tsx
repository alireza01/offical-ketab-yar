'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SettingsTabs } from './settings-tabs'

export default function SettingsClient() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()

                if (userError || !authUser) {
                    router.push('/auth/login')
                    return
                }

                setUser(authUser)
            } catch (err) {
                console.error('Error checking auth:', err)
                setError('خطا در بارگذاری تنظیمات')
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router, supabase])

    if (isLoading) {
        return null // Skeleton is shown by parent
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">تنظیمات</h1>
                <p className="text-muted-foreground">
                    تنظیمات خواندن، اعلان‌ها و حریم خصوصی خود را مدیریت کنید
                </p>
            </div>
            <SettingsTabs userId={user.id} userEmail={user.email} />
        </div>
    )
}
