'use client'

import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ReadingHistoryProps {
    userId: string
}

export function ReadingHistory({ userId }: ReadingHistoryProps) {
    const [history, setHistory] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const loadHistory = async () => {
            const { data } = await supabase
                .from('user_library')
                .select(`
                    updated_at,
                    books (
                        title,
                        cover_image_url
                    )
                `)
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(10)

            setHistory(data || [])
        }

        loadHistory()
    }, [userId, supabase])

    return (
        <Card className="p-6">
            <h3 className="font-semibold mb-4">فعالیت‌های اخیر</h3>
            <div className="space-y-3">
                {history.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        هنوز فعالیتی ثبت نشده است
                    </p>
                ) : (
                    history.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0">
                            {item.books?.cover_image_url ? (
                                <Image
                                    src={item.books.cover_image_url}
                                    alt={item.books.title}
                                    width={48}
                                    height={64}
                                    className="rounded object-cover"
                                />
                            ) : (
                                <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-medium text-sm">{item.books?.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(item.updated_at).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}
