# 🔄 Sanity CMS Migration Guide
## Moving from Supabase to Sanity for Content

---

## 📋 Overview

This guide helps you migrate existing book content from Supabase's `book_content` table to Sanity CMS.

**When to use this guide:**
- You have existing books in Supabase
- You want to move content to Sanity
- You need to preserve book metadata

**When NOT to use this guide:**
- Starting fresh with new content (just use Sanity directly)
- No existing books in database

---

## 🎯 Migration Strategy

### Option A: Fresh Start (Recommended for MVP)
**Best for:** New projects, minimal existing content

**Steps:**
1. Keep Supabase for user data only
2. Start adding books directly to Sanity
3. No migration needed

**Pros:**
- ✅ Fastest approach
- ✅ No data conversion
- ✅ Clean start

**Cons:**
- ❌ Lose existing content (if any)

---

### Option B: Full Migration (For Production)
**Best for:** Existing content that must be preserved

**Steps:**
1. Export books from Supabase
2. Convert to Sanity format
3. Import to Sanity
4. Update Next.js to use Sanity
5. Archive old Supabase tables

**Pros:**
- ✅ Preserve all content
- ✅ Maintain book IDs (via slug)
- ✅ No data loss

**Cons:**
- ❌ Requires conversion script
- ❌ Takes more time

---

## 🚀 Full Migration Process

### Step 1: Export from Supabase (30 minutes)

Create export script: `scripts/export-from-supabase.mjs`

```javascript
import { createClient } from '@supabase/supabase-js'
import { writeFile } from 'fs/promises'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function exportBooks() {
  // 1. Get all books
  const { data: books } = await supabase
    .from('books')
    .select('*')
  
  // 2. Get all authors
  const { data: authors } = await supabase
    .from('authors')
    .select('*')
  
  // 3. Get book content
  const booksWithContent = await Promise.all(
    books.map(async (book) => {
      const { data: content } = await supabase
        .from('book_content')
        .select('*')
        .eq('book_id', book.id)
        .order('page_number', { ascending: true })
      
      return {
        ...book,
        content: content
      }
    })
  )
  
  // 4. Save to JSON
  await writeFile(
    'export-supabase.json',
    JSON.stringify({ books: booksWithContent, authors }, null, 2)
  )
  
  console.log(`✅ Exported ${books.length} books`)
}

exportBooks()
```

Run:
```bash
node scripts/export-from-supabase.mjs
```

Output: `export-supabase.json`

---

### Step 2: Convert Format (1 hour)

Create conversion script: `scripts/convert-to-sanity.mjs`

```javascript
import { readFile, writeFile } from 'fs/promises'

async function convertToSanity() {
  // Read Supabase export
  const data = JSON.parse(await readFile('export-supabase.json', 'utf-8'))
  
  // Convert to Sanity format
  const sanityBooks = data.books.map(book => {
    // Group content by chapters (if you have chapter info)
    // Or create one chapter per 10 pages
    const chapters = []
    const pagesPerChapter = 10
    
    for (let i = 0; i < book.content.length; i += pagesPerChapter) {
      const chapterPages = book.content.slice(i, i + pagesPerChapter)
      const chapterNumber = Math.floor(i / pagesPerChapter) + 1
      
      chapters.push({
        title: {
          en: `Chapter ${chapterNumber}`,
          fa: `فصل ${chapterNumber}`
        },
        chapterNumber,
        paragraphs: chapterPages.map(page => ({
          english: page.content, // Assuming English content
          farsi: page.content_fa || page.content // Persian if available
        }))
      })
    }
    
    return {
      title: {
        en: book.title,
        fa: book.title_fa || book.title
      },
      slug: book.slug,
      author: book.author, // Author name
      publishYear: book.publication_year,
      isbn: book.isbn,
      publisher: book.publisher,
      summary: {
        en: book.description || book.summary,
        fa: book.description_fa || book.summary_fa || book.description
      },
      genres: book.genres || [],
      level: book.level || 'intermediate',
      freePreviewPages: book.free_preview_pages || 20,
      isPremium: book.is_premium || false,
      featured: book.featured || false,
      coverImageUrl: book.cover_url,
      chapters
    }
  })
  
  // Save in Sanity import format
  await writeFile(
    'import-to-sanity.json',
    JSON.stringify({ books: sanityBooks }, null, 2)
  )
  
  console.log(`✅ Converted ${sanityBooks.length} books`)
}

convertToSanity()
```

