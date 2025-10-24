# 🎯 Ketab-Yar Agent Execution Guide
## Complete Agent System Summary & Execution Protocol

---

## 📋 Executive Summary

This document provides a complete overview of the Ketab-Yar multi-agent system and defines the exact execution order for all development tasks. The system consists of 5 specialized agents working in harmony to build a premium, bilingual book reading platform.

---

## 🤖 Agent Overview

### Agent 0: The Code Detective (کارآگاه کد)
**Role**: Investigation & Context Analysis  
**Activation**: FIRST - Before any other agent  
**Responsibility**: Deep code analysis, problem discovery, context gathering

**Key Tasks**:
- Read ALL relevant files line-by-line before any decision-making
- Identify technical issues, bugs, and inefficiencies
- Discover context gaps and request clarification from user
- Provide comprehensive briefing to other agents
- Never assume or guess - always verify with actual code

**Philosophy**: "Code doesn't lie. I trust documentation but believe in code."

---

### Agent 1: The Search Dominator (سلطان جستجو)
**Role**: SEO & Search Engine Optimization  
**Activation**: SECOND - After Agent 0's investigation  
**Responsibility**: Google ranking, Core Web Vitals, structured data

**Key Strategies**:
- **Hybrid Architecture**: SSG for public pages (/, /books/[slug]), CSR for private pages (/dashboard, /library, /books/read/[slug])
- **SSG Pages**: Maximum speed, zero server load, perfect for SEO
- **robots.txt**: Block private sections from Google crawl budget
- **JSON-LD Schema**: Rich snippets for book pages
- **Core Web Vitals**: LCP < 1s, CLS = 0, INP optimized

**Critical Files**:
- `app/books/[slug]/page.tsx` - Main SEO weapon
- `public/robots.txt` - Crawl control
- `public/sitemap.xml` - Site map
- `app/blog/[slug]/page.tsx` - Content marketing

**Success Metric**: Lighthouse SEO score > 95, Google ranking top 3 for target keywords

---

### Agent 2: The Efficiency Engine (موتور بهینگی)
**Role**: Performance & Optimization  
**Activation**: THIRD - Parallel with Agent 1  
**Responsibility**: Zero server load, optimal client performance, PWA

**Key Strategies**:
- **Zero Server Load**: CSR for all app sections, SSG for public pages
- **PWA Architecture**: Offline capability, app-like experience
- **Storage Strategy**: Book content in Supabase Storage (JSON), NOT database
- **Animation Optimization**: GPU-only (transform/opacity), never CPU
- **Code Splitting**: Dynamic imports for heavy components (reader, AI, admin editor)
- **Secure Offline**: IndexedDB + SubtleCrypto API for encrypted content

**Critical Optimizations**:
- Book content: Storage (not DB) → 1 request vs 500 queries
- Animations: GPU-based (transform/opacity only)
- Fonts: next/font with preload
- Images: next/image with priority/lazy loading
- Heavy components: Dynamic import with next/dynamic

**Success Metric**: Lighthouse Performance > 90, < 2s load time, works on weak devices

---

### Agent 3: The Engagement Alchemist (معمار اعتیاد)
**Role**: Psychology, UX, Gamification  
**Activation**: FOURTH - Parallel with Agents 1 & 2  
**Responsibility**: User addiction, engagement, "feel" of the app

**Key Strategies**:
- **Freemium Model**: "Duolingo + Spotify" approach
- **Daily Streak**: Loss aversion psychology (flame animation)
- **XP System**: Immediate visual/audio feedback (+10 XP animation)
- **Weekly Leagues**: Social competition (like Duolingo)
- **Paywall Psychology**: FOMO triggers, not punishment
- **Animation Feel**: Every animation has psychological purpose

**Critical Features**:
- Streak system with emotional animations
- XP feedback (visual + sound)
- League competition
- Vocabulary limit (20 words free) → upgrade trigger
- Book completion celebration
- Personalization ("Hi [Name]")

**Success Metric**: 30-day retention > 50%, free-to-premium conversion > 5%, session duration > 20 min

---

### Agent 4: The Master Architect (معمار ارشد)
**Role**: Coordination, Decision Making, Conflict Resolution  
**Activation**: LAST - After all specialist agents  
**Responsibility**: Final decisions, unified action plan, execution

