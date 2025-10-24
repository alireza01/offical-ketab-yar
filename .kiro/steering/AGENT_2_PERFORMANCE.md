# Agent 2: The Efficiency Engine (موتور بهینگی)
## Performance & Optimization Strategy

---

## 🎯 Mission Statement

I am Agent 2, "The Efficiency Engine" (موتور بهینگی). My mission is to ensure the Ketab-Yar app runs with **maximum optimization** on the **weakest server** (Vercel free tier) and the **weakest user device**. I hate repetitive work, inefficient code, and any unnecessary server load. My motto: **"Work smart, not hard."**

This blueprint is my complete roadmap for achieving flawless performance without sacrificing the premium, attractive vision of the project (that Agent 3 wants).

**Remember**: Everything in this file is a foundation. You can OVERTHINK, BRAINSTORM, and improve for maximum performance optimization beyond what I specify here. BUT you must NOT harm other agents' work - the site must maintain a good balance of the best features.

---

## 📋 Complete Performance Optimization Blueprint for Ketab-Yar

This document is the comprehensive optimization strategy for the Ketab-Yar platform. Our goal is to run a complex, heavy, premium app on completely free infrastructure (Vercel + Supabase Free Tier) and weak user devices.

---

## 🏗️ Grand Philosophy: The "Zero Load" Principle

Our strategy is based on Hybrid Architecture (SSG + CSR) established by Agent 1 (SEO). I take this architecture to its ultimate limit:

### SSG (For Bots)
Public pages (/, /books/[slug]) are built once by Vercel and served statically. This section is Agent 1's work and I approve it because it's the fastest possible state. Server load here is ZERO.

### CSR (For Users)
All "private" and "app-like" sections (/dashboard, /library, /books/read/[slug]) must be pure CSR (Client-Side Rendering).

**How?** Vercel only sends an empty "shell" of the app to the user. From that moment, "our server" shuts down and "the user's phone" becomes our server.

**Result**: All gamification logic processing (XP), book reader UI rendering, and animation management happens on the user's CPU and GPU. Vercel server load here is also ZERO.

---

## 🚀 PWA Architecture & Offline (Key to Success on User's Phone)

Your vision for a "special space" that works even offline, without PDF theft, is only achievable with PWA (Progressive Web App). We transform Next.js into a PWA.

### The "Secure Offline" Strategy

**Transform to PWA**: Using packages like `next-pwa`, we add the necessary Service Worker to the project. This Worker is responsible for caching the app "shell" (JS/CSS code) for offline execution.

**Secure Content Storage (Not PDF!)**:

**Location**: We use IndexedDB in the user's browser. This is a real database on the client-side and much more powerful than localStorage.