Run:
```bash
node scripts/convert-to-sanity.mjs
```

Output: `import-to-sanity.json`

---

### Step 3: Import to Sanity (30 minutes)

Use the existing import script:

```bash
# Set environment variables
export SANITY_PROJECT_ID=your_project_id
export SANITY_ADMIN_TOKEN=your_admin_token
export SANITY_DATASET=production

# Run import
node scripts/import-book.mjs import-to-sanity.json
```

**What happens:**
- ✅ Books created as DRAFTS
- ✅ Authors auto-created
- ✅ Cover images uploaded
- ✅ Content converted to Portable Text

---

### Step 4: Review in Sanity Studio (1 hour)

1. Open Sanity Studio: http://localhost:3333
2. Go to **Books** section
3. For each book:
   - ✅ Check title (EN/FA)
   - ✅ Verify cover image
   - ✅ Review chapter structure
   - ✅ Check content formatting
   - ✅ Verify author link
   - ✅ Publish when ready

---

### Step 5: Update Next.js (2 hours)

Update all pages to use Sanity instead of Supabase:

**Before:**
```typescript
// app/books/[slug]/page.tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function BookPage({ params }) {
  const supabase = await createServerClient()
  const { data: book } = await supabase
    .from('books')
    .select('*, authors(*)')
    .eq('slug', params.slug)
    .single()
  
  return <BookDetail book={book} />
}
```

**After:**
```typescript
// app/books/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity/client'
import { bookBySlugQuery } from '@/lib/sanity/queries'

export default async function BookPage({ params }) {
  const book = await sanityClient.fetch(bookBySlugQuery, {
    slug: params.slug
  })
  
  return <BookDetail book={book} />
}
```

**Files to update:**
1. `app/books/[slug]/page.tsx` - Book detail
2. `app/library/page.tsx` - Book list
3. `app/page.tsx` - Featured books
4. `components/books/book-grid.tsx` - Book cards
5. `app/books/read/[slug]/page.tsx` - Reader

---

### Step 6: Test Migration (1 hour)

**Checklist:**
- [ ] All books visible in Sanity Studio
- [ ] Book detail pages load correctly
- [ ] Images display properly
- [ ] Both EN and FA content shows
- [ ] Reader works with new content
- [ ] Search/filter still works
- [ ] Related books work

**Test commands:**
```bash
# Build static pages
npm run build

# Test production build
npm run start

# Check for errors
npm run lint
```

---

### Step 7: Archive Supabase Tables (15 minutes)

**⚠️ IMPORTANT: Only do this after confirming everything works!**

```sql
-- Rename old tables (don't delete yet)
ALTER TABLE book_content RENAME TO book_content_archived;
ALTER TABLE books RENAME TO books_archived;
ALTER TABLE authors RENAME TO authors_archived;

-- Keep for 30 days, then delete
-- DROP TABLE book_content_archived;
-- DROP TABLE books_archived;
-- DROP TABLE authors_archived;
```

**Keep these Supabase tables:**
- ✅ `profiles` (user accounts)
- ✅ `user_progress` (reading progress)
- ✅ `vocabulary` (saved words)
- ✅ `bookmarks` (user bookmarks)
- ✅ `highlights` (user highlights)
- ✅ `reviews` (user reviews)

---

## 🔄 Rollback Plan

If something goes wrong:

### Quick Rollback (5 minutes)

