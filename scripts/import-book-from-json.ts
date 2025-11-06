/**
 * Import Book from JSON File to Sanity
 * 
 * Usage:
 * 1. Place your JSON file in the project root (e.g., my-book.json)
 * 2. Run: npx ts-node scripts/import-book-from-json.ts my-book.json
 * 
 * JSON Format: See example-book.json for complete structure
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// Sanity client configuration
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN, // Required for write operations
    useCdn: false,
})

interface ImportResult {
    success: boolean
    bookId?: string
    error?: string
    warnings?: string[]
}

async function importBookFromJSON(jsonFilePath: string): Promise<ImportResult> {
    const warnings: string[] = []

    try {
        // Read JSON file
        console.log(`📖 Reading JSON file: ${jsonFilePath}`)
        const fullPath = path.resolve(process.cwd(), jsonFilePath)

        if (!fs.existsSync(fullPath)) {
            return {
                success: false,
                error: `File not found: ${jsonFilePath}`,
            }
        }

        const fileContent = fs.readFileSync(fullPath, 'utf-8')
        const bookData = JSON.parse(fileContent)

        // Validate required fields
        console.log('✅ Validating book data...')
        if (!bookData.title?.en || !bookData.title?.fa) {
            return {
                success: false,
                error: 'Missing required field: title (both en and fa required)',
            }
        }

        if (!bookData.slug?.current) {
            return {
                success: false,
                error: 'Missing required field: slug.current',
            }
        }

        if (!bookData.chapters || bookData.chapters.length === 0) {
            return {
                success: false,
                error: 'Book must have at least one chapter',
            }
        }

        // Check if book with same slug already exists
        console.log('🔍 Checking for existing book...')
        const existingBook = await client.fetch(
            `*[_type == "book" && slug.current == $slug][0]`,
            { slug: bookData.slug.current }
        )

        if (existingBook) {
            warnings.push(`Book with slug "${bookData.slug.current}" already exists. It will be updated.`)
            bookData._id = existingBook._id
        }

        // Validate author reference
        if (bookData.author?._ref) {
            const authorExists = await client.fetch(
                `*[_type == "author" && _id == $id][0]`,
                { id: bookData.author._ref }
            )
            if (!authorExists) {
                warnings.push(`Author with ID "${bookData.author._ref}" not found. Please create author first.`)
            }
        }

        // Validate genre references
        if (bookData.genres && Array.isArray(bookData.genres)) {
            for (const genre of bookData.genres) {
                if (genre._ref) {
                    const genreExists = await client.fetch(
                        `*[_type == "genre" && _id == $id][0]`,
                        { id: genre._ref }
                    )
                    if (!genreExists) {
                        warnings.push(`Genre with ID "${genre._ref}" not found. Please create genre first.`)
                    }
                }
            }
        }

        // Import book
        console.log('📝 Importing book to Sanity...')
        const result = await client.createOrReplace(bookData)

        console.log('✅ Book imported successfully!')
        console.log(`📚 Book ID: ${result._id}`)
        console.log(`🔗 Slug: ${bookData.slug.current}`)
        console.log(`📄 Chapters: ${bookData.chapters.length}`)

        if (warnings.length > 0) {
            console.log('\n⚠️  Warnings:')
            warnings.forEach((warning) => console.log(`   - ${warning}`))
        }

        return {
            success: true,
            bookId: result._id,
            warnings: warnings.length > 0 ? warnings : undefined,
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('❌ Import failed:', errorMessage)
        return {
            success: false,
            error: errorMessage,
        }
    }
}

// CLI execution
const args = process.argv.slice(2)
if (args.length === 0) {
    console.log('Usage: npx ts-node scripts/import-book-from-json.ts <json-file-path>')
    console.log('Example: npx ts-node scripts/import-book-from-json.ts example-book.json')
    process.exit(1)
}

const jsonFilePath = args[0]
importBookFromJSON(jsonFilePath).then((result) => {
    if (result.success) {
        console.log('\n🎉 Import completed successfully!')
        process.exit(0)
    } else {
        console.error('\n❌ Import failed!')
        process.exit(1)
    }
})

export { importBookFromJSON }

