'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { MockAuthor, MockBook, MockReview } from '@/lib/dev/mock-data'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Calendar, Globe, Heart, MessageSquare, Send, Share2, Star, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BookCard } from './book-card'

interface BookDetailClientProps {
  book: MockBook
  author?: MockAuthor
  reviews: MockReview[]
  relatedBooks: MockBook[]
}

export function BookDetailClient({ book, author, reviews, relatedBooks }: BookDetailClientProps) {
  const [isInLibrary, setIsInLibrary] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [emblaRef] = useEmblaCarousel({ align: 'start', dragFree: true })

  const handleLikeReview = (reviewId: string) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const handleReply = (reviewId: string) => {
    setReplyingTo(replyingTo === reviewId ? null : reviewId)
    setReplyText('')
  }

  const submitReply = () => {
    // TODO: Implement reply submission
    console.log('Reply submitted:', replyText)
    setReplyingTo(null)
    setReplyText('')
  }

  return (
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
                    alt={book.title}
                    width={300}
                    height={450}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
                  {book.title}
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
                  <Badge key={genre} variant="secondary" className="bg-gold-500/10 text-gold-700 hover:bg-gold-500/20">
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
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600"
                  asChild
                >
                  <Link href={`/books/read/${book.slug}`}>
                    <BookOpen className="ml-2 h-5 w-5" />
                    مطالعه رایگان
                  </Link>
                </Button>
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
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">درباره این کتاب</h2>
                <p className="text-muted-foreground leading-relaxed">{book.summary}</p>
              </CardContent>
            </Card>

            {/* Author Bio */}
            {author && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">درباره نویسنده</h2>
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={author.photo_url || undefined} alt={author.name} />
                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{author.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{author.bio}</p>
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
                        key={relatedBook.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-[0_0_280px] md:flex-[0_0_300px] min-w-0"
                      >
                        <BookCard book={relatedBook} />
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
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex gap-4 flex-row-reverse">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage
                          src={review.profiles?.avatar_url || undefined}
                          alt={review.profiles?.full_name || 'User'}
                        />
                        <AvatarFallback>{review.profiles?.full_name?.[0] || 'ک'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2 flex-row-reverse">
                          <div className="text-right">
                            <p className="font-semibold">{review.profiles?.full_name || 'کاربر ناشناس'}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3 text-right leading-relaxed">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm flex-row-reverse">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReply(review.id)}
                            className={`flex items-center gap-1 transition-colors ${replyingTo === review.id ? 'text-gold-600' : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                            <MessageSquare className="h-4 w-4" />
                            پاسخ
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLikeReview(review.id)}
                            className={`flex items-center gap-1 transition-colors ${likedReviews.has(review.id) ? 'text-gold-600' : 'text-muted-foreground hover:text-foreground'
                              }`}
                          >
                            <motion.div
                              animate={likedReviews.has(review.id) ? { scale: [1, 1.3, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <ThumbsUp className={`h-4 w-4 ${likedReviews.has(review.id) ? 'fill-gold-600' : ''}`} />
                            </motion.div>
                            مفید ({(review.helpful_count + (likedReviews.has(review.id) ? 1 : 0)).toLocaleString('fa-IR')})
                          </motion.button>
                        </div>

                        {/* Reply Input */}
                        <AnimatePresence>
                          {replyingTo === review.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pr-4 border-r-2 border-gold-500/30"
                            >
                              <div className="flex gap-2 flex-row-reverse">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="پاسخ خود را بنویسید..."
                                  className="min-h-[80px] text-right"
                                  dir="rtl"
                                />
                              </div>
                              <div className="flex gap-2 mt-2 flex-row-reverse">
                                <Button size="sm" onClick={submitReply} className="bg-gold-600 hover:bg-gold-700">
                                  <Send className="h-4 w-4 ml-2" />
                                  ارسال پاسخ
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                                  انصراف
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  هنوز نظری ثبت نشده. اولین نفری باشید که نظر می‌دهید!
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">جزئیات کتاب</h2>
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
  )
}
