'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PremiumPaywall } from '@/components/ui/premium-paywall'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { BookOpen, Calendar, Globe, Heart, Lock, Share2, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BookCard } from './book-card'
import { ReviewForm } from './review-form'
import { ReviewList } from './review-list'

interface BookDetailClientProps {
  book: {
    _id: string
    slug: string
    title: string | { en: string; fa: string }
    title_fa?: string
    subtitle?: string
    cover_image?: string
    rating?: number
    review_count: number
    page_count: number
    publication_year: number
    genres: string[]
    languages: string[]
    isPremium: boolean
    free_preview_pages: number
    summary: string
    isbn?: string
    publisher?: string
  }
  author?: {
    id: string
    name: string
    bio?: string
    photo_url?: string
  }
  reviews: Array<{
    id: string
    rating: number
    comment: string
    created_at: string
    helpful_count: number
    profiles?: {
      full_name?: string
      avatar_url?: string
    }
  }>
  relatedBooks: Array<{
    id?: string
    _id?: string
    slug: string
    title: string | { en: string; fa: string }
    author?: string | { name: string; slug: string }
    author_id?: string
    cover_url?: string
    cover_image?: string
    rating?: number
    genres?: string[]
    isPremium?: boolean
    is_premium?: boolean
    read_count?: number
  }>
  isPremiumUser?: boolean
}

export function BookDetailClient({ book, author, reviews, relatedBooks, isPremiumUser = false }: BookDetailClientProps) {
  const [isInLibrary, setIsInLibrary] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true })

  // Agent 3 (Psychology): Check if book is premium and user needs upgrade
  const canRead = !book.isPremium || isPremiumUser

  return (
    <>
      {/* Premium Paywall Modal (Agent 3: FOMO Psychology) */}
      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        trigger="book_locked"
        bookTitle={typeof book.title === 'string' ? book.title : book.title.en}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-transparent">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-[300px,1fr] gap-8 lg:gap-12">
              {/* Book Cover */}
              <div className="flex justify-center md:justify-start">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gold-500/20 blur-2xl group-hover:bg-gold-500/30 transition-all duration-500" />
                  <div className="relative rounded-lg overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={book.cover_image || '/placeholder-book.jpg'}
                      alt={`جلد کتاب ${typeof book.title === 'string' ? book.title : book.title.fa || book.title.en}`}
                      width={300}
                      height={450}
                      priority
                      className="w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
                    {typeof book.title === 'string' ? book.title : book.title.en}
                  </h1>
                  {book.title_fa && (
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-muted-foreground">
                      {book.title_fa}
                    </h2>
                  )}
                  {book.subtitle && <p className="text-xl text-muted-foreground">{book.subtitle}</p>}
                </div>

                {/* Author */}
                {author && (
                  <Link href={`/authors/${author.id}`} className="flex items-center gap-3 group w-fit">
                    <Avatar className="h-12 w-12 border-2 border-gold-500/20">
                      <AvatarImage src={author.photo_url || undefined} alt={author.name} />
                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-muted-foreground">نویسنده</p>
                      <p className="font-semibold group-hover:text-gold-600 transition-colors">{author.name}</p>
                    </div>
                  </Link>
                )}

                {/* Rating & Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(book.rating || 0) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{book.rating || 0}</span>
                    <span className="text-muted-foreground">({book.review_count.toLocaleString('fa-IR')} نظر)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{book.page_count.toLocaleString('fa-IR')} صفحه</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{book.publication_year}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {book.genres.map((genre: string) => (
                    <Badge key={genre} variant="secondary" className="bg-gold-500/15 text-gold-800 dark:text-gold-700 hover:bg-gold-500/25 border-2 border-gold-500/30 font-semibold">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">موجود به زبان: {book.languages.join('، ')}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {canRead ? (
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
                      asChild
                    >
                      <Link href={`/books/read/${book.slug}`}>
                        <BookOpen className="ml-2 h-5 w-5" />
                        {book.isPremium ? 'شروع مطالعه' : 'مطالعه رایگان'}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
                      onClick={() => setShowPaywall(true)}
                    >
                      <Lock className="ml-2 h-5 w-5" />
                      ارتقا برای مطالعه
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsInLibrary(!isInLibrary)}
                    className={isInLibrary ? 'border-gold-500 text-gold-600' : ''}
                  >
                    {isInLibrary ? 'در کتابخانه' : 'افزودن به کتابخانه'}
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setIsInWishlist(!isInWishlist)}>
                    <Heart className={`ml-2 h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    علاقه‌مندی‌ها
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="ml-2 h-5 w-5" />
                    اشتراک‌گذاری
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="overview" className="space-y-8" dir="rtl">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">خلاصه</TabsTrigger>
              <TabsTrigger value="reviews">نظرات ({reviews.length.toLocaleString('fa-IR')})</TabsTrigger>
              <TabsTrigger value="details">جزئیات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Summary */}
              <Card className="border-2 shadow-md dark:border-border dark:shadow-none">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-foreground">درباره این کتاب</h2>
                  <p className="text-gray-700 dark:text-muted-foreground leading-relaxed">{book.summary}</p>
                </CardContent>
              </Card>

              {/* Author Bio */}
              {author && (
                <Card className="border-2 shadow-md dark:border-border dark:shadow-none">
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-foreground">درباره نویسنده</h2>
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={author.photo_url || undefined} alt={author.name} />
                        <AvatarFallback>{author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-foreground">{author.name}</h3>
                        <p className="text-gray-700 dark:text-muted-foreground text-sm leading-relaxed">{author.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Books - Swipeable Carousel */}
              {relatedBooks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">شاید دوست داشته باشید</h2>
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6 touch-pan-y">
                      {relatedBooks.map((relatedBook) => (
                        <motion.div
                          key={relatedBook.id || relatedBook._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex-[0_0_280px] md:flex-[0_0_300px] min-w-0"
                        >
                          <BookCard book={relatedBook as { id?: string; _id?: string; slug: string; title: string | { en: string; fa: string }; author?: string | { name: string; slug: string }; author_id?: string; cover_url?: string; cover_image?: string; rating?: number; genres?: string[]; isPremium?: boolean; is_premium?: boolean; read_count?: number }} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center mt-4 text-sm text-muted-foreground md:hidden">
                    ← برای مشاهده بیشتر بکشید →
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6" dir="rtl">
              {/* Review Form - Agent 3 (Psychology): Encourage engagement */}
              <ReviewForm
                bookId={book._id}
                bookTitle={typeof book.title === 'string' ? book.title : book.title.en}
                onReviewSubmitted={() => window.location.reload()}
              />

              {/* Review List */}
              <ReviewList
                reviews={reviews}
              />
            </TabsContent>

            <TabsContent value="details">
              <Card className="border-2 shadow-md dark:border-border dark:shadow-none">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-foreground">جزئیات کتاب</h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">شابک (ISBN)</dt>
                      <dd className="mt-1">{book.isbn || 'نامشخص'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">ناشر</dt>
                      <dd className="mt-1">{book.publisher || 'نامشخص'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">سال انتشار</dt>
                      <dd className="mt-1">{book.publication_year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">تعداد صفحات</dt>
                      <dd className="mt-1">{book.page_count.toLocaleString('fa-IR')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">زبان‌ها</dt>
                      <dd className="mt-1">{book.languages.join('، ')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">پیش‌نمایش رایگان</dt>
                      <dd className="mt-1">{book.free_preview_pages.toLocaleString('fa-IR')} صفحه</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">ژانرها</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {book.genres.map((genre: string) => (
                          <Badge key={genre} variant="secondary">
                            {genre}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
