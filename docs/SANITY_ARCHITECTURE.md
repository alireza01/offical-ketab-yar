# 🏗️ Sanity CMS Architecture
## Visual Guide to System Design

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Next.js App │  │  IndexedDB   │  │ Service      │          │
│  │  (React)     │  │  (Offline)   │  │ Worker (PWA) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
         │                    │                    │
         ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                      CONTENT LAYER (Sanity)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Sanity CDN (Global)                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │   Books    │  │  Authors   │  │ Blog Posts │         │  │
│  │  │  Content   │  │    Bios    │  │  Content   │         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↑                                  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Sanity Studio (Admin Panel)                  │  │
│  │  - Content Management                                     │  │
│  │  - Draft/Publish Workflow                                 │  │
│  │  - Real-time Collaboration                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
         │                    │                    │
         ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                    USER DATA LAYER (Supabase)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Profiles   │  │   Progress   │  │  Vocabulary  │          │
│  │    (Auth)    │  │  (Reading)   │  │   (Words)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Bookmarks   │  │  Highlights  │  │   Reviews    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │      XP      │  │   Streaks    │  │   Leagues    │          │
│  │ (Gamification)│  │(Gamification)│  │(Gamification)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Book Reading Flow

```
User Opens Book
      ↓
Next.js SSG Page (Pre-built)
      ↓
Fetch Book Content from Sanity CDN
      ↓
Cache in Browser Memory
      ↓
Client-Side Pagination
      ↓
Display to User
      ↓
Track Progress in Supabase
```

### 2. Content Publishing Flow

```
Admin Creates Book in Sanity Studio
      ↓
Save as Draft
      ↓
Preview & Edit
      ↓
Publish
      ↓
Sanity CDN Updates (Instant)
      ↓
Next.js Revalidates (1 hour)
      ↓
New Static Page Generated
      ↓
Available to Users
```

### 3. Offline Reading Flow

```
User Downloads Book
      ↓
Fetch from Sanity CDN
      ↓
Encrypt with SubtleCrypto
      ↓
Store in IndexedDB
      ↓
User Goes Offline
      ↓
Service Worker Intercepts Request
      ↓
Load from IndexedDB
      ↓
Decrypt & Display
      ↓
Track Progress Locally
      ↓
User Goes Online
      ↓
Sync Progress to Supabase
```

---

## 🎯 Component Architecture

### Next.js App Structure

```
app/
├── (public) - SSG Pages
│   ├── page.tsx                    # Landing (SSG)
│   ├── about/page.tsx              # About (SSG)
│   └── books/[slug]/page.tsx       # Book Detail (SSG)
│       ↓
│       Fetches from: Sanity CDN
│       Generates: Static HTML at build time
│       Revalidates: Every 1 hour
│
└── (private) - CSR Pages
    ├── dashboard/page.tsx          # Dashboard (CSR)
    ├── library/page.tsx            # Library (CSR)
    └── books/read/[slug]/page.tsx  # Reader (CSR)
        ↓
        Fetches from: Sanity CDN (client-side)
        Stores in: IndexedDB (offline)
        Tracks in: Supabase (progress)
```

### Sanity Studio Structure

```
studio/
├── schemas/
│   ├── Objects (Reusable)
│   │   ├── bilingualText.ts
│   │   ├── bilingualPortableText.ts
│   │   ├── bilingualParagraph.ts
│   │   └── chapter.ts
│   │
│   └── Documents (Top-level)
│       ├── author.ts
│       ├── book.ts
│       └── blogPost.ts
│
└── sanity.config.ts
    ↓
    Defines: Content structure
    Provides: Admin UI
    Enables: Draft/Publish workflow
```

---

## 📦 Data Models

### Book Document (Sanity)

```typescript
{
  _id: "book-123",
  _type: "book",
  title: {
    en: "The Great Gatsby",
    fa: "گتسبی بزرگ"
  },
  slug: { current: "the-great-gatsby" },
  coverImage: { asset: { _ref: "image-abc" } },
  author: { _ref: "author-456" },
  chapters: [
    {
      title: { en: "Chapter 1", fa: "فصل ۱" },
      chapterNumber: 1,
      content: [
        {
          _type: "bilingualParagraph",
          english: [/* Portable Text */],
          farsi: [/* Portable Text */]
        }
      ]
    }
  ],
  publishYear: 1925,
  genres: ["classic", "fiction"],
  level: "intermediate",
  freePreviewPages: 20,
  isPremium: false,
  featured: true
}
```

### User Progress (Supabase)

```typescript
{
  id: "uuid",
  user_id: "user-uuid",
  book_id: "book-123", // References Sanity book
  current_page: 45,
  progress_percentage: 25,
  last_read_at: "2025-01-24T10:30:00Z",
  started_at: "2025-01-20T08:00:00Z",
  completed_at: null
}
```

