/**
 * Download Book for Offline Reading
 * Agent 2 (Performance) + Agent 3 (Psychology)
 */

'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
    deleteBookOffline,
    isBookOffline,
    saveBookOffline,
} from '@/lib/pwa/offline-storage'
import { motion } from 'framer-motion'
import { Check, Download, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DownloadBookButtonProps {
    bookId: string
    bookData: {
        title: string
        author: string
        coverUrl: string
        contentEn: string
        contentFa: string
    }
    userId: string
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function DownloadBookButton({
    bookId,
    bookData,
    userId,
    variant = 'outline',
    size = 'default',
}: DownloadBookButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [isDownloaded, setIsDownloaded] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        checkIfDownloaded()
    }, [bookId])

    const checkIfDownloaded = async () => {
        try {
            const downloaded = await isBookOffline(bookId)
            setIsDownloaded(downloaded)
        } catch (error) {
            console.error('Failed to check offline status:', error)
        }
    }

    const handleDownload = async () => {
        if (isDownloaded) {
            // Delete offline book
            try {
                await deleteBookOffline(bookId)
                setIsDownloaded(false)
                toast({
                    title: 'حذف شد',
                    description: 'کتاب از حافظه آفلاین حذف شد',
                })
            } catch (error) {
                toast({
                    title: 'خطا',
                    description: 'حذف کتاب با مشکل مواجه شد',
                    variant: 'destructive',
                })
            }
            return
        }

        // Download book
        setIsDownloading(true)
        try {
            await saveBookOffline(
                bookId,
                {
                    en: bookData.contentEn,
                    fa: bookData.contentFa,
                },
                {
                    title: bookData.title,
                    author: bookData.author,
                    coverUrl: bookData.coverUrl,
                },
                userId
            )

            setIsDownloaded(true)
            toast({
                title: '✓ دانلود موفق',
                description: 'کتاب برای خواندن آفلاین آماده است',
            })
        } catch (error) {
            console.error('Download failed:', error)
            toast({
                title: 'خطا',
                description: 'دانلود کتاب با مشکل مواجه شد',
                variant: 'destructive',
            })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Button
            onClick={handleDownload}
            variant={variant}
            size={size}
            disabled={isDownloading}
            className="relative overflow-hidden"
        >
            {isDownloading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    در حال دانلود...
                </>
            ) : isDownloaded ? (
                <>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                    >
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                    </motion.div>
                    دانلود شده
                    <Trash2 className="ml-2 h-3 w-3 opacity-50" />
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    دانلود آفلاین
                </>
            )}

            {/* Download animation */}
            {isDownloading && (
                <motion.div
                    className="absolute inset-0 bg-gold/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
            )}
        </Button>
    )
}
