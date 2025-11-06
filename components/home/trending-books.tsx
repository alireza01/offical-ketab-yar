'use client'

import { BookCard } from '@/components/books/book-card'
import { Button } from '@/components/ui/button'
import { getMostReadBooks } from '@/lib/data'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Flame, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 }
}

export function TrendingBooks() {
  const { data: trendingBooks = [] } = useQuery({
    queryKey: ['trending-books'],
    queryFn: async () => {
      const books = await getMostReadBooks(6)

      return books.map((book) => ({
        id: book._id,
        slug: book.slug,
        title: typeof book.title === 'string' ? book.title : book.title.en,
        author: typeof book.author === 'string' ? book.author : book.author.name,
        coverImage: book.coverImage || '/images/placeholder-book.jpg',
        rating: 0, // TODO: Implement ratings
        genre: book.genres || []
      }))
    },
  })

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-gold-50/30 to-background dark:via-gold-950/10" />
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.03]" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-foreground">کتاب‌های</span>
                {' '}
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  پرطرفدار
                </span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg">
              محبوب‌ترین کتاب‌های این هفته که همه درباره‌شان صحبت می‌کنند
            </p>
          </div>

          <Button
            variant="outline"
            className="group hidden md:flex items-center gap-2 hover:bg-gold-50 dark:hover:bg-gold-950/20 hover:border-gold-500/50 transition-all duration-300"
            asChild
          >
            <Link href="/library?sort=trending">
              <TrendingUp className="h-4 w-4" />
              مشاهده همه پرطرفدارها
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {trendingBooks.map((book, index) => (
            <motion.div key={book.id} variants={item} className="relative">
              {/* Trending badge */}
              {index < 3 && (
                <div className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {index + 1}
                </div>
              )}
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/library?sort=trending">
              <TrendingUp className="ml-2 h-4 w-4" />
              مشاهده همه پرطرفدارها
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
