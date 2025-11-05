'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, KeyRound, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordForm() {
    const { resetPassword } = useSupabaseAuth()
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setIsLoading(true)

        try {
            await resetPassword(email)
            setSuccess(true)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داد'

            if (errorMessage.includes('not found')) {
                setError('این ایمیل در سیستم ثبت نشده است')
            } else {
                setError('خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید.')
            }
        } finally {
            setIsLoading(false)
        }
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
                        <CardTitle className="text-2xl font-bold">ایمیل ارسال شد!</CardTitle>
                        <CardDescription>
                            لینک بازیابی رمز عبور به ایمیل شما ارسال شد
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Mail className="size-4" />
                            <AlertDescription>
                                لطفاً ایمیل خود را بررسی کنید و روی لینک بازیابی کلیک کنید.
                                اگر ایمیل را نمی‌بینید، پوشه اسپم را هم چک کنید.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Link href="/auth/login" className="w-full">
                            <Button variant="outline" className="w-full">
                                بازگشت به صفحه ورود
                            </Button>
                        </Link>
                    </CardFooter>
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
                    <CardTitle className="text-2xl font-bold">فراموشی رمز عبور</CardTitle>
                    <CardDescription>
                        ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
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
                            <Label htmlFor="email">ایمیل</Label>
                            <div className="relative">
                                <Mail className="absolute right-3 top-3 size-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    در حال ارسال...
                                </>
                            ) : (
                                'ارسال لینک بازیابی'
                            )}
                        </Button>
                    </CardContent>
                </form>

                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                        رمز عبور خود را به یاد آوردید؟{' '}
                        <Link href="/auth/login" className="text-gold hover:underline">
                            وارد شوید
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
