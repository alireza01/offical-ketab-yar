'use client'

import { sanityClientCDN } from '@/lib/sanity/client'
import type { Chapter } from '@/lib/sanity/types'
import { groq } from 'next-sanity'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseChapterLoaderProps {
    bookSlug: string
    initialChapter: Chapter
}

interface ChapterCache {
    [chapterNumber: number]: Chapter
}

export function useChapterLoader({ bookSlug, initialChapter }: UseChapterLoaderProps) {
    const [chapters, setChapters] = useState<ChapterCache>({ 1: initialChapter })
    const [currentChapter, setCurrentChapter] = useState(1)
    const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
    const [totalChapters, setTotalChapters] = useState<number | null>(null)

    const loadingRef = useRef<Set<number>>(new Set())
    const scrollPositionRef = useRef<{ [key: number]: number }>({})

    // Fetch total chapter count
    useEffect(() => {
        const fetchTotalChapters = async () => {
            const query = groq`*[_type == "book" && slug.current == $slug][0] {
        "totalChapters": count(chapters)
      }`

            const result = await sanityClientCDN.fetch(query, { slug: bookSlug })
            setTotalChapters(result.totalChapters)
        }

        fetchTotalChapters()
    }, [bookSlug])

    // Load a specific chapter
    const loadChapter = useCallback(
        async (chapterNumber: number) => {
            // Don't load if already loaded or loading
            if (chapters[chapterNumber] || loadingRef.current.has(chapterNumber)) {
                return
            }

            // Don't load if beyond total chapters
            if (totalChapters && chapterNumber > totalChapters) {
                return
            }

            loadingRef.current.add(chapterNumber)
            setLoading((prev) => ({ ...prev, [chapterNumber]: true }))

            try {
                // First, try to load from IndexedDB (offline storage)
                const { getChapter } = await import('@/lib/pwa/offline-storage')
                const cachedChapter = await getChapter(bookSlug, chapterNumber)

                if (cachedChapter) {
                    // Found in offline storage
                    setChapters((prev) => ({
                        ...prev,
                        [chapterNumber]: {
                            title: cachedChapter.title,
                            chapterNumber: cachedChapter.chapterNumber,
                            content: cachedChapter.content,
                        },
                    }))
                    loadingRef.current.delete(chapterNumber)
                    setLoading((prev) => ({ ...prev, [chapterNumber]: false }))
                    return
                }

                // Not in offline storage, fetch from Sanity
                const query = groq`*[_type == "book" && slug.current == $slug][0] {
          "chapter": chapters[${chapterNumber - 1}] {
            title,
            chapterNumber,
            content[] {
              _type,
              _type == "bilingualParagraph" => {
                english,
                farsi
              },
              _type == "image" => {
                "url": asset->url,
                alt,
                caption
              }
            }
          }
        }`

                const result = await sanityClientCDN.fetch(query, { slug: bookSlug })

                if (result?.chapter) {
                    setChapters((prev) => ({
                        ...prev,
                        [chapterNumber]: result.chapter,
                    }))

                    // Save to IndexedDB for offline access
                    const { saveChapter } = await import('@/lib/pwa/offline-storage')
                    await saveChapter({
                        bookSlug,
                        chapterNumber: result.chapter.chapterNumber,
                        title: result.chapter.title,
                        content: result.chapter.content,
                    }).catch((err) => console.warn('Failed to cache chapter:', err))
                }
            } catch (error) {
                console.error(`Failed to load chapter ${chapterNumber}:`, error)
            } finally {
                loadingRef.current.delete(chapterNumber)
                setLoading((prev) => ({ ...prev, [chapterNumber]: false }))
            }
        },
        [bookSlug, chapters, totalChapters]
    )

    // N+1 Strategy: Load next chapter immediately after current chapter loads
    useEffect(() => {
        if (currentChapter === 1 && chapters[1]) {
            // Chapter 1 loaded, immediately start loading Chapter 2
            loadChapter(2)
        }
    }, [currentChapter, chapters, loadChapter])

    // Handle scroll position tracking and prefetching
    const handleScroll = useCallback(
        (chapterNumber: number, scrollPercentage: number) => {
            scrollPositionRef.current[chapterNumber] = scrollPercentage

            // 60% rule: When user reaches 60% of chapter N (N >= 2), load chapter N+1
            if (chapterNumber >= 2 && scrollPercentage >= 60) {
                const nextChapter = chapterNumber + 1
                if (!chapters[nextChapter] && !loadingRef.current.has(nextChapter)) {
                    loadChapter(nextChapter)
                }
            }

            // Also prefetch N+2 when at 80% (stay 2 chapters ahead)
            if (scrollPercentage >= 80) {
                const nextNextChapter = chapterNumber + 2
                if (!chapters[nextNextChapter] && !loadingRef.current.has(nextNextChapter)) {
                    loadChapter(nextNextChapter)
                }
            }
        },
        [chapters, loadChapter]
    )

    // Navigate to specific chapter
    const goToChapter = useCallback(
        (chapterNumber: number) => {
            if (chapterNumber < 1 || (totalChapters && chapterNumber > totalChapters)) {
                return
            }

            setCurrentChapter(chapterNumber)

            // Load chapter if not already loaded
            if (!chapters[chapterNumber]) {
                loadChapter(chapterNumber)
            }

            // Prefetch next chapter
            if (!chapters[chapterNumber + 1]) {
                loadChapter(chapterNumber + 1)
            }
        },
        [chapters, loadChapter, totalChapters]
    )

    return {
        chapters,
        currentChapter,
        totalChapters,
        loading,
        goToChapter,
        handleScroll,
        hasNextChapter: totalChapters ? currentChapter < totalChapters : true,
        hasPrevChapter: currentChapter > 1,
    }
}
