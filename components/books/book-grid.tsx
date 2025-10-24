'use client'

import { mockBooks } from '@/lib/dev/mock-data'
import { motion } from 'framer-motion'
import { BookCard } from './book-card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function BookGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
    >
      {mockBooks.map((book) => (
        <motion.div key={book.id} variants={item}>
          <BookCard book={book} />
        </motion.div>
      ))}
    </motion.div>
  )
}
