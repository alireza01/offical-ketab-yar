'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterForm() {
    const router = useRouter()
    const { signUp } = useSupabaseAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError('رمز عبور و تکرار آن یکسان نیستند')
            return
        }

        if (password.length < 6) {
            setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
            return
        }

        if (!acceptTerms) {
            setError('لطفاً قوانین و مقررات را بپذیرید')
            return
        }

        setIsLoading(true)

        try {
            await signUp(email, password)
            // Success - redirected by auth hook
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'خطایی رخ داد'

            if (errorMessage.includes('already registered')) {
                setError('این ایمیل قبلاً ثبت شده است. می‌خواهید وارد شوید؟')
            } else if (errorMessage.includes('Invalid email')) {
                setError('فرمت ایمیل صحیح نیست')
            } else {
                setError('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.')
            }
        } finally {
            setIsLoading(false)
        }
    }

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
                        <Sparkles className="size-6 text-gold" />
                    </div>
                    <CardTitle className="text-2xl font-bold">شروع سفر یادگیری</CardTitle>
                    <CardDescription>
                        حساب کاربری بسازید و ۵۰ امتیاز هدیه بگیرید! 🎁
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
                            <Label htmlFor="name">نام و نام خانوادگی</Label>
                            <div className="relative">
                                <User className="absolute right-3 top-3 size-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="نام شما"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                />
                            </div>
                        </div>

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
                            <Label htmlFor="password">رمز عبور</Label>
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

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                disabled={isLoading}
                            />
                            <Label
                                htmlFor="terms"
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                <Link href="/terms" className="text-gold hover:underline">
                                    قوانین و مقررات
                                </Link>{' '}
                                را می‌پذیرم
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gold hover:bg-gold/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="ml-2 size-4 animate-spin" />
                                    در حال ثبت‌نام...
                                </>
                            ) : (
                                'ثبت‌نام و دریافت ۵۰ امتیاز'
                            )}
                        </Button>

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
                        قبلاً ثبت‌نام کرده‌اید؟{' '}
                        <Link href="/auth/login" className="text-gold hover:underline">
                            وارد شوید
                        </Link>
                    </div>

                    <div className="text-center text-xs text-muted-foreground">
                        با ثبت‌نام، استریک روزانه خود را شروع کنید 🔥
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
