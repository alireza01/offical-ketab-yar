'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Clock, Mail, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'

export function SupportClient() {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast({
            title: 'پیام شما ارسال شد',
            description: 'تیم پشتیبانی ما در اسرع وقت با شما تماس خواهند گرفت.',
        })

        setFormData({ name: '', email: '', subject: '', message: '' })
        setIsSubmitting(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="container max-w-5xl py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">تماس با پشتیبانی</h1>
                <p className="text-xl text-muted-foreground">
                    تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="text-center">
                        <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <CardTitle className="text-lg">ایمیل</CardTitle>
                        <CardDescription className="text-sm">
                            support@ketabyar.com
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="text-center">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <CardTitle className="text-lg">چت آنلاین</CardTitle>
                        <CardDescription className="text-sm">
                            پاسخگویی فوری
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <CardTitle className="text-lg">زمان پاسخگویی</CardTitle>
                        <CardDescription className="text-sm">
                            کمتر از 4 ساعت
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            {/* Contact Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>ارسال تیکت پشتیبانی</CardTitle>
                        <CardDescription>
                            فرم زیر را پر کنید تا در اسرع وقت با شما تماس بگیریم
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="نام خود را وارد کنید"
                                        required
                                        className="text-right"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">ایمیل</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="email@example.com"
                                        required
                                        className="text-right"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">موضوع</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="موضوع پیام خود را وارد کنید"
                                    required
                                    className="text-right"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">پیام</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="توضیحات کامل مشکل یا سوال خود را بنویسید..."
                                    required
                                    rows={6}
                                    className="text-right resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full"
                                size="lg"
                            >
                                {isSubmitting ? (
                                    'در حال ارسال...'
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 ml-2" />
                                        ارسال پیام
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* FAQ Quick Links */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">سوالات متداول</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <a
                                href="/help#getting-started"
                                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <h4 className="font-semibold text-sm">شروع کار</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    راهنمای ثبت‌نام و استفاده
                                </p>
                            </a>

                            <a
                                href="/help#subscription"
                                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <h4 className="font-semibold text-sm">اشتراک و پرداخت</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    سوالات مربوط به پرمیوم
                                </p>
                            </a>

                            <a
                                href="/help#features"
                                className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                            >
                                <h4 className="font-semibold text-sm">امکانات</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    نحوه استفاده از ویژگی‌ها
                                </p>
                            </a>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">پاسخگویی سریع</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                تیم پشتیبانی ما 24/7 در خدمت شماست و معمولاً در کمتر از 4 ساعت به تیکت‌ها پاسخ می‌دهیم.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
