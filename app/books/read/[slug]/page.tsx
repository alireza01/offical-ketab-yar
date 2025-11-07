'use client'

import { ProfessionalReader } from '@/components/reader/professional-reader'
import { Skeleton } from '@/components/ui/skeleton'
import { sanityClientWithMock as sanityClient } from '@/lib/sanity/client-with-mock'
import { bookWithFirstChapterQuery } from '@/lib/sanity/queries'
import { notFound } from 'next/navigation'
import { use, useEffect, useRef, useState } from 'react'

interface ReaderPageProps {
  params: Promise<{
    slug: string
  }>
}

interface SanityBlock {
  children?: Array<{ text?: string }>
}

interface BilingualParagraph {
  _type: string
  english: SanityBlock[]
  farsi: SanityBlock[]
}

interface SanityChapter {
  content?: BilingualParagraph[]
}

interface BilingualContent {
  english: string
  farsi: string
}

interface BookData {
  content: BilingualContent[]
  title: string
  slug: string
  author: string
}

// Helper to extract text from a specific language
function extractTextFromBlocks(blocks: SanityBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (!block.children) return ''
      return block.children
        .map((child) => child.text || '')
        .join('')
    })
    .join('') // Join blocks without newlines (they're already separate blocks)
}

// Helper to convert bilingual paragraph to BilingualContent
function extractBilingualContent(paragraph: BilingualParagraph): BilingualContent {
  return {
    english: extractTextFromBlocks(paragraph.english),
    farsi: extractTextFromBlocks(paragraph.farsi),
  }
}

// Helper to convert Sanity chapter format to ProfessionalReader format
function convertChapterToPages(chapter: SanityChapter): BilingualContent[] {
  if (!chapter || !chapter.content) return []

  // Get all bilingual paragraphs
  const paragraphs = chapter.content
    .filter((item) => item._type === 'bilingualParagraph')
    .map((paragraph) => extractBilingualContent(paragraph))
    .filter((content) => content.english.trim().length > 0 || content.farsi.trim().length > 0)

  // Group paragraphs into pages (3-4 paragraphs per page for better reading experience)
  const paragraphsPerPage = 3
  const pages: BilingualContent[] = []

  for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
    const pageParagraphs = paragraphs.slice(i, i + paragraphsPerPage)

    pages.push({
      english: pageParagraphs.map((p) => p.english).join('\n\n'), // Double newline for paragraph breaks
      farsi: pageParagraphs.map((p) => p.farsi).join('\n\n'),
    })
  }

  return pages
}

export default function ReaderPage({ params }: ReaderPageProps) {
  const { slug } = use(params)
  const [book, setBook] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const isMountedRef = useRef(true) // Prevent state updates on unmounted component

  useEffect(() => {
    isMountedRef.current = true

    async function loadBook() {
      try {
        console.log('🔍 Loading book with slug:', slug)
        setLoading(true)
        const fetchedBook = await sanityClient.fetch(bookWithFirstChapterQuery, { slug })

        console.log('📚 Fetched book:', fetchedBook)
        console.log('📖 First chapter:', fetchedBook?.firstChapter)
        console.log('📝 Chapter content:', fetchedBook?.firstChapter?.content)

        if (!fetchedBook) {
          console.error('❌ Book not found')
          setError(true)
          return
        }

        if (!fetchedBook.firstChapter) {
          console.error('❌ Missing firstChapter')
          setError(true)
          return
        }

        if (!fetchedBook.firstChapter.content || fetchedBook.firstChapter.content.length === 0) {
          console.error('❌ Chapter has no content')
          setError(true)
          return
        }

        // Convert to ProfessionalReader format
        const pages = convertChapterToPages(fetchedBook.firstChapter)

        console.log('📄 Converted pages:', pages.length)
        if (pages.length > 0) {
          console.log('📝 First page sample:', {
            englishLength: pages[0].english.length,
            farsiLength: pages[0].farsi.length,
            englishPreview: pages[0].english.substring(0, 100),
            farsiPreview: pages[0].farsi.substring(0, 100),
          })
        }

        if (pages.length === 0) {
          console.error('❌ No pages generated from chapter content')
          setError(true)
          return
        }

        const convertedBook: BookData = {
          content: pages,
          title: typeof fetchedBook.title === 'string'
            ? fetchedBook.title
            : fetchedBook.title?.en || 'Untitled',
          slug: fetchedBook.slug,
          author: fetchedBook.author?.name || 'Unknown Author',
        }

        console.log('✅ Final book object:', {
          title: convertedBook.title,
          author: convertedBook.author,
          pageCount: convertedBook.content.length,
        })

        if (isMountedRef.current) {
          setBook(convertedBook)
        }
      } catch (err) {
        console.error('❌ Error loading book:', err)
        if (isMountedRef.current) {
          setError(true)
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    loadBook()

    // Cleanup function to prevent memory leaks
    return () => {
      isMountedRef.current = false
    }
  }, [slug])

  if (error) {
    notFound()
  }

  if (loading || !book) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="container max-w-4xl mx-auto px-4 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Debug: Check if book has content
  if (!book.content || book.content.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-4xl">
          <h1 className="text-2xl font-bold text-red-600">⚠️ No Content Found</h1>
          <p className="text-muted-foreground">Book loaded but has no readable content.</p>
          <div className="text-left space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-bold mb-2">Book Info:</h3>
              <p>Title: {book.title}</p>
              <p>Author: {book.author}</p>
              <p>Slug: {book.slug}</p>
              <p>Content Pages: {book.content?.length || 0}</p>
            </div>
            <details className="bg-muted p-4 rounded-lg">
              <summary className="font-bold cursor-pointer">Full Book Object (click to expand)</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-96">
                {JSON.stringify(book, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    )
  }

  return <ProfessionalReader book={book} />
}
