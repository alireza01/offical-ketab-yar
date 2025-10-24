'use client'

import { BookCard } from '@/components/books/book-card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
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

interface BookGenre {
  genres: {
    name: string
  } | null
}

interface BookWithGenres {
  id: string
  slug: string
  title: string
  author: string
  cover_url: string | null
  rating: number | null
  book_genres: BookGenre[] | null
}

export function FeaturedBooks() {
  const { data: featuredBooks = [] } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('books')
        .select('*, book_genres(genres(name))')
        .eq('status', 'published')
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(6)

      if (error) throw error

      return (data as unknown as BookWithGenres[] || []).map((book) => ({
        id: book.id,
        slug: book.slug,
        title: book.title,
        author: book.author,
        coverImage: book.cover_url || '/images/placeholder-book.jpg',
        rating: book.rating || 0,
        genre: book.book_genres?.map((bg) => bg.genres?.name).filter((name): name is string => Boolean(name)) || []
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
