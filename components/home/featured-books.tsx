'use client'

import { BookCard } from '@/components/books/book-card'
import { Button } from '@/components/ui/button'
import { getBooks } from '@/lib/data'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 }
}

export function FeaturedBooks() {
  const { data: featuredBooks = [] } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const books = await getBooks()

      // Filter featured books
      return books
        .filter(book => book.featured)
        .slice(0, 6)
        .map((book) => ({
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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">کتاب‌های ویژه</h2>
            <p className="text-muted-foreground text-lg">سفر مطالعه خود را با این کتاب‌های کلاسیک آغاز کنید</p>
          </div>
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2 hover:bg-gold-50 dark:hover:bg-gold-950/20"
            asChild
          >
            <Link href="/library">
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
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
          {featuredBooks.map((book) => (
            <motion.div key={book.id} variants={item}>
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
            <Link href="/library">
              مشاهده همه کتاب‌ها
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