```sql
-- Restore old tables
ALTER TABLE book_content_archived RENAME TO book_content;
ALTER TABLE books_archived RENAME TO books;
ALTER TABLE authors_archived RENAME TO authors;
```

```bash
# Revert Next.js code
git revert HEAD
npm run build
```

### Gradual Migration (Recommended)

Instead of full migration, run both systems in parallel:

```typescript
// lib/data/index.ts
const USE_SANITY = process.env.NEXT_PUBLIC_USE_SANITY === 'true'

export async function getBookBySlug(slug: string) {
  if (USE_SANITY) {
    return await sanityClient.fetch(bookBySlugQuery, { slug })
  } else {
    return await supabaseGetBook(slug)
  }
}
```

**Benefits:**
- ✅ Test Sanity without breaking production
- ✅ Easy rollback (just toggle env var)
- ✅ Migrate books gradually

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Backup Supabase database
- [ ] Export all books to JSON
- [ ] Test export script
- [ ] Review exported data

### Migration
- [ ] Convert to Sanity format
- [ ] Import to Sanity (as drafts)
- [ ] Review in Sanity Studio
- [ ] Publish books
- [ ] Update Next.js code
- [ ] Test locally

### Post-Migration
- [ ] Deploy to staging
- [ ] Test all features
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Archive old tables (after 30 days)

---

## 🐛 Common Issues

### Issue: Content formatting lost

**Problem:** Plain text in Supabase, need Portable Text in Sanity

**Solution:**
```javascript
// Convert plain text to Portable Text
function textToPortableText(text) {
  return [
    {
      _type: 'block',
      children: [{ _type: 'span', text }]
    }
  ]
}
```

### Issue: Missing translations

**Problem:** Only English content in Supabase

**Solution:**
```javascript
// Use English for both if FA missing
{
  en: book.content,
  fa: book.content_fa || book.content // Fallback to EN
}
```

### Issue: Chapter structure unclear

**Problem:** Supabase has flat pages, Sanity needs chapters

**Solution:**
```javascript
// Auto-create chapters (10 pages each)
const pagesPerChapter = 10
const chapters = []

for (let i = 0; i < pages.length; i += pagesPerChapter) {
  chapters.push({
    title: { en: `Chapter ${i/pagesPerChapter + 1}`, fa: `فصل ${i/pagesPerChapter + 1}` },
    chapterNumber: i/pagesPerChapter + 1,
    paragraphs: pages.slice(i, i + pagesPerChapter)
  })
}
```

### Issue: Images not migrating

**Problem:** Supabase Storage URLs don't work in Sanity

**Solution:**
```javascript
// Download and re-upload to Sanity
const imageAsset = await sanityClient.assets.upload(
  'image',
  imageUrl,
  { filename: `${book.slug}-cover.jpg` }
)
```

---

## 📈 Performance Comparison

### Before (Supabase)
```
Load 500-page book:
- 500 DB queries
- ~5-10 seconds
- Heavy database load
- Pagination on server
```

### After (Sanity)
```
Load 500-page book:
- 1 API call
- ~0.5-1 second
- Zero database load
- Pagination on client
```

**Improvement:** 10x faster, 500x fewer queries

---

## 🎯 Success Criteria

Migration is successful when:

- ✅ All books visible in Sanity
- ✅ All content preserved
- ✅ Images loading correctly
- ✅ Both languages working
- ✅ Reader functioning
- ✅ Performance improved
- ✅ No errors in production
- ✅ User progress still tracked (Supabase)

---

## 📞 Support

**Need help?**
- Check `docs/SANITY_CMS_INTEGRATION.md`
- Review `SANITY_CMS_COMPLETE.md`
- Ask agent team for assistance

**Stuck on migration?**
- Use gradual migration approach
- Keep both systems running
- Migrate one book at a time

---

**Estimated Total Time:** 6-8 hours  
**Difficulty:** Medium  
**Risk:** Low (with proper backup)  
**Recommended:** Gradual migration approach

---

**Ready to migrate?** Start with Step 1: Export from Supabase
