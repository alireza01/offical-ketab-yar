'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { offlineVocabulary } from '@/lib/offline/vocabulary-storage'
import { createClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Brain, CloudOff, GraduationCap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface BookWithWords {
  book_id: string
  book_title: string
  book_slug: string
  word_count: number
  mastered_count: number
  learning_count: number
  new_count: number
}

export default function VocabularyPage() {
  const [books, setBooks] = useState<BookWithWords[]>([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [stats, setStats] = useState({
    total_words: 0,
    mastered: 0,
    learning: 0,
    new: 0
  })
  const supabase = createClient()

  useEffect(() => {
    loadVocabularyBooks()
  }, [])

  const loadVocabularyBooks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Load from offline storage first (works without login)
      const offlineWords = await offlineVocabulary.getAll()

      if (!user) {
        // Not logged in - use offline data only
        setIsOffline(true)
        processOfflineWords(offlineWords)
        setLoading(false)
        return
      }

      // Get all vocabulary words with book info
      const { data: words, error } = await supabase
        .from('vocabulary')
        .select(`
          id,
          book_id,
          mastery_level,
          books (
            id,
            title,
            slug
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      // Group by book
      const bookMap = new Map<string, BookWithWords>()
      let totalMastered = 0
      let totalLearning = 0
      let totalNew = 0

      words?.forEach((word) => {
        if (!word.book_id || !word.books) return

        // Handle books as either object or array (Supabase can return either)
        const bookData = Array.isArray(word.books) ? word.books[0] : word.books
        if (!bookData) return

        const bookId = word.book_id
        const bookTitle = typeof bookData.title === 'string'
          ? bookData.title
          : bookData.title?.en || 'Unknown Book'
        const bookSlug = bookData.slug

        if (!bookMap.has(bookId)) {
          bookMap.set(bookId, {
            book_id: bookId,
            book_title: bookTitle,
            book_slug: bookSlug,
            word_count: 0,
            mastered_count: 0,
            learning_count: 0,
            new_count: 0
          })
        }

        const book = bookMap.get(bookId)!
        book.word_count++

        // Categorize by mastery level
        if (word.mastery_level >= 5) {
          book.mastered_count++
          totalMastered++
        } else if (word.mastery_level >= 2) {
          book.learning_count++
          totalLearning++
        } else {
          book.new_count++
          totalNew++
        }
      })

      setBooks(Array.from(bookMap.values()))
      setStats({
        total_words: words?.length || 0,
        mastered: totalMastered,
        learning: totalLearning,
        new: totalNew
      })
    } catch (error) {
      console.error('Error loading vocabulary:', error)

      // Fallback to offline data
      const offlineWords = await offlineVocabulary.getAll()
      processOfflineWords(offlineWords)
      setIsOffline(true)
      toast.error('خطا در بارگذاری - از حافظه محلی استفاده می‌شود')
    } finally {
      setLoading(false)
    }
  }

  const processOfflineWords = (words: any[]) => {
    const bookMap = new Map<string, BookWithWords>()
    let totalMastered = 0
    let totalLearning = 0
    let totalNew = 0

    words.forEach((word) => {
      if (!word.book_id) return

      const bookId = word.book_id
      const bookTitle = 'کتاب ذخیره شده'

      if (!bookMap.has(bookId)) {
        bookMap.set(bookId, {
          book_id: bookId,
          book_title: bookTitle,
          book_slug: bookId,
          word_count: 0,
          mastered_count: 0,
          learning_count: 0,
          new_count: 0
        })
      }

      const book = bookMap.get(bookId)!
      book.word_count++

      if (word.mastery_level >= 5) {
        book.mastered_count++
        totalMastered++
      } else if (word.mastery_level >= 2) {
        book.learning_count++
        totalLearning++
      } else {
        book.new_count++
        totalNew++
      }
    })

    setBooks(Array.from(bookMap.values()))
    setStats({
      total_words: words.length,
      mastered: totalMastered,
      learning: totalLearning,
      new: totalNew
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:p-8" dir="rtl">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
          واژگان من
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          {stats.total_words.toLocaleString('fa-IR')} کلمه ذخیره شده
        </p>
        {isOffline && (
          <div className="mt-2 inline-flex items-center gap-2 text-xs md:text-sm text-orange-600 bg-orange-500/10 px-3 py-1 rounded-full">
            <CloudOff className="h-3 w-3 md:h-4 md:w-4" />
            حالت آفلاین
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
          <CardContent className="pt-4 md:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">مجموع کلمات</p>
                <p className="text-2xl md:text-3xl font-bold text-gold-600">
                  {stats.total_words.toLocaleString('fa-IR')}
                </p>
              </div>
              <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-gold-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">تسلط کامل</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.mastered.toLocaleString('fa-IR')}
                </p>
              </div>
              <GraduationCap className="h-10 w-10 text-green-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">در حال یادگیری</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.learning.toLocaleString('fa-IR')}
                </p>
              </div>
              <Brain className="h-10 w-10 text-blue-600/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">جدید</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.new.toLocaleString('fa-IR')}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice All Button */}
      <div className="mb-8 text-center">
        <Link href="/vocabulary/practice?mode=all">
          <Button size="lg" className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600">
            <Brain className="ml-2 h-5 w-5" />
            تمرین همه کلمات ({stats.total_words.toLocaleString('fa-IR')} کلمه)
          </Button>
        </Link>
      </div>

      {/* Info Card - What is Spaced Repetition */}
      <Card className="mb-8 bg-gold/5 border-gold/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-gold-600" />
            💡 سیستم تکرار فاصله‌دار چیست؟
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• لغاتی که به درستی پاسخ می‌دهید، با فاصله زمانی بیشتر مرور می‌شوند</li>
            <li>• لغاتی که اشتباه می‌کنید، زودتر برای مرور مجدد نمایش داده می‌شوند</li>
            <li>• این روش علمی‌ترین راه برای یادگیری بلندمدت است</li>
            <li>• با مرور منظم، لغات را برای همیشه یاد خواهید گرفت</li>
          </ul>
        </CardContent>
      </Card>

      {/* Books List */}
      {books.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">هنوز کلمه‌ای ذخیره نکرده‌اید</p>
            <p className="text-sm">
              شروع به خواندن کنید و کلمات جدید را ذخیره کنید!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">کتاب‌های من</h2>
          <AnimatePresence>
            {books.map((book, index) => (
              <motion.div
                key={book.book_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all hover:border-gold/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <BookOpen className="h-6 w-6 text-gold-600" />
                          <h3 className="text-xl font-bold">{book.book_title}</h3>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>پیشرفت یادگیری</span>
                            <span>
                              {book.mastered_count} / {book.word_count} کلمه
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-500"
                              style={{
                                width: `${(book.mastered_count / book.word_count) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 flex-wrap">
                          <Badge variant="secondary" className="bg-gold/10 text-gold-700">
                            {book.word_count.toLocaleString('fa-IR')} کلمه
                          </Badge>
                          {book.mastered_count > 0 && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                              ✓ {book.mastered_count.toLocaleString('fa-IR')} تسلط
                            </Badge>
                          )}
                          {book.learning_count > 0 && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                              📚 {book.learning_count.toLocaleString('fa-IR')} یادگیری
                            </Badge>
                          )}
                          {book.new_count > 0 && (
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-700">
                              ✨ {book.new_count.toLocaleString('fa-IR')} جدید
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Link href={`/vocabulary/practice?bookId=${book.book_id}`}>
                          <Button className="bg-gold-600 hover:bg-gold-700 w-full">
                            <Brain className="ml-2 h-4 w-4" />
                            تمرین
                          </Button>
                        </Link>
                        <Link href={`/vocabulary/words?bookId=${book.book_id}`}>
                          <Button variant="outline" className="w-full">
                            <BookOpen className="ml-2 h-4 w-4" />
                            مشاهده کلمات
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
