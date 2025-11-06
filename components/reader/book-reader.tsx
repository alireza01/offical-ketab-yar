'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useChapterLoader } from '@/hooks/use-chapter-loader'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { BilingualRenderer } from './BilingualRenderer'
import { LanguageSwitch } from './LanguageSwitch'

interface BookReaderProps {
    book: {
        _id: string
        slug: string
        title: {
            en: string
            fa: string
        }
        coverImage: string
        author: {
            _id: string
            name: string
            slug: string
        }
        publishYear: number
        totalChapters: number
        firstChapter: any
    }
}

export function BookReader({ book }: BookReaderProps) {
    const {
        chapters,
        currentChapter,
        totalChapters,
        loading,
        goToChapter,
        handleScroll,
        hasNextChapter,
        hasPrevChapter,
    } = useChapterLoader({
        bookSlug: book.slug,
        initialChapter: book.firstChapter,
    })

    const [showControls, setShowControls] = useState(true)
    const [showChapterMenu, setShowChapterMenu] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const scrollTimeoutRef = useRef<NodeJS.Timeout>()

    // Track scroll position for smart loading
    useEffect(() => {
        const handleScrollEvent = () => {
            if (!contentRef.current) return

            const { scrollTop, scrollHeight, clientHeight } = contentRef.current
            const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100

            // Update scroll position for current chapter
            handleScroll(currentChapter, scrollPercentage)

            // Show controls on scroll
            setShowControls(true)

            // Hide controls after 3 seconds of no scrolling
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
            scrollTimeoutRef.current = setTimeout(() => {
                setShowControls(false)
            }, 3000)
        }

        const contentElement = contentRef.current
        if (contentElement) {
            contentElement.addEventListener('scroll', handleScrollEvent)
            return () => contentElement.removeEventListener('scroll', handleScrollEvent)
        }
    }, [currentChapter, handleScroll])

    // Get current chapter data
    const currentChapterData = chapters[currentChapter]

    return (
        <div className="fixed inset-0 bg-background flex flex-col">
            {/* Header */}
            <AnimatePresence>
                {showControls && (
                    <motion.header
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ duration: 0.3 }}
                        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
                    >
                        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/books/${book.slug}`}>
                                        <X className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <div className="hidden md:block">
                                    <h1 className="font-semibold">{book.title.en}</h1>
                                    <p className="text-sm text-muted-foreground">
                                        by{' '}
                                        <Link
                                            href={`/authors/${book.author.slug}`}
                                            className="hover:text-gold-600 transition-colors"
                                        >
                                            {book.author.name}
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <LanguageSwitch />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowChapterMenu(!showChapterMenu)}
                                >
                                    <Menu className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">
                                        Chapter {currentChapter}/{totalChapters || '...'}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <Progress
                            value={totalChapters ? (currentChapter / totalChapters) * 100 : 0}
                            className="h-1 rounded-none"
                        />
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Chapter Menu Sidebar */}
            <AnimatePresence>
                {showChapterMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowChapterMenu(false)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-background border-l z-50 overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Chapters</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setShowChapterMenu(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {Array.from({ length: totalChapters || 0 }, (_, i) => i + 1).map((chapterNum) => {
                                        const chapterData = chapters[chapterNum]
                                        const isLoaded = !!chapterData
                                        const isCurrent = chapterNum === currentChapter
                                        const isLoading = loading[chapterNum]

                                        return (
                                            <button
                                                key={chapterNum}
                                                onClick={() => {
                                                    goToChapter(chapterNum)
                                                    setShowChapterMenu(false)
                                                }}
                                                disabled={isLoading}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${isCurrent
                                                        ? 'bg-gold-500/20 border-2 border-gold-500'
                                                        : 'hover:bg-muted border-2 border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">
                                                        Chapter {chapterNum}
                                                        {isCurrent && ' (Current)'}
                                                    </span>
                                                    {isLoading && (
                                                        <span className="text-xs text-muted-foreground">Loading...</span>
                                                    )}
                                                    {isLoaded && !isCurrent && (
                                                        <span className="text-xs text-green-600">✓</span>
                                                    )}
                                                </div>
                                                {chapterData && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {chapterData.title.en}
                                                    </p>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
                <div className="container max-w-4xl mx-auto px-4 py-8">
                    {currentChapterData ? (
                        <>
                            {/* Chapter Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <h2 className="text-3xl font-bold mb-2">{currentChapterData.title.en}</h2>
                                <p className="text-xl text-muted-foreground font-vazirmatn" dir="rtl">
                                    {currentChapterData.title.fa}
                                </p>
                            </motion.div>

                            {/* Chapter Content */}
                            <div className="space-y-6">
                                {currentChapterData.content.map((item: any, index: number) => {
                                    if (item._type === 'bilingualParagraph') {
                                        return <BilingualRenderer key={index} paragraph={item} index={index} />
                                    }
                                    // Handle images if needed
                                    return null
                                })}
                            </div>

                            {/* Chapter Navigation */}
                            <div className="flex items-center justify-between mt-12 pt-8 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => goToChapter(currentChapter - 1)}
                                    disabled={!hasPrevChapter}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous Chapter
                                </Button>

                                <span className="text-sm text-muted-foreground">
                                    Chapter {currentChapter} of {totalChapters || '...'}
                                </span>

                                <Button
                                    variant="outline"
                                    onClick={() => goToChapter(currentChapter + 1)}
                                    disabled={!hasNextChapter}
                                >
                                    Next Chapter
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        // Loading skeleton
                        <div className="space-y-6">
                            <Skeleton className="h-12 w-3/4" />
                            <Skeleton className="h-8 w-1/2" />
                            <div className="space-y-4">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <Skeleton key={i} className="h-24 w-full" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.footer
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{ duration: 0.3 }}
                        className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
                    >
                        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => goToChapter(currentChapter - 1)}
                                disabled={!hasPrevChapter}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="text-sm font-medium">
                                {currentChapter} / {totalChapters || '...'}
                            </span>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => goToChapter(currentChapter + 1)}
                                disabled={!hasNextChapter}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.footer>
                )}
            </AnimatePresence>
        </div>
    )
}