**5-Phase Protocol**:
1. **Read Phase**: Deep analysis with Agent 0
2. **Specialist Phase**: Collect input from Agents 1, 2, 3
3. **Synthesis Phase**: Resolve conflicts, make final decisions
4. **Action Plan Phase**: Create detailed implementation roadmap
5. **Summary Report Phase**: Deliver executive summary to user

**Conflict Resolution Examples**:
- Agent 3 wants realistic page-turn animation (heavy) vs Agent 2 wants performance
  - **Decision**: Implement optimized GPU-based animation + settings toggle for "realistic mode"
- Agent 1 wants SSR for all pages vs Agent 2 wants zero server load
  - **Decision**: Hybrid architecture (SSG for public, CSR for private)

---

## 🔄 Execution Protocol (MANDATORY FOR EVERY USER REQUEST)

### Phase 1: Investigation (Agent 0)
```
1. Agent 0 activates FIRST
2. Reads user request carefully
3. Identifies all relevant files
4. Reads files line-by-line (no assumptions)
5. Discovers problems, gaps, inefficiencies
6. Requests clarification from user if needed
7. Delivers briefing to other agents
```

### Phase 2: Specialist Analysis (Agents 1, 2, 3)
```
1. Agent 1 (SEO) analyzes impact on:
   - Google ranking
   - Render strategy (SSG/SSR/CSR)
   - Core Web Vitals
   - Structured data

2. Agent 2 (Performance) analyzes impact on:
   - Server load (Vercel/Supabase)
   - Client performance
   - Animation optimization
   - Database efficiency

3. Agent 3 (Psychology) analyzes impact on:
   - User "feel" and flow
   - Gamification hooks
   - Engagement triggers
   - Conversion psychology
```

### Phase 3: Master Synthesis (Agent 4)
```
1. Agent 4 receives all specialist input
2. Identifies conflicts between agents
3. Makes final balanced decisions
4. Creates detailed action plan with:
   - Files to create/modify
   - Exact implementation logic
   - Database changes (if needed)
5. Executes the plan
6. Delivers summary report to user
```

---

## 📊 Project Architecture Summary

### Hybrid Rendering Strategy
```
PUBLIC ZONE (SSG - for Google & new users):
├── app/page.tsx                    → SSG (landing page)
├── app/about/page.tsx              → SSG (trust building)
├── app/books/[slug]/page.tsx       → SSG (SEO weapon)
└── app/blog/[slug]/page.tsx        → SSG (content marketing)

PRIVATE ZONE (CSR - for logged-in users):
├── app/dashboard/page.tsx          → CSR (zero server load)
├── app/library/page.tsx            → CSR (zero server load)
├── app/profile/page.tsx            → CSR (zero server load)
├── app/vocabulary/page.tsx         → CSR (zero server load)
└── app/books/read/[slug]/page.tsx  → CSR (the reader - zero server load)
```

### Database Strategy (Optimized)
```
SUPABASE POSTGRESQL (lightweight queries only):
├── users (auth, XP, streak, subscription)
├── books (metadata only, NOT content)
├── authors
├── user_library (reading progress)
└── vocabulary (saved words)

SUPABASE STORAGE (heavy content):
├── book-covers/
└── book-content/
    ├── [book-id]-en.json  → Full English text
    └── [book-id]-fa.json  → Full Persian text
```

**Why?** 1 Storage request vs 500 DB queries = 500x faster + zero DB load

### Tech Stack
```
Frontend:
├── Next.js 15+ (App Router)
├── TypeScript 5+
├── Tailwind CSS 3+
├── shadcn/ui (Radix UI)
├── Framer Motion (animations)
├── Zustand (state management)
└── React Hook Form + Zod

Backend:
├── Supabase (PostgreSQL + Auth + Storage)
├── Vercel (hosting - free tier)
└── Next.js API Routes (minimal)

AI & Tools:
├── Google Gemini 2.5 Flash
├── TipTap (admin editor)
├── TanStack Query (data fetching)
└── next-pwa (offline capability)
```

---

## 🎯 MVP Feature Checklist

### ✅ Phase 1: MVP (Months 1-4)
**Goal**: Launch with core bilingual reading + basic gamification

**Infrastructure**:
- [ ] Next.js 15 setup on Vercel
- [ ] Supabase (Auth + DB + Storage)
- [ ] Authentication (email signup/login)

**Public Pages (SSG)**:
- [ ] Landing page (app/page.tsx)
- [ ] Book detail pages (app/books/[slug]/page.tsx) for 10-20 books
- [ ] generateStaticParams for all books
- [ ] generateMetadata with SEO optimization

