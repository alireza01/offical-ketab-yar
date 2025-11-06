# Ketab-Yar Gamification System

Complete gamification system with XP, levels, streaks, and achievements.

## 🎯 Overview

This system implements a comprehensive gamification strategy designed by Agent 3 (Psychology) to create an addictive, engaging reading experience while maintaining optimal performance (Agent 2).

## 📦 Components

### Core Components

#### `<XPDisplay />`
Displays user's current XP and progress to next level.

```tsx
import { XPDisplay } from '@/components/gamification'

<XPDisplay 
  currentXP={1250} 
  level={13} 
  size="md"
  showLabel={true}
/>
```

#### `<LevelBadge />`
Shows user's current level with animated badge.

```tsx
import { LevelBadge } from '@/components/gamification'

<LevelBadge 
  level={13} 
  size="lg"
  showLabel={true}
/>
```

#### `<StreakFlame />`
Displays current reading streak with flame animation.

```tsx
import { StreakFlame } from '@/components/gamification'

<StreakFlame 
  days={30} 
  isInDanger={false}
/>
```

#### `<AchievementCard />`
Shows achievement with progress or earned status.

```tsx
import { AchievementCard } from '@/components/gamification'

<AchievementCard 
  achievement={achievement}
  onUnlock={(achievement) => console.log('Unlocked!', achievement)}
/>
```

### Celebration Components

#### `<XPRewardAnimation />`
Animated XP reward popup.

```tsx
import { XPRewardAnimation } from '@/components/gamification'

<XPRewardAnimation 
  amount={25} 
  onComplete={() => console.log('Animation complete')}
/>
```

#### `<LevelUpCelebration />`
Full-screen level up celebration.

```tsx
import { LevelUpCelebration } from '@/components/gamification'

<LevelUpCelebration newLevel={14} />
```

#### `<AchievementUnlockAnimation />`
Toast notification for new achievements.

```tsx
import { AchievementUnlockAnimation } from '@/components/gamification'

<AchievementUnlockAnimation achievement={achievement} />
```

#### `<StreakCelebration />`
Full-screen celebration for streak milestones.

```tsx
import { StreakCelebration } from '@/components/gamification'

<StreakCelebration days={30} />
```

### Warning Components

#### `<StreakWarning />`
Prominent warning when streak is about to expire.

```tsx
import { StreakWarning } from '@/components/gamification'

<StreakWarning 
  streakDays={30}
  lastReadDate={new Date()}
  onDismiss={() => console.log('Dismissed')}
/>
```

### Dashboard Components

#### `<GamificationDashboard />`
Complete gamification overview with stats and achievements.

```tsx
import { GamificationDashboard } from '@/components/gamification'

<GamificationDashboard />
```

### Provider Components

#### `<GamificationProvider />`
Context provider for gamification state.

```tsx
import { GamificationProvider } from '@/components/gamification'

// In your root layout
<GamificationProvider>
  {children}
</GamificationProvider>
```

#### `<ReadingTracker />`
Invisible component that tracks reading activity.

```tsx
import { ReadingTracker } from '@/components/gamification'

// In your book reader
<ReadingTracker 
  bookId={bookId}
  currentPage={currentPage}
  totalPages={totalPages}
  isReading={isReading}
/>
```

## 🎣 Hooks

### `useGamification()`
Main hook for gamification functionality.

```tsx
import { useGamification } from '@/hooks/use-gamification'

function MyComponent() {
  const {
    // Data
    stats,
    achievements,
    streakInfo,
    isLoading,
    error,
    
    // Actions
    trackPageRead,
    trackReadingTime,
    trackBookCompletion,
    
    // Celebrations
    xpReward,
    levelUpData,
    newAchievements,
    clearXPReward,
    clearLevelUp,
    clearNewAchievements,
    
    // Computed
    level,
    xp,
    currentStreak,
  } = useGamification()
  
  // Track reading
  const handlePageChange = (newPage) => {
    trackPageRead(1)
  }
  
  return (
    <div>
      <XPDisplay currentXP={xp} level={level} />
      {xpReward && (
        <XPRewardAnimation 
          amount={xpReward} 
          onComplete={clearXPReward} 
        />
      )}
    </div>
  )
}
```

### `useGamificationContext()`
Access gamification context from provider.

```tsx
import { useGamificationContext } from '@/components/gamification'

function MyComponent() {
  const { trackPageRead, level, xp } = useGamificationContext()
  
  return <div>Level {level}</div>
}
```

## 📊 Database Schema

The system uses 3 main tables:

### `user_stats`
Stores user's XP, level, streak, and statistics.

