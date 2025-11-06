'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Author } from '@/lib/sanity/types'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import { BookOpen, Globe, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface AuthorDetailClientProps {
    author: Author
}

export function AuthorDetailClient({ author }: AuthorDetailClientProps) {
    const portableTextComponents = {
        block: {
            normal: ({ children }: { children?: React.ReactNode }) => <p className="mb-4 leading-relaxed">{children}</p>,
            h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>,
        },
        marks: {
            strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-transparent">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Author Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex-shrink-0"
                        >
                            <Avatar className="h-48 w-48 border-4 border-gold-500/20">
                                <AvatarImage src={author.photo || author.image || ''} alt={author.name} />
                                <AvatarFallback className="text-4xl">{author.name[0]}</AvatarFallback>
                            </Avatar>
                        </motion.div>

                        {/* Author Info */}
                        <div className="flex-1 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <h1 className="text-4xl lg:text-5xl font-bold mb-2">{author.name}</h1>
                                <div className="flex flex-wrap gap-3 text-muted-foreground">
                                    {author.nationality && (
                                        <span className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            {author.nationality}
                                        </span>
                                    )}
                                    {(author.birthYear || author.born) && <span>{author.birthYear || author.born}</span>}
                                    {author.books && author.books.length > 0 && (
                                        <span className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            {author.books.length} {author.books.length === 1 ? 'Book' : 'Books'}
                                        </span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Social Links */}
                            {(author.website || author.socialMedia) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {author.website && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={author.website} target="_blank" rel="noopener noreferrer">
                                                <Globe className="h-4 w-4 mr-2" />
                                                Website
                                            </a>
                                        </Button>
                                    )}
                                    {author.socialMedia?.twitter && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={author.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                                                <Twitter className="h-4 w-4 mr-2" />
                                                Twitter
                                            </a>
                                        </Button>
                                    )}
                                    {author.socialMedia?.instagram && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={author.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                                <Instagram className="h-4 w-4 mr-2" />
                                                Instagram
                                            </a>
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Biography */}
                {author.bio && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="border-2 shadow-md dark:border-border dark:shadow-none">
                            <CardContent className="pt-6">
                                <h2 className="text-2xl font-bold mb-6">Biography | بیوگرافی</h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
                                    {/* English Bio */}
                                    {author.bio && typeof author.bio === 'object' && 'en' in author.bio && (
                                        <div dir="ltr">
                                            <h3 className="text-xl font-semibold mb-3">English</h3>
                                            <PortableText value={author.bio.en} components={portableTextComponents} />
                                        </div>
                                    )}
                                    {/* Persian Bio */}
                                    {author.bio && typeof author.bio === 'object' && 'fa' in author.bio && (
                                        <div dir="rtl" className="font-vazirmatn">
                                            <h3 className="text-xl font-semibold mb-3">فارسی</h3>
                                            <PortableText value={author.bio.fa} components={portableTextComponents} />
                                        </div>
                                    )}
                                    {/* Fallback for string bio */}
                                    {author.bio && typeof author.bio === 'string' && (
                                        <p className="leading-relaxed">{author.bio}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Books by this Author */}
                {author.books && author.books.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-3xl font-bold mb-6">کتاب‌های دیگر این نویسنده</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {author.books.map((book, index) => {
                                const bookTitle = typeof book.title === 'string' ? book.title : book.title.en
                                return (
                                    <motion.div
                                        key={book._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                    >
                                        <Link href={`/books/${book.slug}`} className="group block">
                                            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                                                <Image
                                                    src={book.coverImage}
                                                    alt={bookTitle}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {book.isPremium && (
                                                    <Badge className="absolute top-2 right-2 bg-gold-600">Premium</Badge>
                                                )}
                                            </div>
                                            <div className="mt-3 space-y-1">
                                                <h3 className="font-semibold line-clamp-2 group-hover:text-gold-600 transition-colors">
                                                    {bookTitle}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">{book.publishYear}</p>
                                                {book.genres && book.genres.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {book.genres.slice(0, 2).map((genre) => (
                                                            <Badge key={genre} variant="secondary" className="text-xs">
                                                                {genre}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
