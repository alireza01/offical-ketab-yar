/**
 * Blog Post Detail Page
 * Agent 1 (SEO) - SSG with generateStaticParams for maximum SEO
 * Agent 3 (Psychology) - Internal linking to books for engagement
 */

import { BlogCard } from '@/components/blog/blog-card'
import { BookCard } from '@/components/books/book-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    getAllBlogPostSlugs,
    getBlogPostBySlug,
    getRelatedBlogPosts,
} from '@/lib/sanity/queries/blog'
import { PortableText } from '@portabletext/react'
import { Calendar, Clock, Share2, User } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Force static generation (Agent 1 & 2)
export const dynamic = 'force-static'
export const revalidate = 3600

// Generate static params for all blog posts
export async function generateStaticParams() {
    const slugs = await getAllBlogPostSlugs()
    return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
        return {
            title: 'مقاله یافت نشد',
        }
    }

    return {
        title: `${post.title.fa} | وبلاگ کتاب‌یار`,
        description: post.excerpt?.fa || post.title.fa,
        keywords: post.categories || [],
        alternates: {
            canonical: `https://ketabyar.ir/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title.fa,
            description: post.excerpt?.fa || post.title.fa,
            url: `https://ketabyar.ir/blog/${post.slug}`,
            type: 'article',
            images: post.mainImage ? [post.mainImage] : [],
            publishedTime: post.publishedAt || new Date().toISOString(),
            authors: post.author ? [post.author.name] : ['کتاب‌یار'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title.fa,
            description: post.excerpt?.fa || post.title.fa,
            images: post.mainImage ? [post.mainImage] : [],
        },
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = await getRelatedBlogPosts(post.slug, post.categories || [], 3)

    const formattedDate = new Date(post.publishedAt || new Date()).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    // JSON-LD Article Schema (Agent 1)
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title.fa,
        alternativeHeadline: post.title.en,
        image: post.mainImage || '',
        author: {
            '@type': 'Person',
            name: post.author?.name || 'کتاب‌یار',
        },
        publisher: {
            '@type': 'Organization',
            name: 'کتاب‌یار',
            logo: {
                '@type': 'ImageObject',
                url: 'https://ketabyar.ir/logo.png',
            },
        },
        datePublished: post.publishedAt || new Date().toISOString(),
        description: post.excerpt?.fa || post.title.fa,
    }

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <article className="min-h-screen">
                {/* Hero Image */}
                {post.mainImage && (
                    <div className="relative w-full h-[400px] md:h-[500px] bg-muted">
                        <Image
                            src={post.mainImage}
                            alt={post.mainImageAlt || post.title.fa}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                )}

                {/* Content */}
                <div className="container mx-auto px-4 -mt-32 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Article Header */}
                        <div className="bg-background rounded-2xl shadow-2xl p-8 md:p-12 mb-12">
                            {/* Categories */}
                            {post.categories && post.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {post.categories.map((category) => (
                                        <span
                                            key={category}
                                            className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm"
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                {post.title.fa}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                                {post.author && (
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>{post.author.name}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formattedDate}</span>
                                </div>

                                {/* Estimated reading time - can be calculated from body content */}
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>5 دقیقه مطالعه</span>
                                </div>
                            </div>

                            {/* Share Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: post.title.fa,
                                            text: post.excerpt?.fa || post.title.fa,
                                            url: window.location.href,
                                        })
                                    }
                                }}
                            >
                                <Share2 className="w-4 h-4 ml-2" />
                                اشتراک‌گذاری
                            </Button>

                            <Separator className="my-8" />

                            {/* Article Body */}
                            <div className="prose prose-lg max-w-none dark:prose-invert">
                                <PortableText value={post.body} />
                            </div>
                        </div>

                        {/* Related Books (Agent 1 - Internal Linking) */}
                        {post.relatedBooks && post.relatedBooks.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-6">
                                    کتاب‌های مرتبط با این مقاله
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {post.relatedBooks.map((book) => (
                                        <BookCard key={book._id} book={book} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold mb-6">مقالات مرتبط</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {relatedPosts.map((relatedPost) => (
                                        <BlogCard key={relatedPost._id} post={relatedPost} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CTA */}
                        <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold mb-4">
                                آماده شروع مطالعه هستید؟
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                بیش از 1000 کتاب انگلیسی با ترجمه فارسی
                            </p>
                            <Button size="lg" asChild>
                                <Link href="/library">مشاهده کتابخانه</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </article>
        </>
    )
}
