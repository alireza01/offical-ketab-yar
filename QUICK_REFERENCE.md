# 🎮 Gamification System - Quick Reference Card

## 🚀 3-Step Setup

```bash
# 1. Run migration
supabase db push

# 2. Add provider (app/layout.tsx)
<GamificationProvider>{children}</GamificationProvider>

# 3. Use anywhere
<GamificationDashboard />
```

---

## 📦 Import Cheat Sheet

```tsx
// Components
import {
  XPDisplay,
  LevelBadge,
  StreakFlame,
  AchievementCard,
  GamificationDashboard,
  GamificationProvider,
  ReadingTracker,
  StreakWarning,
  XPRewardAnimation,
  LevelUpCelebration,
  AchievementUnlockAnimation,
} from '@/components/gamification'

// Hook
import { useGamification } from '@/hooks/use-gamification'
import { useGamificationContext } from '@/components/gamification'

// Types
import type { UserStats, Achievement, AchievementWithProgress } from '@/types/gamification'

// Queries
import { getUserStats, updateUserStats, getAchievements } from '@/lib/supabase/queries/gamification'
```

---

## 🎯 Common Use Cases

### Show XP in Header
```tsx
const { level, xp } = useGamificationContext()
<XPDisplay currentXP={xp} level={level} size="sm" />
```

### Track Reading
```tsx
<ReadingTracker
  bookId={bookId}
  currentPage={currentPage}
  totalPages={totalPages}
  isReading={true}
/>
```

### Manual XP Award
```tsx
const { updateImmediately } = useGamification()
await updateImmediately({ xp_gained: 50 })
```

### Show Achievements
```tsx
const { achievements } = useGamification()
achievements.map(a => <AchievementCard achievement={a} />)
```

---

## 🎨 Component Props

### XPDisplay
```tsx
<XPDisplay
  currentXP={number}
  level={number}
  size="sm" | "md" | "lg"
  showLabel={boolean}
  className={string}
/>
```

### LevelBadge
```tsx
<LevelBadge
  level={number}
  size="sm" | "md" | "lg"
  showLabel={boolean}
  className={string}
/>
```

### StreakFlame
```tsx
<StreakFlame
  days={number}
  isInDanger={boolean}
  className={string}
/>
```

### ReadingTracker
```tsx
<ReadingTracker
  bookId={string}
  currentPage={number}
  totalPages={number}
  isReading={boolean}
/>
```

---

## 🎣 Hook API

```tsx
const {
  // Data
  stats,              // UserStats | null
  achievements,       // AchievementWithProgress[]
  streakInfo,         // StreakInfo | null
  isLoading,          // boolean
  error,              // string | null
  
  // Actions
  trackPageRead,      // (pages: number) => void
  trackReadingTime,   // (minutes: number) => void
  trackBookCompletion,// () => Promise<GamificationResult>
  updateImmediately,  // (update: GamificationUpdate) => Promise<GamificationResult>
  
  // Celebrations
  xpReward,           // number | null
  levelUpData,        // XPGainResult | null
  newAchievements,    // AchievementWithProgress[]
  clearXPReward,      // () => void
  clearLevelUp,       // () => void
  clearNewAchievements,// () => void
  
  // Computed
  level,              // number
  xp,                 // number
  currentStreak,      // number
  longestStreak,      // number
  totalBooksCompleted,// number
  totalPagesRead,     // number
} = useGamification()
```

---

## 💾 Database Tables

### user_stats
```sql
user_id UUID PRIMARY KEY
xp INTEGER DEFAULT 0
level INTEGER DEFAULT 1
current_streak INTEGER DEFAULT 0
longest_streak INTEGER DEFAULT 0
last_read_date DATE
total_books_completed INTEGER DEFAULT 0
total_pages_read INTEGER DEFAULT 0
total_reading_time INTEGER DEFAULT 0
```

### achievements (16 pre-seeded)
```sql
id UUID PRIMARY KEY
name TEXT
description TEXT
icon TEXT
xp_reward INTEGER
requirement_type TEXT -- 'books_completed', 'pages_read', 'streak_days', 'reading_time'
requirement_value INTEGER
tier TEXT -- 'bronze', 'silver', 'gold', 'platinum'
```

### user_achievements
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES auth.users
achievement_id UUID REFERENCES achievements
earned_at TIMESTAMP
```

---

## 🎯 XP Rewards

```typescript
PAGE_READ: 2 XP
MINUTE_READ: 1 XP
BOOK_COMPLETED: 100 XP bonus
CHAPTER_COMPLETED: 20 XP bonus
STREAK_BONUS: 10% per day (max 2x)
RANDOM_BONUS: 0-10%
LEVEL_UP_REWARD: level × 50 XP
```

---

## 🏆 Achievement Types

**Books Completed**: 1, 5, 10, 25 books
**Pages Read**: 100, 500, 1000, 5000 pages
**Streak Days**: 7, 30, 100, 365 days
**Reading Time**: 60, 600, 3000, 6000 minutes

---

## 🎵 Sound Files (Optional)

Place in `public/sounds/`:
- `xp-gain.mp3`
- `level-up.mp3`
- `streak.mp3`
- `achievement.mp3`
- `celebration.mp3`
- `page-turn.mp3`
- `bookmark.mp3`
- `success.mp3`
- `error.mp3`

---

## 🐛 Quick Troubleshooting

**XP not updating?**
→ Wait 5 seconds (debounce), check console

**Animations not showing?**
→ Check if `AnimatePresence` wraps them

**Database errors?**
→ Run migration, check RLS policies

**TypeScript errors?**
→ Restart TS server, check imports

---

## 📚 Documentation

- **Components**: `components/gamification/README.md`
- **Full Guide**: `GAMIFICATION_IMPLEMENTATION_GUIDE.md`
- **Checklist**: `GAMIFICATION_CHECKLIST.md`
- **Examples**: `examples/gamification-integration-example.tsx`
- **Summary**: `GAMIFICATION_COMPLETE_SUMMARY.md`

---

## ✅ Status

**Production Ready** - Zero errors, fully tested, comprehensive docs

---

**Quick Links**:
- Migration: `supabase/migrations/20250106_gamification_system.sql`
- Types: `types/gamification.ts`
- Queries: `lib/supabase/queries/gamification.ts`
- Hook: `hooks/use-gamification.ts`
- Components: `components/gamification/`
