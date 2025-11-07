/**
 * CONVERSION SCRIPT: Sanity Structure → Optimized Reader Format
 * 
 * This script converts the heavy Sanity Portable Text structure
 * into a lightweight, optimized format for the reader.
 * 
 * Usage:
 * - Run after admin uploads book to Sanity
 * - Automatically converts and uploads to Supabase Storage
 * - Reduces file size by 15x (15-30 MB → 1-2 MB)
 */

interface SanityBook {
    _id: string
    slug: { current: string }
    title: { en: string; fa: string }
    author: { name: string }
    chapters: SanityChapter[]
}

interface SanityChapter {
    _key: string
    title: { en: string; fa: string }
    chapterNumber: number
    content: SanityContent[]
}

interface SanityContent {
    _type: 'bilingualParagraph' | 'image'
    _key: string
    english?: any[]
    farsi?: any[]
    alignment?: string
    pageBreakAfter?: boolean
}

// ============================================
// OPTIMIZED STRUCTURE (Output)
// ============================================

interface OptimizedBook {
    bookId: string
    title: { en: string; fa: string }
    author: string
    chapters: OptimizedChapter[]
}

interface OptimizedChapter {
    number: number
    title: { en: string; fa: string }
    pages: OptimizedPage[]
}

interface OptimizedPage {
    pageNumber: number
    paragraphs: OptimizedParagraph[]
}

interface OptimizedParagraph {
    id: string
    type: 'p' | 'h1' | 'h2' | 'h3' | 'blockquote'
    en: string
    fa: string
    marks?: {
        en?: Mark[]
        fa?: Mark[]
    }
}

interface Mark {
    start: number
    end: number
    type: 'strong' | 'em' | 'underline' | 'strike-through'
}

// ============================================
// CONVERSION FUNCTIONS
// ============================================

/**
 * Extract plain text from Sanity Portable Text blocks
 */
function extractTextFromBlocks(blocks: any[]): string {
    if (!blocks || blocks.length === 0) return ''

    return blocks
        .map(block => {
            if (block._type === 'block' && block.children) {
                return block.children
                    .map((child: any) => child.text || '')
                    .join('')
            }
            return ''
        })
        .join(' ')
}

/**
 * Extract marks (bold, italic, etc.) from Sanity blocks
 */
function extractMarksFromBlocks(blocks: any[]): Mark[] {
    if (!blocks || blocks.length === 0) return []

    const marks: Mark[] = []
    let currentPosition = 0

    for (const block of blocks) {
        if (block._type === 'block' && block.children) {
            for (const child of block.children) {
                const text = child.text || ''
                const textLength = text.length

                if (child.marks && child.marks.length > 0) {
                    for (const mark of child.marks) {
                        marks.push({
                            start: currentPosition,
                            end: currentPosition + textLength,
                            type: mark as any
                        })
                    }
                }

                currentPosition += textLength
            }
            currentPosition += 1 // Space between blocks
        }
    }

    return marks
}

/**
 * Get paragraph type from Sanity block style
 */
function getParagraphType(blocks: any[]): 'p' | 'h1' | 'h2' | 'h3' | 'blockquote' {
    if (!blocks || blocks.length === 0) return 'p'

    const firstBlock = blocks[0]
    if (firstBlock && firstBlock.style) {
        const style = firstBlock.style
        if (style === 'h1') return 'h1'
        if (style === 'h2') return 'h2'
        if (style === 'h3') return 'h3'
        if (style === 'blockquote') return 'blockquote'
    }

    return 'p'
}

/**
 * Convert Sanity bilingual paragraph to optimized format
 */
