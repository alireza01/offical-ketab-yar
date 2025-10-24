'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BookOpen, Eye, Heart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface BookCardProps {
  book: {
    id: string
    slug: string
    title: string
    author: string
    cover_image?: string
    coverImage?: string
    rating?: number
    genre?: string[]
    read_count?: number
  }
  showRating?: boolean
  showReadCount?: boolean
  progress?: number
}

export function BookCard({ book, showRating, showReadCount, progress }: BookCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const coverImage = book.cover_image || book.coverImage || '/placeholder-book.jpg'
  const bookRating = book.rating || 0
  const bookGenre = book.genre || []

  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, z: 50 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="perspective-1000"
    >
      <Link href={`/books/${book.slug}`}>
        <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 border border-gold-500/20 hover:border-gold-500/40 cursor-pointer h-full bg-card/50 backdrop-blur-sm">
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-[100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
          </div>

          {/* Like button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault()
              setIsLiked(!isLiked)
            }}
            className="absolute top-3 left-3 z-20 w-9 h-9 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-300 ${isLiked
                  ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  : 'text-gray-600 dark:text-gray-400'
                  }`}
              />
            </motion.div>
          </motion.button>

          <CardContent className="p-0">
            <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-gold-100 via-gold-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-900">
              <Image
                src={coverImage}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Progress bar for continue reading */}
              {progress !== undefined && progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50 backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Rating badge */}
              {bookRating > 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10"
                >
                  <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                  <span className="text-sm font-bold text-white">{bookRating.toFixed(1)}</span>
                </motion.div>
              )}

              {/* Quick stats - shown on hover */}
              <div className="absolute top-14 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                {showReadCount && book.read_count && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs text-white">
                    <Eye className="h-3 w-3" />
                    <span>{book.read_count}</span>
                  </div>
                )}
                {progress !== undefined && progress > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs text-white">
                    <BookOpen className="h-3 w-3" />
                    <span>{Math.round(progress)}%</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <Button
                  className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white shadow-xl shadow-gold-500/30 border-0 h-10 font-semibold"
                  size="sm"
                  onClick={(e) => e.preventDefault()}
                >
                  <BookOpen className="ml-2 h-4 w-4" />
                  مشاهده جزئیات
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-start p-4 gap-2.5 bg-gradient-to-b from-card to-card/80">
            <h3 className="font-bold text-base line-clamp-2 group-hover:text-gold-600 transition-colors leading-snug">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1 font-medium">{book.author}</p>
            {bookGenre.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {bookGenre.slice(0, 2).map((g) => (
                  <Badge
                    key={g}
                    variant="secondary"
                    className="text-xs px-2.5 py-0.5 bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/20 hover:bg-gold-500/20 transition-colors font-medium"
                  >
                    {g}
                  </Badge>
                ))}
                {bookGenre.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-muted text-muted-foreground border border-border"
                  >
                    +{bookGenre.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
