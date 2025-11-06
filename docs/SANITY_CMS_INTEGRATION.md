# 🎨 Sanity CMS Integration Guide
## Complete Setup & Usage Documentation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [Content Schemas](#content-schemas)
5. [Bulk Import](#bulk-import)
6. [Next.js Integration](#nextjs-integration)
7. [Agent Compliance](#agent-compliance)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This integration adds **Sanity CMS (free tier)** as the content management system for Ketab-Yar, solving the performance issues with the previous database-based content storage.

### Why Sanity?

**Agent 2 (Performance) Benefits:**
- ✅ ONE API call gets full book (vs 500 DB queries)
- ✅ CDN-powered content delivery (faster than Supabase)
- ✅ Free tier sufficient for MVP
- ✅ Offline-first architecture maintained

**Agent 3 (Psychology) Benefits:**
- ✅ Beautiful admin interface (Sanity Studio)
- ✅ Real-time collaboration
- ✅ Rich text editing with live preview
- ✅ Draft/publish workflow

**Agent 1 (SEO) Benefits:**
- ✅ SSG-friendly (static generation at build time)
- ✅ Structured content for JSON-LD
- ✅ Optimized image delivery via CDN

---

## 🏗️ Architecture

### Hybrid System

```
┌─────────────────────────────────────────────────────────┐
│                    SANITY CMS (Free)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Books     │  │   Authors    │  │  Blog Posts  │  │
│  │  (Content)   │  │    (Bios)    │  │  (Content)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                  ↓                  ↓          │
│    Sanity CDN (Fast, Global, Free)                      │
└─────────────────────────────────────────────────────────┘
                           ↓
                    Next.js App
                           ↓
┌─────────────────────────────────────────────────────────┐
│              SUPABASE (Free Tier)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   profiles   │  │user_progress │  │  vocabulary  │  │
│  │    (Auth)    │  │  (Reading)   │  │   (Words)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Separation

**Sanity (Content):**
- Book metadata (title, author, summary, genres)
- Full book content (chapters, paragraphs)
- Author bios
- Blog posts
- Static pages

**Supabase (User Data):**
- User profiles & authentication
- Reading progress
- Vocabulary lists
- Bookmarks & highlights
- Reviews & ratings
- Gamification (XP, streaks, leagues)

---

## 🚀 Setup Instructions

### Step 1: Create Sanity Project

```bash
# Navigate to studio folder
cd studio

# Install dependencies
npm install

# Initialize Sanity (if not already done)
npx sanity init

# Follow prompts:
# - Project name: ketab-yar-cms
# - Dataset: production
# - Template: Clean project
```

### Step 2: Get Sanity Credentials

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to **Settings** → **API**
4. Copy your **Project ID**
5. Create a **Token** with **Editor** permissions
6. Copy the token

### Step 3: Configure Environment Variables

**In project root** (`.env.local`):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_ADMIN_TOKEN=your_admin_token_here
```

**In studio folder** (`studio/.env`):
```env
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
```

### Step 4: Install Dependencies

**Main project:**
```bash
npm install
```

**Studio:**
```bash
cd studio
npm install
```

### Step 5: Start Sanity Studio

```bash
cd studio
npm run dev
```

Studio will be available at: http://localhost:3333

### Step 6: Deploy Studio (Optional)

```bash
cd studio
npm run deploy
```

Your studio will be available at: `https://your-project.sanity.studio`

---

## 📚 Content Schemas

### 1. Bilingual Text (Object)

Simple bilingual text field:

```typescript
{
  en: "English text",
  fa: "متن فارسی"
}
```

### 2. Bilingual Portable Text (Object)

Rich text with formatting, links, images:

```typescript
{
  en: [/* Portable Text blocks */],
  fa: [/* Portable Text blocks */]
}
```

### 3. Bilingual Paragraph (Object)

Paragraph-level bilingual content:

```typescript
{
  english: [/* Portable Text */],
  farsi: [/* Portable Text */]
}
```

### 4. Chapter (Object)

Book chapter structure:

```typescript
{
  title: { en: "Chapter 1", fa: "فصل ۱" },
  chapterNumber: 1,
  content: [
    { _type: "bilingualParagraph", ... },
    { _type: "image", ... }
  ]
}
```

### 5. Author (Document)

Author information:

```typescript
{
  name: "F. Scott Fitzgerald",
  slug: "f-scott-fitzgerald",
  image: { ... },
  nationality: "American",
  born: "1896-1940",
  bio: { en: [...], fa: [...] },
  website: "https://...",
  socialMedia: { ... }
}
```

### 6. Book (Document)

Complete book with content:

```typescript
{
  title: { en: "The Great Gatsby", fa: "گتسبی بزرگ" },
  slug: "the-great-gatsby",
  coverImage: { ... },
  author: { _ref: "author-id" },
  publishYear: 1925,
  isbn: "978-...",
  publisher: "Scribner",
  summary: { en: "...", fa: "..." },
  genres: ["classic", "fiction"],
  level: "intermediate",
  chapters: [{ ... }],
  freePreviewPages: 20,
  isPremium: false,
  featured: true
}
```

### 7. Blog Post (Document)

Blog post with internal linking:

```typescript
{
  title: { en: "...", fa: "..." },
  slug: "post-slug",
  author: { _ref: "author-id" },
  mainImage: { ... },
  summary: { en: "...", fa: "..." },
  body: { en: [...], fa: [...] },
  categories: ["reading-tips"],
  relatedBooks: [{ _ref: "book-id" }]
}
```

---

## 📥 Bulk Import

### Import Script Usage

```bash
# Set environment variables
export SANITY_PROJECT_ID=your_project_id
export SANITY_ADMIN_TOKEN=your_admin_token
export SANITY_DATASET=production

# Run import
node scripts/import-book.mjs scripts/import-example.json
```

### JSON Structure

See `scripts/import-example.json` for complete example.

**Minimal structure:**

```json
{
  "books": [
    {
      "title": { "en": "Book Title", "fa": "عنوان" },
      "slug": "book-slug",
      "author": "Author Name",
      "publishYear": 2024,
      "summary": { "en": "...", "fa": "..." },
      "genres": ["fiction"],
      "level": "intermediate",
      "chapters": [
        {
          "title": { "en": "Chapter 1", "fa": "فصل ۱" },
          "chapterNumber": 1,
          "paragraphs": [
            {
              "english": "English paragraph...",
              "farsi": "پاراگراف فارسی..."
            }
          ]
        }
      ]
    }
  ]
}
```

### Import Features

- ✅ Creates books as **DRAFTS** (not published)
- ✅ Auto-creates authors if they don't exist
- ✅ Skips existing books (no duplicates)
- ✅ Uploads cover images (if URL provided)
- ✅ Converts plain text to Portable Text
- ✅ Generates unique keys for all blocks

### After Import

1. Open Sanity Studio
2. Go to **Books** section
3. Review draft books
4. Add/edit cover images
5. Preview content
6. Click **Publish** when ready

---

## 🔗 Next.js Integration

### Fetching Data (Server-Side)

```typescript
// app/books/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity/client'
import { bookBySlugQuery } from '@/lib/sanity/queries'

export async function generateStaticParams() {
  const books = await sanityClient.fetch(bookSlugsQuery)
  return books.map((book) => ({ slug: book.slug }))
}

export default async function BookPage({ params }) {
  const book = await sanityClient.fetch(bookBySlugQuery, {
    slug: params.slug
  })
  
  return <BookDetailClient book={book} />
}
```

### Fetching Data (Client-Side)

```typescript
// components/books/book-list.tsx
'use client'

import { sanityClientCDN } from '@/lib/sanity/client'
import { booksQuery } from '@/lib/sanity/queries'
import { useEffect, useState } from 'react'

export function BookList() {
  const [books, setBooks] = useState([])
  
  useEffect(() => {
    sanityClientCDN.fetch(booksQuery).then(setBooks)
  }, [])
  
  return <div>{/* Render books */}</div>
}
```

### Rendering Portable Text

```typescript
import { PortableText } from '@portabletext/react'

export function BookContent({ content }) {
  return (
    <PortableText
      value={content.en} // or content.fa
      components={{
        block: {
          h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
          normal: ({ children }) => <p className="mb-4">{children}</p>,
        },
        marks: {
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        },
      }}
    />
  )
}
```

### Optimized Images

```typescript
import { getImageUrl } from '@/lib/sanity/client'
import Image from 'next/image'

export function BookCover({ book }) {
  return (
    <Image
      src={getImageUrl(book.coverImage, 400, 600)}
      alt={book.title.en}
      width={400}
      height={600}
      priority
    />
  )
}
```

---

## ✅ Agent Compliance

### Agent 1 (SEO) ✅

**SSG Strategy:**
```typescript
// Force static generation
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

// Generate all book pages at build time
export async function generateStaticParams() {
  const books = await sanityClient.fetch(bookSlugsQuery)
  return books.map((book) => ({ slug: book.slug }))
}
```

**JSON-LD Schema:**
```typescript
const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: book.title.en,
  author: {
    '@type': 'Person',
    name: book.author.name
  },
  // ... rest of schema
}
```

### Agent 2 (Performance) ✅

**Content Delivery:**
- ✅ ONE API call per book (not 500)
- ✅ CDN-powered (Sanity CDN)
- ✅ Client-side pagination
- ✅ Offline-ready (IndexedDB cache)

**Code Splitting:**
```typescript
// Dynamic import for heavy components
const BookReader = dynamic(
  () => import('@/components/reader/book-reader'),
  { ssr: false, loading: () => <ReaderSkeleton /> }
)
```

### Agent 3 (Psychology) ✅

**Admin Experience:**
- ✅ Beautiful Sanity Studio interface
- ✅ Real-time preview
- ✅ Draft/publish workflow
- ✅ Collaborative editing

**User Experience:**
- ✅ Fast content loading
- ✅ Smooth page transitions
- ✅ Offline reading capability

---

## 🐛 Troubleshooting

### Issue: "Project ID not found"

**Solution:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SANITY_PROJECT_ID

# Make sure .env.local exists and is loaded
cat .env.local
```

### Issue: "Unauthorized" when importing

**Solution:**
- Make sure `SANITY_ADMIN_TOKEN` has **Editor** permissions
- Regenerate token if needed
- Check token is not expired

### Issue: "Cannot find module 'next-sanity'"

**Solution:**
```bash
npm install next-sanity @sanity/client @sanity/image-url @portabletext/react
```

### Issue: Images not loading

**Solution:**
```typescript
// Add Sanity CDN to next.config.mjs
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
    },
  ],
}
```

### Issue: Drafts showing in production

**Solution:**
```typescript
// Always filter out drafts in queries
*[_type == "book" && !(_id in path("drafts.**"))]
```

---

## 📊 Free Tier Limits

**Sanity Free Tier:**
- ✅ 3 users
- ✅ 10,000 documents
- ✅ 5GB assets
- ✅ 100GB CDN bandwidth/month
- ✅ Unlimited API requests

**Sufficient for MVP:** Yes! Can handle 1000+ books easily.

---

## 🎯 Next Steps

1. **Setup Sanity** (30 minutes)
   - Create project
   - Configure environment
   - Start studio

2. **Import Sample Data** (15 minutes)
   - Run import script with example
   - Review in studio
   - Publish first book

3. **Update Next.js Pages** (2-3 hours)
   - Replace mock data with Sanity queries
   - Update book detail page
   - Update library page
   - Update reader component

4. **Test & Deploy** (1 hour)
   - Test SSG generation
   - Test offline functionality
   - Deploy to Vercel
   - Deploy studio

---

## 📞 Support

**Sanity Documentation:**
- https://www.sanity.io/docs
- https://www.sanity.io/docs/groq

**Next.js Integration:**
- https://github.com/sanity-io/next-sanity

**Community:**
- https://slack.sanity.io

---

**Status:** ✅ READY FOR IMPLEMENTATION  
**Estimated Setup Time:** 4-6 hours  
**Complexity:** Medium  
**Agent Approval:** All agents approve ✅

