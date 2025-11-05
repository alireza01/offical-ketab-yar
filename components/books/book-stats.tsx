'use client'

import { getBookViewStats } from '@/lib/actions/book-tracking'
import { motion } from 'framer-motion'
import { BookOpen, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

interface BookStatsProps {
    bookId: string
    className?: string
}

export function BookStats({ bookId, className = '' }: BookStatsProps) {
    const [stats, setStats] = useState<{
        views: number
        reads: number
    } | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            try {
                const result = await getBookViewStats(bookId)
                if (result.success) {
                    setStats({
                        views: result.views || 0,
                        reads: result.reads || 0,
                    })
                }
            } catch (error) {
                console.error('Error loading book stats:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadStats()
    }, [bookId])

    if (isLoading) {
        return (
            <div className={`flex flex-wrap items-center gap-6 ${className}`}>
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </div>
        )
    }

    if (!stats) {
        return null
    }

    const statItems = [
        {
            icon: Eye,
            label: 'بازدید',
            value: stats.views,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: BookOpen,
            label: 'خوانده شده',
            value: stats.reads,
            color: 'text-gold-500',
            bgColor: 'bg-gold-500/10',
        },
    ]

    return (
        <div className={`flex flex-wrap items-center gap-4 ${className}`}>
            {statItems.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${item.bgColor} border border-${item.color}/20`}
                >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                            {item.value.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

/**
 * Compact version for cards
 */
export function BookStatsCompact({ bookId }: { bookId: string }) {
    const [stats, setStats] = useState<{
        views: number
        reads: number
    } | null>(null)

    useEffect(() => {
        async function loadStats() {
            try {
                const result = await getBookViewStats(bookId)
                if (result.success) {
                    setStats({
                        views: result.views || 0,
                        reads: result.reads || 0,
                    })
                }
            } catch (error) {
                console.error('Error loading book stats:', error)
            }
        }

        loadStats()
    }, [bookId])

    if (!stats) {
        return null
    }

    return (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{stats.views.toLocaleString('fa-IR')}</span>
            </div>
            <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{stats.reads.toLocaleString('fa-IR')}</span>
            </div>
        </div>
    )
}
