'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BookOpen, CreditCard, MessageCircle, Search, Settings, Shield } from 'lucide-react'
import { useState } from 'react'

const faqCategories = [
    {
        id: 'getting-started',
        title: 'شروع کار',
        icon: BookOpen,
        questions: [
            {
                q: 'چگونه در کتاب‌یار ثبت‌نام کنم؟',
                a: 'برای ثبت‌نام، روی دکمه "ورود / ثبت‌نام" در بالای صفحه کلیک کنید. می‌توانید با ایمیل یا حساب گوگل خود ثبت‌نام کنید.'
            },
            {
                q: 'آیا استفاده از کتاب‌یار رایگان است؟',
                a: 'بله! کتاب‌یار یک نسخه رایگان دارد که به شما امکان می‌دهد 1 روز به صورت پرمیوم از تمام امکانات استفاده کنید.'
            },
            {
                q: 'چگونه یک کتاب را بخوانم؟',
                a: 'روی کتاب مورد نظر کلیک کنید و سپس دکمه "شروع خواندن" را بزنید. صفحه خواندن با امکانات پیشرفته باز می‌شود.'
            }
        ]
    },
    {
        id: 'subscription',
        title: 'اشتراک و پرداخت',
        icon: CreditCard,
        questions: [
            {
                q: 'چه تفاوتی بین نسخه رایگان و پرمیوم وجود دارد؟',
                a: 'نسخه پرمیوم دسترسی نامحدود به تمام کتاب‌ها، امکان ذخیره لغات بی‌نهایت، و استفاده از هوش مصنوعی را فراهم می‌کند.'
            },
            {
                q: 'چگونه اشتراک پرمیوم بخرم؟',
                a: 'از منوی پروفایل خود، گزینه "ارتقا به پرمیوم" را انتخاب کنید و روش پرداخت مورد نظر را انتخاب کنید.'
            },
            {
                q: 'آیا می‌توانم اشتراک خود را لغو کنم؟',
                a: 'بله، می‌توانید در هر زمان از بخش تنظیمات، اشتراک خود را لغو کنید. تا پایان دوره پرداخت شده، دسترسی پرمیوم خود را خواهید داشت.'
            }
        ]
    },
    {
        id: 'features',
        title: 'امکانات',
        icon: Settings,
        questions: [
            {
                q: 'چگونه می‌توانم زبان کتاب را تغییر دهم؟',
                a: 'در حین خواندن، روی دکمه "EN/FA" در بالای صفحه کلیک کنید تا بین نسخه انگلیسی و فارسی جابجا شوید.'
            },
            {
                q: 'چگونه لغات جدید را ذخیره کنم؟',
                a: 'روی کلمه مورد نظر کلیک کنید، معنی آن نمایش داده می‌شود و می‌توانید آن را به لیست لغات خود اضافه کنید.'
            },
            {
                q: 'سیستم XP و استریک چگونه کار می‌کند؟',
                a: 'با خواندن کتاب‌ها XP کسب می‌کنید. اگر هر روز بخوانید، استریک روزانه شما افزایش می‌یابد و به شما امتیاز بیشتری می‌دهد.'
            }
        ]
    },
    {
        id: 'support',
        title: 'پشتیبانی',
        icon: MessageCircle,
        questions: [
            {
                q: 'چگونه با پشتیبانی تماس بگیرم؟',
                a: 'از صفحه "تماس با پشتیبانی" می‌توانید تیکت ارسال کنید یا از طریق ایمیل با ما در ارتباط باشید.'
            },
            {
                q: 'زمان پاسخگویی پشتیبانی چقدر است؟',
                a: 'تیم پشتیبانی ما معمولاً در کمتر از 4 ساعت به تیکت‌ها پاسخ می‌دهد.'
            }
        ]
    },
    {
        id: 'privacy',
        title: 'حریم خصوصی و امنیت',
        icon: Shield,
        questions: [
            {
                q: 'اطلاعات من چقدر امن است؟',
                a: 'ما از بالاترین استانداردهای امنیتی استفاده می‌کنیم و هیچ اطلاعاتی را با شخص ثالث به اشتراک نمی‌گذاریم.'
            },
            {
                q: 'آیا می‌توانم حساب خود را حذف کنم؟',
                a: 'بله، از بخش تنظیمات می‌توانید حساب کاربری خود را به طور کامل حذف کنید.'
            }
        ]
    }
]

export function HelpClient() {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started')

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
            q => q.q.includes(searchQuery) || q.a.includes(searchQuery)
        )
    })).filter(category => category.questions.length > 0)

    return (
        <div className="container max-w-5xl py-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">مرکز راهنمایی</h1>
                <p className="text-xl text-muted-foreground">
                    پاسخ سوالات متداول و راهنمای استفاده از کتاب‌یار
                </p>
            </div>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="جستجو در سوالات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 text-right"
                />
            </div>

            {/* FAQ Categories */}
            <div className="space-y-6">
                {filteredCategories.map((category) => {
                    const Icon = category.icon
                    const isExpanded = expandedCategory === category.id

                    return (
                        <Card key={category.id}>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-xl">{category.title}</CardTitle>
                                    <span className="mr-auto text-sm text-muted-foreground">
                                        {category.questions.length} سوال
                                    </span>
                                </div>
                            </CardHeader>
                            {isExpanded && (
                                <CardContent className="space-y-4 pt-0">
                                    {category.questions.map((item, index) => (
                                        <div key={index} className="border-r-4 border-primary/20 pr-4 space-y-2">
                                            <h3 className="font-semibold text-lg">{item.q}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>

            {/* Contact Support CTA */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>سوال شما پاسخ داده نشد؟</CardTitle>
                    <CardDescription>
                        تیم پشتیبانی ما آماده کمک به شماست. از صفحه پشتیبانی با ما در ارتباط باشید.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
