# 📚 Books Module - Complete Documentation

## Overview

This module handles all book-related functionality in the Ketab-Yar platform, following the 5-agent system architecture defined in the steering documentation.

## Architecture

### Hybrid Rendering Strategy

```
app/books/
├── [slug]/              → SSG (Static Site Generation) - Public Zone
│   └── page.tsx         → Book detail pages for SEO
└── read/[slug]/         → CSR (Client-Side Rendering) - Private Zone
    └── page.tsx         → Book reader for logged-in users
```

---

## 📄 `/books/[slug]` - Book Detail Page (SSG)

### Purpose
- **SEO Weapon**: Ranks on Google for book-related keywords
- **Public Access**: Available to all users (logged in or not)
- **Static Generation**: Pre-built at build time for maximum speed

### Agent Responsibilities

#### ✅ AGENT 1 (SEO) - PRIMARY FOCUS
- **generateStaticParams**: Pre-builds pages for all published books
- **generateMetadata**: SEO-optimized titles and descriptions
- **JSON-LD Schema**: Structured data for Google rich results (stars, ratings)
- **Core Web Vitals**: Optimized for LCP < 1.5s, CLS < 0.1

**SEO Formula Applied:**
```
Title: "دانلود و مطالعه [Book] اثر [Author] | پیش‌نمایش رایگان | کتاب‌یار"
Description: "[Summary] - [X] صفحه اول را رایگان و دوزبانه بخوانید"
```

#### ✅ AGENT 2 (PERFORMANCE)
- **Static Generation**: Zero server load at runtime
- **Image Optimization**: Proper dimensions to prevent CLS
- **Parallel Data Fetching**: Reviews and related books loaded simultaneously

#### ✅ AGENT 3 (PSYCHOLOGY)
- **Social Proof**: Display ratings, review count, view count
- **Call-to-Action**: Prominent "مطالعه رایگان" button
- **Related Books**: Recommendation engine for engagement

### Key Features

1. **Rich Book Information**
   - Title, subtitle, author with bio
   - Cover image with hover effects
   - Rating and review count
   - Genres, publication year, page count
   - Languages available

2. **Tabbed Content**
   - Overview: Summary + author bio + related books
   - Reviews: User reviews with ratings
   - Details: ISBN, publisher, technical info

3. **Action Buttons**
   - Read Free Preview (primary CTA)
   - Add to Library
   - Add to Wishlist
   - Share

4. **SEO Optimization**
   - JSON-LD structured data for Google
   - Open Graph tags for social sharing
   - Twitter Card tags
   - Canonical URLs

### Data Flow

```typescript
generateStaticParams() 
  → Fetch all published books
  → Return array of slugs
  → Next.js pre-builds pages at build time

generateMetadata()
  → Fetch book by slug
  → Generate SEO-optimized metadata
  → Include JSON-LD schema

Page Component
  → Fetch book, reviews, related books (parallel)
  → Render BookDetailClient with data
```

---

## 📖 `/books/read/[slug]` - Book Reader (CSR)

### Purpose
- **Reading Experience**: Full book reader with all features
- **Private Access**: Requires authentication
- **Client-Side Rendering**: Zero server load, runs on user's device

### Agent Responsibilities

#### ✅ AGENT 2 (PERFORMANCE) - PRIMARY FOCUS
- **Dynamic Import**: Reader component loaded on-demand
- **Storage-Based Content**: Load from Supabase Storage (not database)
- **Client-Side Pagination**: No server queries for page navigation
- **Zero Server Load**: All logic runs on client

**Performance Strategy:**
```typescript
// Heavy reader component loaded dynamically
const ReaderWithTracking = dynamic(
  () => import('@/components/reader/reader-with-tracking'),
  { loading: () => <ReaderSkeleton />, ssr: false }
)
```

#### ✅ AGENT 3 (PSYCHOLOGY) - PRIMARY FOCUS
- **Freemium Paywall**: Lock content after free preview pages
- **XP Integration**: Track reading progress for gamification
- **Language Toggle**: "Magic Button" for EN ⟷ FA switching
- **Dictionary Popup**: Click words for definitions
- **Progress Tracking**: Save current page, percentage

