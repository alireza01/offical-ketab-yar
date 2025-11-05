# Ketab-Yar Steering Documentation
## Complete Guide to Project Architecture & Agent System

---

## 📋 Quick Navigation

### 🎯 Start Here
- **[AGENT_EXECUTION_GUIDE.md](./AGENT_EXECUTION_GUIDE.md)** - Complete overview of the 5-agent system and execution protocol

### 📖 Project Vision
- **[product.md](./product.md)** - Product overview, features, and design philosophy (English)
- **[bluprint.md](./bluprint.md)** - Complete project blueprint (Persian/فارسی)
- **[KETAB_YAR_PROJECT_GUIDE.md](./KETAB_YAR_PROJECT_GUIDE.md)** - Comprehensive project guide (English)

### 🤖 Agent Protocols

#### Agent 0: The Code Detective (کارآگاه کد)
**[AGENT_0_INVESTIGATOR.md](./AGENT_0_INVESTIGATOR.md)**
- **Role**: Investigation & Context Analysis
- **Activation**: FIRST - Before any other agent
- **Key Tasks**: Deep code analysis, problem discovery, context gathering
- **Philosophy**: "Code doesn't lie. I believe in code."

#### Agent 1: The Search Dominator (سلطان جستجو)
**[AGENT_1_SEO.md](./AGENT_1_SEO.md)**
- **Role**: SEO & Search Engine Optimization
- **Focus**: Google ranking, Core Web Vitals, structured data
- **Strategy**: Hybrid Architecture (SSG for public, CSR for private)
- **Goal**: Lighthouse SEO > 95, Top 3 Google rankings

#### Agent 2: The Efficiency Engine (موتور بهینگی)
**[AGENT_2_PERFORMANCE.md](./AGENT_2_PERFORMANCE.md)**
- **Role**: Performance & Optimization
- **Focus**: Zero server load, optimal client performance, PWA
- **Strategy**: CSR for app, Storage for content, GPU-only animations
- **Goal**: Lighthouse Performance > 90, < 2s load time

#### Agent 3: The Engagement Alchemist (معمار اعتیاد)
**[AGENT_3_PSYCHOLOGY.md](./AGENT_3_PSYCHOLOGY.md)**
- **Role**: Psychology, UX & Gamification
- **Focus**: User addiction, engagement, "feel" of the app
- **Strategy**: Freemium model, streaks, XP, leagues, FOMO triggers
- **Goal**: 30-day retention > 50%, conversion > 5%

#### Agent 4: The Master Architect (معمار ارشد)
**[AGENT_4_MASTER.md](./AGENT_4_MASTER.md)**
- **Role**: Coordination, Decision Making, Conflict Resolution
- **Focus**: Final decisions, unified action plans, execution
- **Protocol**: 5-phase process (Read → Consult → Synthesize → Plan → Report)
- **Goal**: Balanced solutions that satisfy all agents

---

## 🔄 How The System Works

### The 5-Phase Protocol

```
1. INVESTIGATION (Agent 0)
   └─ Read all files, discover problems, brief other agents

2. SPECIALIST ANALYSIS (Agents 1, 2, 3 in parallel)
   ├─ Agent 1: SEO impact
   ├─ Agent 2: Performance impact
   └─ Agent 3: Psychology impact

3. SYNTHESIS (Agent 4)
   └─ Resolve conflicts, make final decisions

4. IMPLEMENTATION (All Agents)
   └─ Execute action plan, build features

5. SUMMARY REPORT (Agent 4)
   └─ Deliver complete solution to user
```

---

## 🎯 Key Principles

### Architecture
- **Public Pages**: SSG (Static Site Generation) for SEO
- **Private Pages**: CSR (Client-Side Rendering) for performance
- **Content Storage**: Supabase Storage (not database)
- **Offline**: PWA with encrypted IndexedDB

### Performance
- **Server Load**: Zero (Vercel free tier)
- **Animations**: GPU-only (transform/opacity)
- **Code Splitting**: Dynamic imports for heavy components
- **Images**: next/image with proper dimensions

### SEO
- **Meta Tags**: Dynamic per page
- **Structured Data**: JSON-LD for books
- **Core Web Vitals**: LCP < 1.5s, CLS < 0.1
- **Robots.txt**: Block private pages

### Psychology
- **Freemium**: "Duolingo + Spotify" model
- **Gamification**: XP, streaks, leagues, badges
- **Paywall**: FOMO triggers, not punishment
- **Animations**: Every animation has psychological purpose

---

## 📊 Success Metrics

### Technical KPIs
- Lighthouse Performance: > 90
- Lighthouse SEO: > 95
- Page load time: < 2s
- Works on 2GB RAM devices

