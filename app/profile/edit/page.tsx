"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { UserAvatar } from '@/components/profile/user-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { createBrowserClient } from '@/lib/supabase/client'
import { getUserProfile, updateUserProfile, type UserProfile } from '@/lib/supabase/queries/user'

/**
 * Edit Profile Page (Pure CSR)
 * Form for editing user profile information
 * Implements:
 * - Agent 2: Optimistic UI updates, zero server load
 * - Agent 3: Smooth animations, instant feedback
 */

const profileFormSchema = z.object({
    full_name: z.string().min(2, 'نام کامل باید حداقل 2 کاراکتر باشد').max(50, 'نام کامل نباید بیشتر از 50 کاراکتر باشد'),
    username: z.string().min(3, 'نام کاربری باید حداقل 3 کاراکتر باشد').max(30, 'نام کاربری نباید بیشتر از 30 کاراکتر باشد').regex(/^[a-zA-Z0-9_]+$/, 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد').optional().or(z.literal('')),
    bio: z.string().max(200, 'بیوگرافی نباید بیشتر از 200 کاراکتر باشد').optional().or(z.literal('')),
    website: z.string().url('آدرس وب‌سایت معتبر نیست').optional().or(z.literal('')),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    language_preference: z.enum(['fa', 'en']),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function EditProfilePage() {
    const router = useRouter()
    const supabase = createBrowserClient()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            full_name: '',
            username: '',
            bio: '',
            website: '',
            level: 'beginner',
            language_preference: 'fa',
        },
    })

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                redirect('/auth/login')
                return
            }

            const userProfile = await getUserProfile(user.id)
            if (userProfile) {
                setProfile(userProfile)
                form.reset({
                    full_name: userProfile.full_name || '',
                    username: userProfile.username || '',
                    bio: userProfile.bio || '',
                    website: userProfile.website || '',
                    level: userProfile.level,
                    language_preference: userProfile.language_preference as 'fa' | 'en',
                })
            }
            setIsLoading(false)
        }

        loadProfile()
    }, [supabase, form])

    const onSubmit = async (data: ProfileFormValues) => {
        if (!profile) return

        setIsSaving(true)

        try {
            const result = await updateUserProfile(profile.id, {
                full_name: data.full_name,
                username: data.username || undefined,
                bio: data.bio || undefined,
                website: data.website || undefined,
                level: data.level,
                language_preference: data.language_preference,
            })

            if (result.success) {
                toast.success('پروفایل با موفقیت به‌روزرسانی شد')
                router.push('/profile')
            } else {
                toast.error(result.error || 'خطا در به‌روزرسانی پروفایل')
            }
        } catch {
            toast.error('خطا در به‌روزرسانی پروفایل')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <EditProfileSkeleton />
    }

    if (!profile) {
        return null
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/profile">
                        <ArrowRight className="w-4 h-4 ml-2" />
                        بازگشت به پروفایل
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">ویرایش پروفایل</h1>
                <p className="text-muted-foreground mt-2">
                    اطلاعات پروفایل خود را ویرایش کنید
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>تصویر پروفایل</CardTitle>
                            <CardDescription>
                                برای تغییر تصویر پروفایل، روی آن کلیک کنید
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <UserAvatar
                                userId={profile.id}
                                avatarUrl={profile.avatar_url}
                                fullName={profile.full_name}
                                size="xl"
                                editable={true}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Profile Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>اطلاعات شخصی</CardTitle>
                            <CardDescription>
                                اطلاعات عمومی پروفایل خود را وارد کنید
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Full Name */}
                                    <FormField
                                        control={form.control}
                                        name="full_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>نام کامل *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="نام و نام خانوادگی" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Username */}
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>نام کاربری</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="username" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    نام کاربری شما در آدرس پروفایل نمایش داده می‌شود
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Bio */}
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>بیوگرافی</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="درباره خودتان بنویسید..."
                                                        className="resize-none"
                                                        rows={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    حداکثر 200 کاراکتر
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Website */}
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>وب‌سایت</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Reading Level */}
                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>سطح مطالعه</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="سطح خود را انتخاب کنید" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="beginner">مبتدی</SelectItem>
                                                        <SelectItem value="intermediate">متوسط</SelectItem>
                                                        <SelectItem value="advanced">پیشرفته</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    این به ما کمک می‌کند کتاب‌های مناسب را پیشنهاد دهیم
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Language Preference */}
                                    <FormField
                                        control={form.control}
                                        name="language_preference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>زبان ترجیحی</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="زبان را انتخاب کنید" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="fa">فارسی</SelectItem>
                                                        <SelectItem value="en">English</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    زبان پیش‌فرض برای نمایش محتوا
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-gradient-to-r from-[#D4AF37] to-[#B8956A] hover:from-[#C9A961] hover:to-[#A67C52]"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push('/profile')}
                                            disabled={isSaving}
                                        >
                                            انصراف
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

function EditProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
            <Skeleton className="h-8 w-48" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Skeleton className="w-32 h-32 rounded-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
