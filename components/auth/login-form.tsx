'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { motion } from 'framer-motion'
import { AlertCircle, BookOpen, Loader2, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
    const router = useRouter()
    const { signIn } = useSupabaseAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Agent 3 (Psychology): Optimistic UI with helpful error messages
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await signIn(email, password)
            // Success handled by auth hook (redirects to dashboard)
        } catch (err) {
            // Agent 3: User-friendly error messages
            const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داد'

            if (errorMessage.includes('Invalid login credentials')) {
                setError('ایمیل یا رمز عبور اشتباه است. لطفاً دوباره تلاش کنید.')
            } else if (errorMessage.includes('Email not confirmed')) {
                setError('لطفاً ابتدا ایمیل خود را تأیید کنید.')
            } else {
                setError('خطا در ورود. لطفاً دوباره تلاش کنید.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Agent 3: Guest mode for freemium strategy
    const handleGuestMode = () => {
        router.push('/library')
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
                        <BookOpen className="size-6 text-gold" />
                    </div>
                    <CardTitle className="text-2xl font-bold">خوش آمدید</CardTitle>
                    <CardDescription>
                        برای ادامه، وارد حساب کاربری خود شوید
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

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">رمز عبور</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-gold hover:underline"
                                >
                                    فراموشی رمز عبور؟
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 size-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    در حال ورود...
                                </>
                            ) : (
                                'ورود'
                            )}
                        </Button>

                        {/* Agent 3: Guest mode for freemium */}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGuestMode}
                            disabled={isLoading}
                        >
                            ادامه به عنوان مهمان
                        </Button>
                    </CardContent>
                </form>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                        حساب کاربری ندارید؟{' '}
                        <Link href="/auth/register" className="text-gold hover:underline">
                            ثبت‌نام کنید
                        </Link>
                    </div>

                    {/* Agent 3: Social proof */}
                    <div className="text-center text-xs text-muted-foreground">
                        به بیش از ۱۰,۰۰۰ خواننده بپیوندید 📚
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