### `achievements`
Defines all available achievements.

### `user_achievements`
Tracks which achievements users have earned.

See `supabase/migrations/20250106_gamification_system.sql` for complete schema.

## 🎮 Usage Examples

### Example 1: Add to Dashboard

```tsx
// app/dashboard/page.tsx
import { GamificationDashboard } from '@/components/gamification'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <GamificationDashboard />
    </div>
  )
}
```

### Example 2: Add to Book Reader

```tsx
// app/books/read/[slug]/page.tsx
import { ReadingTracker, XPDisplay } from '@/components/gamification'
import { useGamificationContext } from '@/components/gamification'

export default function BookReaderPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isReading, setIsReading] = useState(true)
  const { level, xp } = useGamificationContext()
  
  return (
    <div>
      {/* Header with XP */}
      <header>
        <XPDisplay currentXP={xp} level={level} size="sm" />
      </header>
      
      {/* Book content */}
      <div>...</div>
      
      {/* Invisible tracker */}
      <ReadingTracker 
        bookId={bookId}
        currentPage={currentPage}
        totalPages={totalPages}
        isReading={isReading}
      />
    </div>
  )
}
```

### Example 3: Manual XP Tracking

```tsx
import { useGamification } from '@/hooks/use-gamification'

function QuizComponent() {
  const { updateImmediately } = useGamification()
  
  const handleQuizComplete = async (score) => {
    // Award XP immediately for quiz completion
    await updateImmediately({
      xp_gained: score * 5, // 5 XP per correct answer
    })
  }
  
  return <div>...</div>
}
```

## 🎨 Customization

### Colors
All components use the gold color palette defined in the project:
- Primary: `#D4AF37`
- Variant 1: `#C9A961`
- Variant 2: `#B8956A`

### Animations
All animations are GPU-accelerated (transform/opacity only) for optimal performance.

### Sounds
Sound effects are optional and fail gracefully. See `public/sounds/README.md` for details.

## 🚀 Performance

- **Debounced Updates**: XP updates are batched and sent every 5 seconds
- **Client-Side Calculations**: XP calculations happen on the client
- **Optimized Queries**: Minimal database load
- **Lazy Loading**: Heavy components are dynamically imported
- **GPU Animations**: All animations use transform/opacity

## 🧠 Psychology

The system implements proven gamification psychology:

1. **Variable Rewards**: Random XP bonuses (0-10%)
2. **Loss Aversion**: Streak warnings create urgency
3. **Social Competition**: Leaderboards (coming soon)
4. **Progress Visualization**: Clear progress bars
5. **Immediate Feedback**: Instant XP animations
6. **Milestone Celebrations**: Special animations for achievements
7. **Endowed Progress**: Users start with some XP

## 📈 XP Calculation

```typescript
// Base XP
- Page read: 2 XP
- Minute of reading: 1 XP
- Book completed: 100 XP bonus
- Chapter completed: 20 XP bonus

// Streak Bonus
- 10% bonus per streak day (max 2x)
- Example: 7-day streak = 1.7x multiplier

// Random Bonus
- 0-10% random bonus on all XP gains

// Level Up Reward
- Level * 50 XP bonus
- Example: Reaching level 10 = 500 XP bonus
```

## 🏆 Achievement Types

- **Books Completed**: Complete X books
- **Pages Read**: Read X pages
- **Streak Days**: Maintain X day streak
- **Reading Time**: Read for X hours

## 🔧 Troubleshooting

### XP not updating
- Check if user is authenticated
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies

### Animations not showing
- Verify Framer Motion is installed
- Check if celebrations are being cleared too quickly
- Verify AnimatePresence is wrapping animations

### Sounds not playing
- Check if sound files exist in `/public/sounds/`
- Verify user has interacted with page (browser requirement)
- Check browser console for audio errors
- Sounds fail gracefully if not available

## 📝 Migration

To set up the database:

```bash
# Run the migration
supabase db push

# Or manually run the SQL file
psql -f supabase/migrations/20250106_gamification_system.sql
```

## 🎯 Future Enhancements

- [ ] Weekly leagues (like Duolingo)
- [ ] Friend system and social features
- [ ] Custom achievement creation
- [ ] Seasonal events
- [ ] Badges and titles
- [ ] Reward shop
- [ ] Daily challenges

---

**Built with ❤️ by the Ketab-Yar Agent System**
- Agent 0: Investigation & Analysis
- Agent 1: SEO (No impact on private features)
- Agent 2: Performance & Optimization
- Agent 3: Psychology & Engagement
- Agent 4: Coordination & Balance