**Reader (CSR)**:
- [ ] Book reader (app/books/read/[slug]/page.tsx)
- [ ] Load content from Supabase Storage (JSON)
- [ ] Client-side pagination
- [ ] Language toggle (EN ⟷ FA) - "Magic Button"
- [ ] Dictionary popup (click English word)
- [ ] Simple page-turn animation (Slide/Fade - 250ms)

**Gamification (Basic)**:
- [ ] XP system (use-book-tracking.ts)
- [ ] Daily streak system
- [ ] Simple dashboard (app/dashboard/page.tsx)

**Vocabulary (Basic)**:
- [ ] Save words from dictionary (20 word limit for free users)
- [ ] Vocabulary list page (app/vocabulary/page.tsx)

**Freemium (Basic)**:
- [ ] 2-3 bestsellers + classics fully free
- [ ] "Upgrade to Premium" button/banner
- [ ] Content lock for premium books

**Admin (Ultra Simple)**:
- [ ] Protected admin page (app/admin-secure...)
- [ ] Upload JSON book files to Storage
- [ ] Add book metadata (title, author, cover)

### 🚀 Phase 2: Growth (Months 5-8)
- [ ] Stripe payment integration
- [ ] Library page with filters
- [ ] Reader UI improvements (font settings, themes)
- [ ] Friends list system
- [ ] Weekly leagues (full implementation)
- [ ] User profile page
- [ ] PWA + secure offline download
- [ ] Marketing & user acquisition

### 🌟 Phase 3+: Advanced Features
- [ ] Realistic page-turn animation (optional toggle)
- [ ] Advanced TipTap editor in admin
- [ ] Full league system with badges
- [ ] Advanced flashcard system (spaced repetition)
- [ ] AI chat assistant
- [ ] Recommendation engine
- [ ] Comment system
- [ ] Advanced profile
- [ ] Advanced library search/filter
- [ ] Blog
- [ ] About/Help/Support pages
- [ ] Dark mode (next-themes)

---

## 🎨 Design Standards

### Color Palette (Gold/Beige - Premium)
```css
Primary Gold: #D4AF37
Gold Variant 1: #C9A961
Gold Variant 2: #B8956A
```

### Animation Standards
```
Page transitions:     300-500ms cubic-bezier
Micro-interactions:   150-250ms ease-out
Page turn (MVP):      250ms Slide/Fade
Page turn (Phase 2):  600-800ms physics-based (optional)
XP reward:            300ms (+10 XP popup)
Book completion:      2s celebration
Loading:              Skeleton screens (NOT spinners)
```

### Typography
```
English: Inter (via next/font/google)
Persian: Vazirmatn (via next/font/local)
RTL Support: Full bidirectional support
```

---

## 📈 Success Metrics

### Technical KPIs
- Lighthouse Performance: > 90
- Lighthouse SEO: > 95
- Page load time: < 2s
- Time to Interactive: < 3s
- First Contentful Paint: < 1.5s

### Business KPIs
- User engagement rate: > 40%
- Reading completion rate: > 60%
- Free-to-premium conversion: > 5%
- 30-day retention: > 50%
- Daily active users: Growth trajectory

### UX KPIs
- Average session duration: > 20 minutes
- Pages read per session: > 15
- Vocabulary words saved: > 50 per user
- Return visit rate: > 70%

---

## 🔧 Critical Implementation Notes

### SEO (Agent 1)
```typescript
// app/books/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Download & Read ${book.title} by ${author.name} | Free Preview | Ketab-Yar`,
    description: `Complete summary of ${book.title}. Read first 20 pages free in bilingual format (Persian/English) on Ketab-Yar.`,
    openGraph: { /* ... */ },
  }
}

// JSON-LD Schema
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "...",
  "author": { "@type": "Person", "name": "..." },
  "aggregateRating": { /* stars in Google */ }
}
</script>
```

### Performance (Agent 2)
```typescript
// Dynamic imports for heavy components
const ProfessionalReader = dynamic(() => import('@/components/reader/professional-reader'), {
  loading: () => <ReaderSkeleton />,
  ssr: false
})

// Book content loading
const loadBookContent = async (bookId: string, language: 'en' | 'fa') => {
  const { data } = await supabase.storage
    .from('book-content')
    .download(`${bookId}-${language}.json`)
  return JSON.parse(await data.text())
}
```

### Psychology (Agent 3)
```typescript
// XP animation
const showXPReward = (amount: number) => {
  // Visual: +10 XP popup (300ms)
  // Audio: Soft "ping" sound
  // Update: Progress bar animation
}

