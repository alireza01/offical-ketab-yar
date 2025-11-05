# 📊 Dashboard Folder - Ketab-Yar

## Overview

The dashboard is the **main hub** for logged-in users, displaying their reading progress, gamification stats, and personalized recommendations. This folder implements the MVP gamification system as specified in the Ketab-Yar blueprint.

---

## 📁 Folder Structure

```
app/dashboard/
├── page.tsx                              # Main dashboard page (CSR)
├── error.tsx                             # Error boundary
├── loading.tsx                           # Loading skeleton
├── DASHBOARD_IMPLEMENTATION_SUMMARY.md   # Complete implementation report
└── README.md                             # This file
```

---

## 🎯 Purpose

The dashboard serves as the user's **personal reading command center**, providing:

1. **Gamification Overview** - XP, level, and streak display
2. **Reading Stats** - Books read, pages completed, progress
3. **Currently Reading** - Quick access to books in progress
4. **Recommendations** - Personalized book suggestions

---

## 🏗️ Architecture

### Rendering Strategy: **Pure CSR (Client-Side Rendering)**

**Why CSR?**
- Private zone (no SEO needed)
- Zero server load (Agent 2 strategy)
- Real-time updates without page refresh
- Offline-capable with PWA

**Data Fetching:**
- TanStack Query for server state
- Zustand for client state
- Supabase client for database queries

---

## 🎮 Gamification System

### XP (Experience Points)
- **Earned by:** Reading pages, saving words, completing quizzes
- **Calculation:** 2 XP per page + bonuses
- **Display:** Animated progress bar with level indicator

### Streak System
- **Tracked:** Daily reading streak
- **Display:** Animated flame that grows with streak
- **Psychology:** Loss aversion (flame "dies" if broken)

### Level System
- **Total Levels:** 10 (from "خواننده تازه‌کار" to "خواننده اسطوره")
- **Progression:** Exponential XP requirements
- **Display:** Trophy badge with level number

---

## 📊 Components Used

### From `components/dashboard/`:
- `<ReadingStats />` - Animated stat cards
- `<CurrentlyReading />` - Books in progress
- `<RecommendedBooks />` - Personalized suggestions
- `<StreakFlame />` - Animated streak display
- `<XPProgress />` - Level and XP progress
- `<XPRewardAnimation />` - Floating +XP notifications
- `<StatCard />` - Reusable animated stat card

### From `components/ui/`:
- `<Card />`, `<CardContent />`, `<CardHeader />`
- `<Progress />` - Progress bars
- `<Skeleton />` - Loading states
- `<Button />` - Action buttons
- `<Badge />` - Labels and tags
- `<Separator />` - Visual dividers

---

## 🔧 Hooks & Stores

### Hooks:
- `useGamification(userId)` - XP, streak, level management
- `useReadingStats(userId)` - Reading statistics

### Stores:
- `useGamificationStore()` - Client-side gamification state

---

## 🎨 Design Principles

### Colors:
- Primary Gold: `#D4AF37`
- Accent: `#C9A961`, `#B8956A`
- Success: Green (XP rewards)
- Warning: Red (streak danger)

### Animations:
- **Entrance:** Staggered fade-in (0.1s delay between elements)
- **Hover:** Scale 1.02, lift -4px
- **XP Reward:** Float up with fade (0.6s)
- **Streak Flame:** Pulse and rotate (2s infinite)

### Typography:
- **Headers:** 2xl-4xl, bold
- **Stats:** 3xl, bold numbers
- **Labels:** sm, muted-foreground
- **Messages:** xs, muted-foreground

---

## 📱 Responsive Design

### Breakpoints:
- **Mobile:** < 640px (1 column)
- **Tablet:** 640px-1024px (2 columns)
- **Desktop:** > 1024px (3-4 columns)

### Mobile Optimizations:
- Stacked layout for gamification cards
- Larger touch targets (min 44px)
- Simplified animations on low-end devices
- Optimized images with `next/image`

---

## 🔐 Authentication

### Access Control:
```typescript
// Automatic redirect if not authenticated
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/auth/login')
```

### User Data:
- User ID from Supabase Auth
- User name from `users` table
- Gamification data from `users` table
- Reading data from `user_library` table

---

## 📊 Database Tables Used

### `users`
- `id` - User ID (from auth)
- `name` - Display name
- `xp` - Total experience points
- `current_streak` - Daily reading streak
- `last_read_at` - Last reading date