### Business KPIs
- User engagement: > 40%
- Reading completion: > 60%
- Free-to-premium conversion: > 5%
- 30-day retention: > 50%

### UX KPIs
- Session duration: > 20 minutes
- Pages per session: > 15
- Vocabulary saved: > 50 per user
- Return rate: > 70%

---

## 🚀 MVP Scope

### Phase 1: MVP (Months 1-4)
**Goal**: Launch with core bilingual reading + basic gamification

**Included**:
- ✅ Next.js 15 + Supabase setup
- ✅ Authentication (email)
- ✅ Landing page + book detail pages (SSG)
- ✅ Book reader with language toggle (CSR)
- ✅ XP system + daily streaks
- ✅ Vocabulary list (20 word limit for free)
- ✅ Freemium model (2-3 free books)
- ✅ Simple admin panel

**Excluded** (Phase 2+):
- ❌ Realistic page-turn animation
- ❌ Advanced TipTap editor
- ❌ Full league system
- ❌ AI chat
- ❌ Recommendation engine
- ❌ Comment system
- ❌ Dark mode

---

## 🎨 Design Standards

### Colors
- Primary Gold: `#D4AF37`
- Gold Variant 1: `#C9A961`
- Gold Variant 2: `#B8956A`

### Animations
- Page transitions: 300-500ms cubic-bezier
- Micro-interactions: 150-250ms ease-out
- Page turn (MVP): 250ms Slide/Fade
- XP reward: 300ms popup
- Loading: Skeleton screens (NOT spinners)

### Typography
- English: Inter (next/font/google)
- Persian: Vazirmatn (next/font/local)
- Full RTL support

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15+ (App Router)
- TypeScript 5+
- Tailwind CSS 3+
- shadcn/ui (Radix UI)
- Framer Motion
- Zustand + React Context

### Backend
- Supabase (PostgreSQL + Auth + Storage)
- Vercel (hosting - free tier)
- Next.js API Routes (minimal)

### Tools
- Google Gemini 2.5 Flash (AI)
- TipTap (admin editor)
- TanStack Query (data fetching)
- next-pwa (offline capability)

---

## 📁 File Structure

```
.kiro/steering/
├── README.md                      # This file
├── AGENT_EXECUTION_GUIDE.md       # Main execution protocol
├── AGENT_0_INVESTIGATOR.md        # Code Detective
├── AGENT_1_SEO.md                 # Search Dominator
├── AGENT_2_PERFORMANCE.md         # Efficiency Engine
├── AGENT_3_PSYCHOLOGY.md          # Engagement Alchemist
├── AGENT_4_MASTER.md              # Master Architect
├── product.md                     # Product vision (English)
├── bluprint.md                    # Blueprint (Persian)
└── KETAB_YAR_PROJECT_GUIDE.md     # Project guide (English)
```

---

## 🚨 Common Pitfalls to Avoid

1. ❌ Store book content in PostgreSQL (use Storage)
2. ❌ Use SSR for private pages (use CSR)
3. ❌ Animate with margin/padding (use transform/opacity)
4. ❌ Load all components at once (use dynamic imports)
5. ❌ Ignore Agent 0's investigation phase
6. ❌ Let agents work in isolation
7. ❌ Add features outside MVP scope

---

## 💡 Quick Tips

### For Developers
- Always read Agent 0's investigation first
- Follow the 5-phase protocol strictly
- Balance all agent concerns
- Test on weak devices
- Optimize for free tier

### For Users
- Start with AGENT_EXECUTION_GUIDE.md
- Reference specific agent docs for details
- Trust the protocol - it ensures quality
- MVP first, perfection later

---

## 📞 Need Help?

1. **Understanding the system?** → Read [AGENT_EXECUTION_GUIDE.md](./AGENT_EXECUTION_GUIDE.md)
2. **SEO questions?** → Check [AGENT_1_SEO.md](./AGENT_1_SEO.md)
3. **Performance issues?** → Check [AGENT_2_PERFORMANCE.md](./AGENT_2_PERFORMANCE.md)
4. **UX concerns?** → Check [AGENT_3_PSYCHOLOGY.md](./AGENT_3_PSYCHOLOGY.md)
5. **Conflicts?** → Agent 4 resolves them in [AGENT_4_MASTER.md](./AGENT_4_MASTER.md)

---

## 🎯 Remember

**This is a BALANCED system.** No single agent dominates. The Master Architect (Agent 4) ensures all perspectives are considered and conflicts are resolved intelligently.

**Goal**: Build a premium, fast, SEO-optimized, addictive bilingual reading platform on a FREE server tier.

---

*Last Updated: 2025-10-24*  
*Version: 1.0*  
*Project: Ketab-Yar (کتاب‌یار)*