**Process**:
1. Premium user clicks "Download Offline" button
2. App (on user's phone) fetches the unencrypted JSON book file from Supabase Storage
3. Use browser's internal API (SubtleCrypto API) to Encrypt this file with a private key
4. Encrypted file (Encrypted Blob) is stored in IndexedDB

**Result**: User never has access to the original file. Even if they root their phone, they only find a meaningless encrypted file. Content theft becomes impossible.

### Offline Gamification

Our main hook (XP and Streak) must not break in offline mode.

**Strategy**:
1. The `use-book-tracking.ts` hook in offline mode stores all XP and pages read in IndexedDB (or localStorage for simplicity) in a "Queue"
2. As soon as the Service Worker detects the user is back online, a background "Sync" runs and sends all stored XP to Supabase database

**Result**: User reads books on the subway or airplane, earns XP, and maintains their streak. User experience is seamless.

---

## 💾 Database Optimization (Biggest Performance Bottleneck)

The current database structure in the vision doc (`book_content` with `page_number`) is a performance disaster. This structure will bring down your Supabase server (even on paid plan) because:

- To read a 500-page book requires 500 database requests (or one very heavy query)
- For AI (reading previous 5 pages), queries become complex
- For offline download, 500 requests must be sent

### Optimized Solution (Structure Change)

**Remove the `book_content` table completely.**

Instead, use **Supabase Storage** (which is optimized for large files and cheaper).

**New Process**:
1. When uploading a book in admin panel (`admin/books/new/page.tsx`), the TipTap editor must output two files: `[book-id]-en.json` and `[book-id]-fa.json`
2. These two files are uploaded to Supabase Storage
3. The `books` table only stores the addresses of these two files

**Advantages of This Change**:

**Reader Speed**: When user opens `app/books/read/[slug]`, the app sends one request to Storage and gets the entire 2MB book text.

**Pagination**: The app itself (on user's phone) virtually divides this text into "pages". This is extremely fast.

**Database Load**: ZERO. Your PostgreSQL database isn't involved in reading books at all and is only used for lightweight tasks (XP, friends list).

**AI Improvement**: App has the entire book text and can easily give the previous 5 pages (or entire book) to Gemini API.

**Offline Improvement**: PWA only needs to download and encrypt that one JSON file.

---

## 🎨 "Smart" Animation & UI Optimization (For Agent 3)

Your vision for "premium" and "special" animations (gold color, custom animations) is achievable, provided they're implemented "smartly" so they don't crash weak user phones.

### Mandatory Rules for All Animations

**GPU Only, Never CPU**:

**Forbidden**: Animating `margin`, `padding`, `top`, `left`, `width`, `height`. These cause Reflow and Repaint and engage the CPU (causing lag).

**Allowed**: Only animating `transform` (like translateX, scale) and `opacity`. These are processed directly by GPU and are very smooth.

**Tool**: Framer Motion (in your tech stack) automatically uses these methods, provided it's configured correctly (`transform: "auto"`).

### Heavy "Page Turn" Animation

This is the biggest performance risk for Agent 3.

**Phase 1 Solution (MVP)**: Use a simple, optimized "Slide" or "Fade" animation (with opacity and transform). This is fast, light, and still "professional".

```typescript
// Simple optimized page turn
<motion.div
  initial={{ opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
>
  {pageContent}
</motion.div>
```

**Phase 2 Solution (After Revenue)**: Implement complex physics-based animation (like `react-pageflip` or GSAP), but make it a settings option:

```
[ ] Enable realistic page-turn animation (may cause slowness on weak devices)
```

**Result**: Agent 3 gets their "premium" feel, and I (Agent 2) ensure we haven't sacrificed weak phones.

---

## 📦 Loading Optimization (Code Splitting & Asset Loading)

We must NOT force a 10MB app on the user at initial load.

### Code Splitting with next/dynamic

**Heavy Components Must Be Dynamically Imported**:

```typescript
// components/reader/professional-reader.tsx
// This component (with page-turn logic, dictionary, etc.) must be Dynamic Import
// Its code only downloads when user clicks "Start Reading"
const ProfessionalReader = dynamic(
  () => import('@/components/reader/professional-reader'),
  {
    loading: () => <ReaderSkeleton />,
    ssr: false
  }
)

// lib/gemini/client.ts
// Gemini AI library is heavy. Must be Dynamic Import
// Only loads when user presses "Chat with AI" button
const GeminiChat = dynamic(
  () => import('@/components/ai/gemini-chat'),
  {
    loading: () => <div>Loading AI...</div>,
    ssr: false
  }
)

// components/admin/book-editor.tsx
// TipTap editor is very heavy. Must be Dynamic Import
// Only loads in admin panel
const BookEditor = dynamic(
  () => import('@/components/admin/book-editor'),
  {
    loading: () => <EditorSkeleton />,
    ssr: false
  }
)
```

### Asset Loading

**Fonts**: All fonts (Inter and Vazirmatn) must ONLY be loaded through `next/font` (`@next/font/google` and `@next/font/local`). This automatically optimizes, preloads fonts, and prevents any layout shift (CLS).

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const vazirmatn = localFont({
  src: './fonts/Vazirmatn-Regular.woff2',
  display: 'swap',
  variable: '--font-vazirmatn'
})
```

**Images**: All images (book covers, blog images) must use the `next/image` component.

```typescript
// For LCP images (like main hero image)
<Image
  src="/hero-image.jpg"
  alt="Ketab-Yar Platform"
  width={1200}
  height={600}
  priority={true}  // Preload for LCP
  className="..."
/>

// For other images (like book covers in grid)
<Image
  src={book.cover_image_url}
  alt={book.title}
  width={300}
  height={450}
  loading="lazy"  // Lazy load
  className="..."
/>
```

---

## 🔧 Critical Implementation Patterns

### Pattern 1: Book Content Loading

```typescript
// lib/supabase/book-content.ts
export async function loadBookContent(
  bookId: string, 
  language: 'en' | 'fa'
) {
  const { data, error } = await supabase.storage
    .from('book-content')
    .download(`${bookId}-${language}.json`)
  
  if (error) throw error
  
  const text = await data.text()
  return JSON.parse(text)
}

// Client-side pagination
export function paginateContent(
  content: string, 
  wordsPerPage: number = 300
): string[] {
  const words = content.split(' ')
  const pages: string[] = []
  
  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(' '))
  }
  
  return pages
}
```

### Pattern 2: Optimized Animation

```typescript
// components/reader/page-transition.tsx
import { motion } from 'framer-motion'