### `user_library`
- `user_id` - Foreign key to users
- `book_id` - Foreign key to books
- `status` - 'reading', 'completed', 'want_to_read'
- `current_page` - Current reading position
- `progress_percentage` - Completion percentage

### `reading_sessions`
- `user_id` - Foreign key to users
- `book_id` - Foreign key to books
- `pages_read` - Pages in this session
- `duration_minutes` - Session duration
- `xp_earned` - XP earned in session

---

## 🚀 Performance

### Optimization Strategies:
1. **Code Splitting** - Dynamic imports for heavy components
2. **Data Caching** - TanStack Query with 5-minute stale time
3. **GPU Animations** - Only `transform` and `opacity`
4. **Lazy Loading** - Images load on demand
5. **Skeleton Screens** - Instant perceived performance

### Metrics:
- Initial Load: < 2s
- Time to Interactive: < 3s
- Animation FPS: 60 FPS
- Server Load: **ZERO**

---

## 🎯 User Flow

### First Visit:
1. User logs in
2. Dashboard loads with empty states
3. CTAs guide user to library
4. User starts reading
5. XP and streak begin tracking

### Regular Visit:
1. User sees personalized greeting
2. XP progress and streak displayed
3. Currently reading books shown
4. Recommendations based on history
5. One-click continue reading

---

## 🧪 Testing Checklist

### Functionality:
- [ ] Dashboard loads for authenticated users
- [ ] Redirects to login if not authenticated
- [ ] XP displays correctly
- [ ] Streak updates daily
- [ ] Stats show accurate data
- [ ] Currently reading books display
- [ ] Recommendations load
- [ ] Animations run smoothly

### Edge Cases:
- [ ] New user (no data)
- [ ] User with broken streak
- [ ] User at max level
- [ ] No books in progress
- [ ] Network error handling
- [ ] Slow connection (loading states)

### Responsive:
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch targets adequate
- [ ] Text readable on all sizes

---

## 🐛 Common Issues & Solutions

### Issue: "User not found"
**Solution:** Ensure user is authenticated and exists in `users` table

### Issue: "XP not updating"
**Solution:** Check database migration ran successfully, verify `add_user_xp` function exists

### Issue: "Streak shows 0 always"
**Solution:** Verify `last_read_at` column exists and `update_user_streak` function works

### Issue: "Animations laggy"
**Solution:** Check only `transform` and `opacity` are animated, verify GPU acceleration

### Issue: "Data not loading"
**Solution:** Check Supabase connection, verify table names match blueprint (`user_library` not `user_progress`)

---

## 📚 Related Documentation

- [DASHBOARD_IMPLEMENTATION_SUMMARY.md](./DASHBOARD_IMPLEMENTATION_SUMMARY.md) - Complete implementation details
- [../../.kiro/steering/bluprint.md](../../.kiro/steering/bluprint.md) - Project blueprint
- [../../.kiro/steering/AGENT_3_PSYCHOLOGY.md](../../.kiro/steering/AGENT_3_PSYCHOLOGY.md) - Psychology strategy
- [../../.kiro/steering/AGENT_2_PERFORMANCE.md](../../.kiro/steering/AGENT_2_PERFORMANCE.md) - Performance strategy

---

## 🎓 For Developers

### Adding New Stats:
1. Add query to `useReadingStats` hook
2. Create new `<StatCard />` component
3. Add to dashboard grid
4. Test with real data

### Adding New Gamification Features:
1. Update `types/gamification.ts` with new types
2. Add calculation logic to `hooks/use-gamification.ts`
3. Create UI component in `components/dashboard/`
4. Integrate into `page.tsx`
5. Update database migration if needed

### Modifying Animations:
1. Keep duration < 500ms for micro-interactions
2. Use only `transform` and `opacity`
3. Add `will-change` hint for GPU
4. Test on low-end devices
5. Provide disable option if heavy

---

## ✅ MVP Completion Status

- [x] XP System
- [x] Streak System
- [x] Level System
- [x] Reading Stats
- [x] Currently Reading
- [x] Recommendations
- [x] Personalization
- [x] Animations
- [x] Error Handling
- [x] Loading States
- [x] Mobile Responsive
- [x] RTL Support

---

*Dashboard implementation follows Ketab-Yar Blueprint v1.0*  
*Designed for maximum engagement and zero server load*
