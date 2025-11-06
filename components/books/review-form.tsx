'use client'

/**
 * Book Review Form Component
 * Agent 3 (Psychology) - Encourages user engagement and social proof
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ReviewFormProps {
    bookId: string
    bookTitle: string
    onReviewSubmitted?: () => void
}

export function ReviewForm({ bookId, bookTitle, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('لطفاً امتیاز خود را انتخاب کنید')
            return
        }

        if (comment.trim().length < 10) {
            toast.error('نظر شما باید حداقل 10 کاراکتر باشد')
            return
        }

        setIsSubmitting(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('برای ثبت نظر باید وارد شوید')
                return
            }

            const { error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    book_id: bookId,
                    rating,
                    comment: comment.trim(),
                })

            if (error) throw error

            toast.success('✓ نظر شما با موفقیت ثبت شد')
            setRating(0)
            setComment('')
            onReviewSubmitted?.()
        } catch (error: unknown) {
            console.error('Error submitting review:', error)
            const err = error as { code?: string }
            if (err.code === '23505') {
                toast.error('شما قبلاً برای این کتاب نظر ثبت کرده‌اید')
            } else {
                toast.error('خطا در ثبت نظر. لطفاً دوباره تلاش کنید')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>نظر خود را درباره {bookTitle} بنویسید</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label>امتیاز شما</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${star <= (hoveredRating || rating)
                                            ? 'fill-gold-500 text-gold-500'
                                            : 'text-muted-foreground'
                                            }`}
                                    />
                                </motion.button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {rating === 5 && '⭐ عالی!'}
                                {rating === 4 && '👍 خوب'}
                                {rating === 3 && '😊 متوسط'}
                                {rating === 2 && '😐 ضعیف'}
                                {rating === 1 && '👎 خیلی ضعیف'}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">نظر شما</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="نظر خود را درباره این کتاب بنویسید... (حداقل 10 کاراکتر)"
                            rows={5}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {comment.length} / حداقل 10 کاراکتر
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                        className="w-full"
                        size="lg"
                    >
                        {isSubmitting ? 'در حال ثبت...' : 'ثبت نظر'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