#### ✅ AGENT 1 (SEO)
- **Blocked from Google**: robots.txt prevents crawling
- **No SEO needed**: Private, authenticated content

### Key Features

1. **Content Loading**
   - **New Approach**: Load from Supabase Storage (JSON files)
   - **Fallback**: Load from database (deprecated, will be removed)
   - **Bilingual**: Both English and Persian content

2. **Freemium Logic**
   - Check user's subscription tier
   - Allow free preview pages for non-premium users
   - Show upgrade prompt after free pages

3. **Progress Tracking**
   - Load user's last read page
   - Track reading progress percentage
   - Update user_library table

4. **User-Specific Data**
   - Current page
   - Bookmarks
   - Highlights
   - Vocabulary saved

### Data Flow

```typescript
Authentication Check
  → Redirect to login if not authenticated

Fetch Book Data
  → Get book by slug
  → Load content from Storage (or database fallback)
  → Get user's subscription tier
  → Get user's reading progress

Transform Data
  → Combine book + content + user data
  → Pass to ReaderWithTracking component

Reader Component (Client-Side)
  → Display current page
  → Handle page navigation
  → Track reading time
  → Update progress
  → Show paywall if needed
```

---

## 🗄️ Database Schema

### Books Table

```sql
books (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  slug text UNIQUE NOT NULL,
  author text NOT NULL,
  author_id uuid REFERENCES authors(id),
  description text,
  summary text,
  cover_url text,
  cover_image text,
  
  -- Content URLs (NEW - Agent 2's optimization)
  content_json_url_en text,  -- URL to JSON file in Storage
  content_json_url_fa text,  -- URL to JSON file in Storage
  
  -- Metadata
  genres text[],
  publication_year integer,
  isbn text,
  publisher text,
  language text DEFAULT 'en',
  
  -- Stats
  total_pages integer DEFAULT 0,
  free_preview_pages integer DEFAULT 20,
  rating numeric,
  view_count integer DEFAULT 0,
  
  -- Status
  status text DEFAULT 'draft',  -- draft, published, archived
  featured boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### User Library Table

```sql
user_library (
  user_id uuid REFERENCES users(id),
  book_id uuid REFERENCES books(id),
  status text DEFAULT 'want_to_read',  -- want_to_read, reading, completed
  current_page integer DEFAULT 0,
  progress_percentage integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, book_id)
)
```

### Book Content Table (DEPRECATED)

```sql
-- ⚠️ This table will be removed in Phase 2
-- Use Supabase Storage instead (content_json_url_en/fa)
book_content (
  id uuid PRIMARY KEY,
  book_id uuid REFERENCES books(id),
  page_number integer NOT NULL,
  content text NOT NULL,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
)
```

---

## 🚀 Performance Optimizations

### Agent 2's Strategy

1. **Content Storage Migration**
   ```
   OLD: 500 database queries for 500 pages
   NEW: 1 Storage request for entire book
   Result: 500x faster, zero DB load
   ```

2. **Dynamic Imports**
   ```typescript
   // Reader only loads when needed
   const Reader = dynamic(() => import('./reader'), { ssr: false })
   ```

3. **Client-Side Pagination**
   ```typescript
   // No server queries for page navigation
   const pages = paginateContent(content, wordsPerPage)
   ```

4. **Image Optimization**
   ```typescript
   // Prevent CLS with proper dimensions
   <Image src={cover} width={300} height={450} priority />
   ```

---

## 🎯 SEO Optimizations

### Agent 1's Strategy

1. **Static Generation**
   ```typescript
   export async function generateStaticParams() {
     const books = await getBooks()
     return books.map(book => ({ slug: book.slug }))
   }
   ```

2. **SEO Metadata**
   ```typescript
   export async function generateMetadata({ params }) {
     // Agent 1's formula applied
     return {
       title: "دانلود و مطالعه [Book] | پیش‌نمایش رایگان",
       description: "[Summary] - [X] صفحه رایگان",
       // ... OpenGraph, Twitter, etc.
     }
   }
   ```

3. **Structured Data**
   ```typescript
   const jsonLd = {
     '@context': 'https://schema.org',
     '@type': 'Book',
     name: book.title,
     author: { '@type': 'Person', name: author.name },
     aggregateRating: { ratingValue: 4.5, reviewCount: 150 },
     // ... enables stars in Google results
   }
   ```

4. **robots.txt**
   ```
   Allow: /books/[slug]      # Public book pages
   Disallow: /books/read/    # Private reader pages
   ```

---

## 🎮 Gamification Integration

### Agent 3's Strategy

1. **XP Tracking**
   - Award XP for pages read
   - Award XP for time spent reading
   - Award XP for completing books

2. **Freemium Triggers**
   - Show paywall after free preview pages
   - Display "Upgrade to Premium" with benefits
   - Use FOMO psychology ("Unlock 1000+ books")

3. **Progress Visualization**
   - Progress bar with percentage
   - Pages read counter
   - XP earned from this book
   - Words saved counter

4. **Engagement Features**
   - Language toggle animation
   - Dictionary popup with smooth transitions
   - Bookmark animations
   - Highlight color picker

---

## 📊 Success Metrics

### Technical KPIs (Agent 2)
- Lighthouse Performance: > 90
- Page load time: < 2s
- Time to Interactive: < 3s
- Server load: Zero (Vercel free tier)

### SEO KPIs (Agent 1)
- Lighthouse SEO: > 95
- Google ranking: Top 3 for target keywords
- Rich results: Stars visible in search
- Organic traffic: > 20% month-over-month

### Engagement KPIs (Agent 3)
- Reading completion rate: > 60%
- Free-to-premium conversion: > 5%
- Average session duration: > 20 minutes
- Return rate: > 70%

---

## 🔧 Development Guidelines

### Adding a New Book

1. **Upload Content to Storage**
   ```typescript
   // Upload JSON files to Supabase Storage
   await supabase.storage
     .from('book-content')
     .upload(`${bookId}-en.json`, contentEn)
   ```

2. **Create Book Record**
   ```typescript
   await supabase.from('books').insert({
     title, slug, author_id,
     content_json_url_en: `${bookId}-en.json`,
     content_json_url_fa: `${bookId}-fa.json`,
     // ... other fields
   })
   ```

3. **Rebuild Static Pages**
   ```bash
   npm run build  # Regenerates all book pages
   ```

### Testing Checklist

- [ ] Book detail page loads in < 2s
- [ ] SEO metadata is correct
- [ ] JSON-LD schema validates
- [ ] Images have proper dimensions
- [ ] Reader loads dynamically
- [ ] Freemium paywall works
- [ ] Progress tracking saves correctly
- [ ] Language toggle works
- [ ] Dictionary popup appears

---

## 🚨 Common Issues & Solutions

### Issue: Book content not loading

**Cause**: Missing content_json_url_en/fa fields
**Solution**: Upload JSON files to Storage and update book record

### Issue: Slow page load

**Cause**: Images without dimensions causing CLS
**Solution**: Add width/height to all Image components

### Issue: Reader not appearing

**Cause**: Dynamic import failing
**Solution**: Check console for errors, ensure component exports correctly

### Issue: Paywall not showing

**Cause**: Subscription tier check failing
**Solution**: Verify users table has subscription_tier column

---

## 📚 Related Documentation

- [AGENT_EXECUTION_GUIDE.md](../../.kiro/steering/AGENT_EXECUTION_GUIDE.md) - Complete agent system
- [AGENT_1_SEO.md](../../.kiro/steering/AGENT_1_SEO.md) - SEO strategies
- [AGENT_2_PERFORMANCE.md](../../.kiro/steering/AGENT_2_PERFORMANCE.md) - Performance optimizations
- [AGENT_3_PSYCHOLOGY.md](../../.kiro/steering/AGENT_3_PSYCHOLOGY.md) - Gamification strategies
- [bluprint.md](../../.kiro/steering/bluprint.md) - Complete project blueprint

---

**Last Updated**: 2025-10-24  
**Version**: 1.0  
**Status**: ✅ Production Ready (MVP)