---

## 🔐 Security Architecture

### Content Security

```
Sanity CMS
    ↓
Public API (Read-only)
    ↓
Sanity CDN (Cached)
    ↓
Next.js (Public pages)
    ↓
User Browser

Admin Access:
    ↓
Sanity Studio (Token-protected)
    ↓
Sanity API (Write access)
    ↓
Content Database
```

### User Data Security

```
User Browser
    ↓
Next.js API Routes
    ↓
Supabase Client (RLS enabled)
    ↓
PostgreSQL (Row-level security)
    ↓
User's own data only
```

### Offline Content Security

```
Book Content (Sanity)
    ↓
Download to Browser
    ↓
Encrypt with SubtleCrypto API
    ↓
Store in IndexedDB (Encrypted)
    ↓
User cannot extract original
```

---

## ⚡ Performance Architecture

### Content Delivery

```
Request: /books/the-great-gatsby
    ↓
Vercel Edge Network (Closest location)
    ↓
Static HTML (Pre-built)
    ↓
Sanity CDN (Images, assets)
    ↓
User Browser (< 1s load time)
```

### Database Load

```
Before (Database-based):
500-page book = 500 DB queries
    ↓
Heavy database load
    ↓
Slow response time
    ↓
Expensive scaling

After (Sanity-based):
500-page book = 1 API call
    ↓
Zero database load
    ↓
CDN-powered delivery
    ↓
Free tier sufficient
```

---

## 🌍 Global Architecture

### CDN Distribution

```
User in Iran
    ↓
Sanity CDN (Middle East node)
    ↓
< 100ms latency

User in USA
    ↓
Sanity CDN (US node)
    ↓
< 50ms latency

User in Europe
    ↓
Sanity CDN (EU node)
    ↓
< 80ms latency
```

### Vercel Edge Network

```
Next.js Static Pages
    ↓
Deployed to Vercel
    ↓
Distributed to Edge Locations
    ↓
Served from nearest location
    ↓
< 100ms response time globally
```

---

## 🔄 Sync Architecture

### Real-time Updates

```
Admin Publishes Book
    ↓
Sanity Webhook (Optional)
    ↓
Next.js Revalidation API
    ↓
Rebuild Static Page
    ↓
Deploy to Edge
    ↓
Available to Users (< 1 minute)
```

### Offline Sync

```
User Reads Offline
    ↓
Progress Stored in IndexedDB
    ↓
User Goes Online
    ↓
Service Worker Detects Connection
    ↓
Background Sync API
    ↓
Upload Progress to Supabase
    ↓
Clear Local Queue
```

---

## 📊 Scalability Architecture

### Content Scaling

```
Current: 100 books
    ↓
Sanity: 10,000 document limit
    ↓
Can scale to: 1,000+ books
    ↓
Cost: $0 (free tier)

Future: 10,000+ books
    ↓
Upgrade to: Sanity Growth plan
    ↓
Cost: $99/month
```

### User Scaling

```
Current: 100 users
    ↓
Supabase: 500MB database
    ↓
Can scale to: 10,000+ users
    ↓
Cost: $0 (free tier)

Future: 100,000+ users
    ↓
Upgrade to: Supabase Pro
    ↓
Cost: $25/month
```

---

## 🎯 Agent Compliance Matrix

| Aspect | Agent 1 (SEO) | Agent 2 (Performance) | Agent 3 (Psychology) |
|--------|---------------|----------------------|---------------------|
| **Content Delivery** | ✅ SSG | ✅ CDN | ✅ Fast |
| **Admin Experience** | N/A | N/A | ✅ Premium |
| **Database Load** | N/A | ✅ Zero | N/A |
| **Image Optimization** | ✅ Auto | ✅ CDN | ✅ Fast |
| **Offline Support** | N/A | ✅ PWA | ✅ Seamless |
| **Structured Data** | ✅ Easy | N/A | N/A |
| **User Experience** | ✅ Fast | ✅ Smooth | ✅ Premium |

**Overall:** ✅ All agents approve

---

## 📈 Cost Architecture

### Free Tier Breakdown

```
Sanity (Free):
├── 3 users
├── 10,000 documents (1000+ books)
├── 5GB assets
├── 100GB CDN bandwidth/month
└── Unlimited API requests

Supabase (Free):
├── 500MB database (lighter now)
├── 1GB file storage (not needed)
├── 2GB bandwidth
└── 50,000 monthly active users

Vercel (Free):
├── 100GB bandwidth
├── Unlimited static pages
├── 100 serverless function executions/day
└── Automatic SSL

Total Cost: $0/month
```

---

**This architecture is designed to scale from MVP to 10,000+ users while staying on free tiers.**

**Questions?** Check `docs/SANITY_CMS_INTEGRATION.md` for implementation details.
