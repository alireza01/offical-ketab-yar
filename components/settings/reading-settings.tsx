'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import { BookOpen, Save, Type } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ReadingSettingsProps {
    userId: string
}

export default function ReadingSettings({ userId }: ReadingSettingsProps) {
    const [fontSize, setFontSize] = useState([16])
    const [lineHeight, setLineHeight] = useState([1.6])
    const [fontFamily, setFontFamily] = useState('vazirmatn')
    const [pageAnimation, setPageAnimation] = useState(true)
    const [autoSave, setAutoSave] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // TODO: Save to database
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success('تنظیمات با موفقیت ذخیره شد')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('خطا در ذخیره تنظیمات')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Type className="size-5 text-gold" />
                        <CardTitle>تنظیمات متن</CardTitle>
                    </div>
                    <CardDescription>ظاهر متن را برای راحتی بیشتر تنظیم کنید</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Font Family */}
                    <div className="space-y-2">
                        <Label>فونت</Label>
                        <Select value={fontFamily} onValueChange={setFontFamily}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vazirmatn">وزیرمتن (پیش‌فرض)</SelectItem>
                                <SelectItem value="inter">Inter</SelectItem>
                                <SelectItem value="system">فونت سیستم</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Font Size */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>اندازه فونت</Label>
                            <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                        </div>
                        <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            min={12}
                            max={24}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>کوچک</span>
                            <span>بزرگ</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Line Height */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>فاصله خطوط</Label>
                            <span className="text-sm text-muted-foreground">{lineHeight[0].toFixed(1)}</span>
                        </div>
                        <Slider
                            value={lineHeight}
                            onValueChange={setLineHeight}
                            min={1.2}
                            max={2.4}
                            step={0.1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>فشرده</span>
                            <span>باز</span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-lg border p-4 bg-muted/50">
                        <p
                            style={{
                                fontSize: `${fontSize[0]}px`,
                                lineHeight: lineHeight[0],
                                fontFamily: fontFamily === 'vazirmatn' ? 'var(--font-vazirmatn)' : fontFamily === 'inter' ? 'var(--font-inter)' : 'system-ui',
                            }}
                        >
                            این یک متن نمونه است برای پیش‌نمایش تنظیمات شما. This is a sample text to preview your settings.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BookOpen className="size-5 text-gold" />
                        <CardTitle>تنظیمات خواندن</CardTitle>
                    </div>
                    <CardDescription>رفتار کتاب‌خوان را تنظیم کنید</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>انیمیشن ورق زدن صفحه</Label>
                            <p className="text-sm text-muted-foreground">
                                نمایش انیمیشن هنگام تغییر صفحه
                            </p>
                        </div>
                        <Switch checked={pageAnimation} onCheckedChange={setPageAnimation} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>ذخیره خودکار پیشرفت</Label>
                            <p className="text-sm text-muted-foreground">
                                ذخیره خودکار صفحه فعلی و پیشرفت خواندن
                            </p>
                        </div>
                        <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    <Save className="size-4" />
                    {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                </Button>
            </div>
        </motion.div>
    )
}