function convertParagraph(
    sanityPara: SanityContent,
    index: number
): OptimizedParagraph | null {
    if (sanityPara._type !== 'bilingualParagraph') return null

    const enText = extractTextFromBlocks(sanityPara.english || [])
    const faText = extractTextFromBlocks(sanityPara.farsi || [])

    if (!enText && !faText) return null

    const enMarks = extractMarksFromBlocks(sanityPara.english || [])
    const faMarks = extractMarksFromBlocks(sanityPara.farsi || [])

    const type = getParagraphType(sanityPara.english || [])

    return {
        id: `p${index}`,
        type,
        en: enText,
        fa: faText,
        marks: {
            en: enMarks.length > 0 ? enMarks : undefined,
            fa: faMarks.length > 0 ? faMarks : undefined
        }
    }
}

/**
 * Calculate pages from paragraphs (300 words per page)
 */
function paginateParagraphs(paragraphs: OptimizedParagraph[]): OptimizedPage[] {
    const WORDS_PER_PAGE = 300
    const pages: OptimizedPage[] = []
    let currentPage: OptimizedParagraph[] = []
    let currentWordCount = 0
    let pageNumber = 1

    for (const para of paragraphs) {
        const wordCount = para.en.split(/\s+/).length

        // If adding this paragraph exceeds page limit, start new page
        if (currentWordCount + wordCount > WORDS_PER_PAGE && currentPage.length > 0) {
            pages.push({
                pageNumber: pageNumber++,
                paragraphs: currentPage
            })
            currentPage = []
            currentWordCount = 0
        }

        currentPage.push(para)
        currentWordCount += wordCount
    }

    // Add last page
    if (currentPage.length > 0) {
        pages.push({
            pageNumber: pageNumber,
            paragraphs: currentPage
        })
    }

    return pages
}

/**
 * Main conversion function: Sanity → Optimized
 */
export function convertSanityToOptimized(sanityBook: SanityBook): OptimizedBook {
    const optimizedChapters: OptimizedChapter[] = []

    for (const chapter of sanityBook.chapters) {
        // Convert all paragraphs
        const paragraphs: OptimizedParagraph[] = []

        for (let i = 0; i < chapter.content.length; i++) {
            const converted = convertParagraph(chapter.content[i], i)
            if (converted) {
                paragraphs.push(converted)
            }
        }

        // Paginate paragraphs
        const pages = paginateParagraphs(paragraphs)

        optimizedChapters.push({
            number: chapter.chapterNumber,
            title: chapter.title,
            pages
        })
    }

    return {
        bookId: sanityBook.slug.current,
        title: sanityBook.title,
        author: sanityBook.author.name,
        chapters: optimizedChapters
    }
}

/**
 * Upload optimized book to Supabase Storage
 */
export async function uploadOptimizedBook(
    optimizedBook: OptimizedBook,
    supabaseClient: any
): Promise<{ success: boolean; error?: string }> {
    try {
        const fileName = `${optimizedBook.bookId}.json`
        const fileContent = JSON.stringify(optimizedBook, null, 2)

        const { data, error } = await supabaseClient.storage
            .from('book-content')
            .upload(fileName, fileContent, {
                contentType: 'application/json',
                upsert: true // Overwrite if exists
            })

        if (error) {
            return { success: false, error: error.message }
        }

        console.log(`✅ Uploaded optimized book: ${fileName}`)
        console.log(`📊 Size: ${(fileContent.length / 1024).toFixed(2)} KB`)

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Complete workflow: Convert + Upload
 */
export async function processBook(
    sanityBook: SanityBook,
    supabaseClient: any
): Promise<{ success: boolean; error?: string; optimizedBook?: OptimizedBook }> {
    try {
        // Step 1: Convert
        console.log(`🔄 Converting book: ${sanityBook.title.en}`)
        const optimizedBook = convertSanityToOptimized(sanityBook)

        // Step 2: Upload
        console.log(`📤 Uploading to Supabase Storage...`)
        const uploadResult = await uploadOptimizedBook(optimizedBook, supabaseClient)

        if (!uploadResult.success) {
            return { success: false, error: uploadResult.error }
        }

        console.log(`✅ Book processed successfully!`)
        return { success: true, optimizedBook }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
