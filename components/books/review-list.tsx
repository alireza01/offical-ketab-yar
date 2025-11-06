'use client'

/**
 * Book Review List Component
 * Agent 3 (Psychology) - Social proof and engagement
 */

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Star, ThumbsUp } from 'lucide-react'
import { useState } from 'react'

interface Review {
    id: string
    rating: number
    comment: string
    created_at: string
    helpful_count: number
    profiles?: {
        full_name?: string
        avatar_url?: string
    }
}

interface ReviewListProps {
    reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
    const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent')

    if (reviews.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        هنوز نظری برای این کتاب ثبت نشده است
                    </p>
                    <p className="text-sm text-muted-foreground">
                        اولین نفری باشید که نظر می‌دهد!
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Calculate average rating
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

    // Sort reviews
    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'helpful') {
            return b.helpful_count - a.helpful_count
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return (
        <div className="space-y-6">
            {/* Summary */}
            <Card className="bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-950 dark:to-amber-950 border-gold-200 dark:border-gold-800">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-gold-600">{avgRating}</div>
                            <div className="flex gap-1 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.round(parseFloat(avgRating))
                                            ? 'fill-gold-500 text-gold-500'
                                            : 'text-muted-foreground'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {reviews.length} نظر
                            </p>
                        </div>

                        <Separator orientation="vertical" className="h-20" />

                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter((r) => r.rating === star).length
                                const percentage = (count / reviews.length) * 100

                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-sm w-12">{star} ستاره</span>
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 0.5, delay: (5 - star) * 0.1 }}
                                                className="h-full bg-gold-500"
                                            />
                                        </div>
                                        <span className="text-sm text-muted-foreground w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sort Options */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">نظرات کاربران</h3>
                <div className="flex gap-2">
                    <Button
                        variant={sortBy === 'recent' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('recent')}
                    >
                        جدیدترین
                    </Button>
                    <Button
                        variant={sortBy === 'helpful' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('helpful')}
                    >
                        مفیدترین
                    </Button>
                </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
                {sortedReviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-gold-100 text-gold-700">
                                            {review.profiles?.full_name?.[0] || 'ک'}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold">
                                                    {review.profiles?.full_name || 'کاربر کتاب‌یار'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < review.rating
                                                                    ? 'fill-gold-500 text-gold-500'
                                                                    : 'text-muted-foreground'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(review.created_at).toLocaleDateString('fa-IR')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <p className="text-muted-foreground leading-relaxed">
                                            {review.comment}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>مفید بود ({review.helpful_count})</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