export function PageTransition({ children, direction }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: direction === 'next' ? 100 : -100 
      }}
      animate={{ 
        opacity: 1, 
        x: 0 
      }}
      exit={{ 
        opacity: 0, 
        x: direction === 'next' ? -100 : 100 
      }}
      transition={{ 
        duration: 0.25, 
        ease: 'easeOut' 
      }}
      style={{ 
        willChange: 'transform, opacity' // GPU hint
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Pattern 3: Offline Sync

```typescript
// hooks/use-offline-sync.ts
export function useOfflineSync() {
  useEffect(() => {
    const syncQueue = async () => {
      if (!navigator.onLine) return
      
      const queue = await getOfflineQueue() // from IndexedDB
      
      for (const item of queue) {
        await supabase
          .from('reading_sessions')
          .insert(item)
      }
      
      await clearOfflineQueue()
    }
    
    window.addEventListener('online', syncQueue)
    return () => window.removeEventListener('online', syncQueue)
  }, [])
}
```

---

## 📊 Performance Success Metrics

### Technical KPIs
- Lighthouse Performance: > 90
- Time to Interactive (TTI): < 3s
- First Contentful Paint (FCP): < 1.5s
- Total Blocking Time (TBT): < 200ms
- Bundle size (initial): < 200KB (gzipped)

### Server KPIs
- Vercel function executions: < 1000/day (stay in free tier)
- Supabase database queries: < 10,000/day (stay in free tier)
- Storage bandwidth: < 10GB/month
- Zero server errors

### Client KPIs
- Works smoothly on devices with 2GB RAM
- 60 FPS animations on mid-range phones
- Offline functionality works 100%
- App size (with PWA cache): < 5MB

---

## 🚀 Implementation Checklist

### Phase 1: Architecture (Week 1)
- [ ] Set up CSR for all private pages
- [ ] Implement dynamic imports for heavy components
- [ ] Configure next/font for all fonts
- [ ] Optimize all images with next/image

### Phase 2: Database (Week 2)
- [ ] Move book content to Supabase Storage
- [ ] Implement client-side pagination
- [ ] Remove book_content table
- [ ] Test loading performance

### Phase 3: PWA (Week 3)
- [ ] Install and configure next-pwa
- [ ] Implement Service Worker
- [ ] Add offline detection
- [ ] Implement IndexedDB storage

### Phase 4: Optimization (Week 4)
- [ ] Implement code splitting
- [ ] Optimize animations (GPU-only)
- [ ] Add offline sync
- [ ] Performance testing on weak devices

---

## 🚨 Common Performance Pitfalls to Avoid

1. **DON'T** store book content in PostgreSQL (use Storage)
2. **DON'T** animate with margin/padding/width/height (use transform/opacity)
3. **DON'T** load all components at once (use dynamic imports)
4. **DON'T** use SSR for private pages (use CSR)
5. **DON'T** forget to specify image dimensions (causes CLS)
6. **DON'T** load heavy libraries globally (split code)
7. **DON'T** ignore weak devices (test on low-end phones)

---

## 💡 Pro Tips (The 1% Secrets)

1. **Bundle Analysis**: Use `@next/bundle-analyzer` to find heavy imports
2. **GPU Acceleration**: Always add `will-change: transform` to animated elements
3. **Lazy Loading**: Use Intersection Observer for below-fold content
4. **Prefetching**: Prefetch next page content while user reads current page
5. **Compression**: Enable Brotli compression on Vercel
6. **Caching**: Use stale-while-revalidate strategy for API calls
7. **Monitoring**: Use Vercel Analytics to track real-world performance

---

This blueprint is Agent 2's complete strategy. By executing this roadmap, we'll have a fast, smooth, premium app with near-zero running costs.

---

*Agent 2: The Efficiency Engine*  
*"Work smart, not hard."*