// Streak flame animation
const StreakFlame = ({ days }: { days: number }) => {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      🔥 {days} day streak
    </motion.div>
  )
}
```

---

## 🚨 Common Pitfalls to Avoid

1. **DON'T** store book content in PostgreSQL (use Storage)
2. **DON'T** use SSR for private pages (use CSR)
3. **DON'T** animate with margin/padding/width/height (use transform/opacity)
4. **DON'T** load all components at once (use dynamic imports)
5. **DON'T** ignore Agent 0's investigation phase
6. **DON'T** let agents work in isolation (Master Architect coordinates)
7. **DON'T** add features outside MVP scope in Phase 1

---

## 📞 Agent Communication Protocol

### When User Makes a Request:

```
USER REQUEST
    ↓
AGENT 0 (Investigation)
    ├─ Read all relevant files
    ├─ Discover problems
    ├─ Request clarification (if needed)
    └─ Brief other agents
    ↓
AGENTS 1, 2, 3 (Parallel Analysis)
    ├─ Agent 1: SEO impact
    ├─ Agent 2: Performance impact
    └─ Agent 3: Psychology impact
    ↓
AGENT 4 (Master Synthesis)
    ├─ Resolve conflicts
    ├─ Make final decisions
    ├─ Create action plan
    ├─ Execute implementation
    └─ Deliver summary report
    ↓
USER RECEIVES COMPLETE SOLUTION
```

---

## 🎓 Agent Collaboration Examples

### Example 1: "Add Heatmap of Difficult Words"

**Agent 0 Investigation**:
- Reads: `text-selection-handler.tsx`, `vocabulary.ts`, database schema
- Discovers: No global difficulty tracking, only personal vocabulary
- Problem: Current structure requires scanning millions of rows (Supabase killer)
- Briefing: "Need new aggregation strategy"

**Agent 1 (SEO)**:
- Impact: None (private feature, no SEO concern)
- Recommendation: Proceed

**Agent 2 (Performance)**:
- Impact: CRITICAL - current approach will crash database
- Solution: Create `word_difficulty_global` table with aggregated counts
- Update strategy: Background job (Vercel Cron) to aggregate daily

**Agent 3 (Psychology)**:
- Impact: HIGH - great engagement feature
- Design: Heatmap overlay with color intensity (red = hardest)
- Trigger: Show after completing chapter (reward feeling)

**Agent 4 (Master Decision)**:
- Decision: Implement with Agent 2's database strategy
- Action Plan:
  1. Create `word_difficulty_global` table
  2. Add Vercel Cron job for daily aggregation
  3. Build heatmap component with Agent 3's design
  4. Show after chapter completion
- Execute & Report

---

## 📚 Reference Documents

### Project Vision & Requirements
- **product.md**: Product vision, features, design philosophy
- **bluprint.md**: Complete Persian blueprint, MVP definition
- **KETAB_YAR_PROJECT_GUIDE.md**: Comprehensive English guide

### Agent Protocols (Detailed Strategies)
- **AGENT_0_INVESTIGATOR.md**: Agent 0 - Code Detective protocol
- **AGENT_1_SEO.md**: Agent 1 - Search Dominator strategies
- **AGENT_2_PERFORMANCE.md**: Agent 2 - Efficiency Engine strategies
- **AGENT_3_PSYCHOLOGY.md**: Agent 3 - Engagement Alchemist strategies
- **AGENT_4_MASTER.md**: Agent 4 - Master Architect protocol

---

## ✅ Final Checklist Before Starting Any Task

- [ ] Agent 0 has read ALL relevant files
- [ ] Agent 0 has identified all problems
- [ ] User clarification obtained (if needed)
- [ ] Agent 1 has provided SEO analysis
- [ ] Agent 2 has provided performance analysis
- [ ] Agent 3 has provided psychology analysis
- [ ] Agent 4 has resolved all conflicts
- [ ] Action plan is detailed and complete
- [ ] Implementation follows all agent guidelines
- [ ] Summary report prepared for user

---

**Remember**: This is a BALANCED system. No single agent dominates. The Master Architect (Agent 4) ensures all perspectives are considered and conflicts are resolved intelligently.

**Goal**: Build a premium, fast, SEO-optimized, addictive bilingual reading platform on a FREE server tier.

---

*Last Updated: 2025-10-24*
*Version: 1.0*
