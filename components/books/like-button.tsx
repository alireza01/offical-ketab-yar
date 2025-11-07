/**
 * Like Button Component
 * Agent 3 (Psychology): Satisfying heart animation
 * 
 * Features:
 * - Heart animation on click
 * - Works offline
 * - Visual feedback
 * - Accessible
 */

'use client'

import { Button } from '@/components/ui/button'
import { useLikedBooks } from '@/hooks/use-liked-books'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface LikeButtonProps {
    book: {
        id: string
        slug: string
        title: string
        cover_url: string | null
    }
    variant?: 'default' | 'ghost' | 'outline'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    showLabel?: boolean
    className?: string
}

export function LikeButton({
    book,
    variant = 'ghost',
    size = 'icon',
    showLabel = false,
    className,
}: LikeButtonProps) {
    const { isLiked, toggleLike } = useLikedBooks()
    const [isAnimating, setIsAnimating] = useState(false)
    const liked = isLiked(book.id)

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Trigger animation
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 600)

        // Toggle like
        await toggleLike(book)
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn(
                'relative transition-all',
                liked && 'text-red-500 hover:text-red-600',
                className
            )}
            aria-label={liked ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        >
            {/* Heart Icon */}
            <motion.div
                animate={isAnimating ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, -10, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <Heart
                    className={cn(
                        'h-5 w-5 transition-all',
                        liked && 'fill-current'
                    )}
                />
            </motion.div>

            {/* Particles Animation (Agent 3: Delight) */}
            {isAnimating && liked && (
                <>
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full"
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [0, 1, 0],
                                x: Math.cos((i * Math.PI * 2) / 6) * 20,
                                y: Math.sin((i * Math.PI * 2) / 6) * 20,
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    ))}
                </>
            )}

            {/* Label */}
            {showLabel && (
                <span className="mr-2">
                    {liked ? 'علاقه‌مند' : 'افزودن به علاقه‌مندی‌ها'}
                </span>
            )}
        </Button>
    )
}
