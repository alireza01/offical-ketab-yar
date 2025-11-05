'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, KeyRound, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isValidToken, setIsValidToken] = useState(true)

    useEffect(() => {
        // Check if we have a valid recovery token
        const checkToken = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setIsValidToken(false)
            }
        }
        checkToken()
    }, [supabase.auth])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('رمز عبور و تکرار آن یکسان نیستند')
            return
        }

        if (password.length < 6) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) throw error

            setSuccess(true)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/auth/login')
            }, 3000)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داد'
            setError('خطا در تنظیم رمز عبور. لطفاً دوباره تلاش کنید.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isValidToken) {
        return (
            <Card className="border-destructive/20">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="size-6 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">لینک نامعتبر</CardTitle>
                    <CardDescription>
                        لینک بازیابی رمز عبور منقضی شده یا نامعتبر است
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertDescription>
                            لطفاً دوباره درخواست بازیابی رمز عبور دهید
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Link href="/auth/forgot-password" className="w-full">
                        <Button className="w-full bg-gold hover:bg-gold/90">
                            درخواست لینک جدید
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        )
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="border-green-500/20">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-500/10">
                            <CheckCircle className="size-6 text-green-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold">رمز عبور تغییر کرد!</CardTitle>
                        <CardDescription>
                            رمز عبور شما با موفقیت تنظیم شد
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert>
                            <CheckCircle className="size-4" />
                            <AlertDescription>
                                در حال انتقال به صفحه ورود...
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-gold/20">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/10">
                        <KeyRound className="size-6 text-gold" />
                    </div>
                    <CardTitle className="text-2xl font-bold">تنظیم رمز عبور جدید</CardTitle>
                    <CardDescription>
                        رمز عبور جدید خود را وارد کنید
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="size-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password">رمز عبور جدید</Label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="حداقل ۶ کاراکتر"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 size-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="تکرار رمز عبور"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gold hover:bg-gold/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 size-4 animate-spin" />
                                    در حال تنظیم...
                                </>
                            ) : (
                                'تنظیم رمز عبور'
                            )}
                        </Button>
                    </CardContent>
                </form>

                <CardFooter>
                    <div className="text-center text-sm text-muted-foreground">
                        <Link href="/auth/login" className="text-gold hover:underline">
                            بازگشت به صفحه ورود
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
