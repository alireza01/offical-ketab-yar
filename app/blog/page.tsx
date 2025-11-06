/**
 * Blog List Page
 * Agent 1 (SEO) - SSG for maximum SEO benefit
 * Agent 3 (Psychology) - Content marketing to keep users engaged
 */

import { BlogCard } from '@/components/blog/blog-card'
import { Button } from '@/components/ui/button'
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/lib/sanity/queries/blog'
import { BookOpen, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

// Force dynamic rendering (contains client components)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'وبلاگ کتاب‌یار | نکات مطالعه، یادگیری زبان و نقد کتاب',
    description:
        'مقالات تخصصی درباره یادگیری زبان انگلیسی، نکات مطالعه مؤثر، نقد و بررسی کتاب‌های برتر و راهنمای انتخاب کتاب مناسب',
    keywords: [
        'وبلاگ کتاب',
        'یادگیری زبان انگلیسی',
        'نکات مطالعه',
        'نقد کتاب',
        'book blog',
        'reading tips',
        'language learning',
    ],
    alternates: {
        canonical: 'https://ketabyar.ir/blog',
    },
    openGraph: {
        title: 'وبلاگ کتاب‌یار - نکات مطالعه و یادگیری زبان',
        description: 'مقالات تخصصی درباره یادگیری زبان و مطالعه مؤثر',
        url: 'https://ketabyar.ir/blog',
        type: 'website',
        images: ['/og-blog.png'],
    },
}

export default async function BlogPage() {
    const [featuredPosts, allPosts] = await Promise.all([
        getFeaturedBlogPosts(3),
        getAllBlogPosts(),
    ])

    const regularPosts = allPosts.filter((post) => !post.featured)

    // JSON-LD Schema for Blog (Agent 1)
    const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'وبلاگ کتاب‌یار',
        description: 'مقالات تخصصی درباره یادگیری زبان و مطالعه',
        url: 'https://ketabyar.ir/blog',
        publisher: {
            '@type': 'Organization',
            name: 'کتاب‌یار',
            logo: 'https://ketabyar.ir/logo.png',
        },
    }

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-gold/10 to-background py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <BookOpen className="w-4 h-4" />
                                <span>وبلاگ کتاب‌یار</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                نکات مطالعه و یادگیری زبان
                            </h1>

                            <p className="text-lg text-muted-foreground mb-8">
                                مقالات تخصصی برای بهبود مهارت‌های مطالعه، یادگیری زبان انگلیسی و
                                انتخاب کتاب مناسب
                            </p>

                            <Button size="lg" asChild>
                                <Link href="#featured">
                                    مشاهده مقالات ویژه
                                    <Sparkles className="w-5 h-5 mr-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                    <section id="featured" className="py-16 bg-muted/30">
                        <div className="container mx-auto px-4">
                            <div className="flex items-center gap-3 mb-8">
                                <Sparkles className="w-6 h-6 text-gold" />
                                <h2 className="text-3xl font-bold">مقالات ویژه</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredPosts.map((post) => (
                                    <BlogCard key={post._id} post={post} featured />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* All Posts */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-8">همه مقالات</h2>

                        {regularPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularPosts.map((post) => (
                                    <BlogCard key={post._id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">
                                    به زودی مقالات جدید منتشر خواهد شد
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-b from-background to-gold/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                آماده شروع مطالعه هستید؟
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                بیش از 1000 کتاب انگلیسی با ترجمه فارسی در انتظار شماست
                            </p>
                            <Button size="lg" asChild>
                                <Link href="/library">
                                    مشاهده کتابخانه
                                    <BookOpen className="w-5 h-5 mr-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
