/**
 * Blog Card Component
 * Agent 1 (SEO) - Optimized for click-through
 * Agent 3 (Psychology) - Engaging visual design
 */

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { BlogPost } from '@/lib/sanity/types'
import { useLanguageStore } from '@/stores/useLanguageStore'
import { Calendar, Clock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogCardProps {
    post: BlogPost & { estimatedReadingTime?: number }
    featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
    const { mode } = useLanguageStore()
    // Determine primary language from mode
    const language = mode.startsWith('FA') ? 'fa' : 'en'
    const title = post.title[language]
    const summary = (post as { summary?: { en: string; fa: string } }).summary?.[language] || ''

    const formattedDate = new Date(post.publishedAt || new Date()).toLocaleDateString(
        language === 'fa' ? 'fa-IR' : 'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    )

    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <Card
                className={`h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${featured ? 'border-2 border-gold' : ''
                    }`}
            >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                        src={post.mainImage || '/placeholder.svg'}
                        alt={post.mainImageAlt || title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {featured && (
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-gold text-white">ویژه</Badge>
                        </div>
                    )}
                </div>

                <CardHeader>
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories.slice(0, 2).map((category) => (
                                <Badge key={category} variant="outline" className="text-xs">
                                    {getCategoryLabel(category, language)}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-gold transition-colors">
                        {title}
                    </h3>
                </CardHeader>

                <CardContent>
                    {/* Summary */}
                    <p className="text-muted-foreground line-clamp-3 text-sm">{summary}</p>
                </CardContent>

                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        {/* Author */}
                        {post.author && (
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{post.author.name}</span>
                            </div>
                        )}

                        {/* Reading Time */}
                        {post.estimatedReadingTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                    {post.estimatedReadingTime}{' '}
                                    {language === 'fa' ? 'دقیقه' : 'min'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

function getCategoryLabel(category: string, language: 'en' | 'fa'): string {
    const labels: Record<string, { en: string; fa: string }> = {
        'reading-tips': { en: 'Reading Tips', fa: 'نکات مطالعه' },
        'language-learning': { en: 'Language Learning', fa: 'یادگیری زبان' },
        'book-reviews': { en: 'Book Reviews', fa: 'نقد کتاب' },
        'author-interviews': { en: 'Author Interviews', fa: 'مصاحبه با نویسنده' },
        'platform-updates': { en: 'Platform Updates', fa: 'به‌روزرسانی‌ها' },
    }

    return labels[category]?.[language] || category
}
