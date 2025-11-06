#!/usr/bin/env node

/**
 * Bulk Book Import Script for Sanity CMS
 * 
 * This script imports books from a JSON file into Sanity as DRAFTS.
 * Admins can then preview and publish from Sanity Studio.
 * 
 * Usage:
 *   node scripts/import-book.mjs path/to/import.json
 * 
 * JSON Structure:
 * {
 *   "books": [
 *     {
 *       "title": { "en": "Book Title", "fa": "عنوان کتاب" },
 *       "slug": "book-title",
 *       "author": "Author Name",
 *       "publishYear": 2024,
 *       "summary": { "en": "Summary...", "fa": "خلاصه..." },
 *       "genres": ["fiction", "classic"],
 *       "level": "intermediate",
 *       "chapters": [
 *         {
 *           "title": { "en": "Chapter 1", "fa": "فصل ۱" },
 *           "chapterNumber": 1,
 *           "paragraphs": [
 *             {
 *               "english": "English text...",
 *               "farsi": "متن فارسی..."
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */

import { createClient } from '@sanity/client'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

// ============================================
// CONFIGURATION
// ============================================

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_ADMIN_TOKEN || '', // Admin token required
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ============================================
// HELPER FUNCTIONS
// ============================================

function textToPortableText(text) {
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substring(7),
          text: text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ]
}

function createBilingualParagraph(paragraph) {
  return {
    _type: 'bilingualParagraph',
    _key: Math.random().toString(36).substring(7),
    english: textToPortableText(paragraph.english),
    farsi: textToPortableText(paragraph.farsi),
  }
}

function createChapter(chapter) {
  return {
    _type: 'chapter',
    _key: Math.random().toString(36).substring(7),
    title: chapter.title,
    chapterNumber: chapter.chapterNumber,
    content: chapter.paragraphs.map(createBilingualParagraph),
  }
}

async function findOrCreateAuthor(authorName) {
  // Check if author exists
  const existingAuthor = await client.fetch(
    `*[_type == "author" && name == $name][0]`,
    { name: authorName }
  )

  if (existingAuthor) {
    console.log(`  ✓ Author "${authorName}" already exists`)
    return existingAuthor._id
  }

  // Create new author
  console.log(`  → Creating new author: "${authorName}"`)
  const newAuthor = await client.create({
    _type: 'author',
    name: authorName,
    slug: {
      _type: 'slug',
      current: authorName.toLowerCase().replace(/\s+/g, '-'),
    },
    bio: {
      en: textToPortableText('Biography coming soon...'),
      fa: textToPortableText('بیوگرافی به زودی...'),
    },
  })

  return newAuthor._id
}

async function importBook(bookData) {
  console.log(`\n📚 Importing: ${bookData.title.en}`)

  try {
    // 1. Find or create author
    const authorId = await findOrCreateAuthor(bookData.author)

    // 2. Check if book already exists
    const existingBook = await client.fetch(
      `*[_type == "book" && slug.current == $slug][0]`,
      { slug: bookData.slug }
    )

    if (existingBook) {
      console.log(`  ⚠️  Book already exists (ID: ${existingBook._id})`)
      console.log(`  → Skipping import. Delete manually if you want to re-import.`)
      return { success: false, reason: 'already_exists' }
    }

    // 3. Create book document (as DRAFT)
    const bookDoc = {
      _type: 'book',
      _id: `drafts.book-${bookData.slug}`, // Create as draft
      title: bookData.title,
      slug: {
        _type: 'slug',
        current: bookData.slug,
      },
      author: {
        _type: 'reference',
        _ref: authorId,
      },
      publishYear: bookData.publishYear,
      isbn: bookData.isbn || undefined,
      publisher: bookData.publisher || undefined,
      summary: bookData.summary,
      genres: bookData.genres,
      level: bookData.level,
      chapters: bookData.chapters.map(createChapter),
      freePreviewPages: bookData.freePreviewPages || 20,
      isPremium: bookData.isPremium !== undefined ? bookData.isPremium : false,
      featured: bookData.featured !== undefined ? bookData.featured : false,
      publishedAt: new Date().toISOString(),
    }

    // 4. Upload cover image if provided
    if (bookData.coverImageUrl) {
      console.log(`  → Uploading cover image...`)
      try {
        const imageAsset = await client.assets.upload('image', bookData.coverImageUrl, {
          filename: `${bookData.slug}-cover.jpg`,
        })
        bookDoc.coverImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
          alt: bookData.title.en,
        }
      } catch (error) {
        console.log(`  ⚠️  Failed to upload cover image: ${error.message}`)
      }
    }

    // 5. Create the document
    const result = await client.create(bookDoc)

    console.log(`  ✅ Successfully imported as DRAFT`)
    console.log(`  → Draft ID: ${result._id}`)
    console.log(`  → Preview in Sanity Studio to publish`)

    return { success: true, id: result._id }
  } catch (error) {
    console.error(`  ❌ Error importing book: ${error.message}`)
    return { success: false, reason: error.message }
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🚀 Ketab-Yar Book Import Script\n')

  // Validate environment
  if (!process.env.SANITY_PROJECT_ID) {
    console.error('❌ Error: SANITY_PROJECT_ID not set in environment')
    process.exit(1)
  }

  if (!process.env.SANITY_ADMIN_TOKEN) {
    console.error('❌ Error: SANITY_ADMIN_TOKEN not set in environment')
    console.error('   Get your token from: https://www.sanity.io/manage')
    process.exit(1)
  }

  // Get input file
  const inputFile = process.argv[2]
  if (!inputFile) {
    console.error('❌ Error: No input file specified')
    console.error('   Usage: node scripts/import-book.mjs path/to/import.json')
    process.exit(1)
  }

  // Read and parse JSON
  console.log(`📖 Reading: ${inputFile}\n`)
  let data
  try {
    const fileContent = await readFile(resolve(inputFile), 'utf-8')
    data = JSON.parse(fileContent)
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`)
    process.exit(1)
  }

  if (!data.books || !Array.isArray(data.books)) {
    console.error('❌ Error: Invalid JSON structure. Expected { "books": [...] }')
    process.exit(1)
  }

  console.log(`Found ${data.books.length} book(s) to import\n`)
  console.log('─'.repeat(60))

  // Import each book
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  }

  for (const book of data.books) {
    const result = await importBook(book)
    if (result.success) {
      results.success++
    } else if (result.reason === 'already_exists') {
      results.skipped++
    } else {
      results.failed++
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60))
  console.log('\n📊 Import Summary:')
  console.log(`   ✅ Successfully imported: ${results.success}`)
  console.log(`   ⚠️  Skipped (already exists): ${results.skipped}`)
  console.log(`   ❌ Failed: ${results.failed}`)
  console.log('\n💡 Next steps:')
  console.log('   1. Open Sanity Studio: cd studio && npm run dev')
  console.log('   2. Review drafts and publish when ready')
  console.log('   3. Add cover images if not provided in JSON')
  console.log('')
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
