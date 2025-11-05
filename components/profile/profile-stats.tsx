'use client'

import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface ProfileStatsProps {
    userId: string
}

export function ProfileStats({ userId }: ProfileStatsProps) {
    const [stats, setStats] = useState({
        booksRead: 0,
        pagesRead: 0,
        wordsSaved: 0,
        readingTime: 0,
    })
    const supabase = createClient()

    useEffect(() => {
        const loadStats = async () => {
            // Load user stats from database
            const { data: libraryData } = await supabase
                .from('user_library')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'completed')

            const { data: vocabularyData } = await supabase
                .from('vocabulary')
                .select('id')
                .eq('user_id', userId)

            setStats({
                booksRead: libraryData?.length || 0,
                pagesRead: 0, // Calculate from reading sessions
                wordsSaved: vocabularyData?.length || 0,
                readingTime: 0, // Calculate from reading sessions
            })
        }

        loadStats()
    }, [userId, supabase])

    const displayStats = [
        { label: 'کتاب‌های خوانده شده', value: stats.booksRead.toString() },
        { label: 'صفحات خوانده شده', value: stats.pagesRead.toLocaleString() },
        { label: 'کلمات ذخیره شده', value: stats.wordsSaved.toString() },
        { label: 'زمان مطالعه', value: `${stats.readingTime}h` },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayStats.map((stat) => (
                <Card key={stat.label} className="p-4 text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
            ))}
        </div>
    )
}
