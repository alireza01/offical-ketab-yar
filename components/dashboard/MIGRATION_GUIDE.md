# 🔄 Dashboard Migration Guide

## Quick Start (5 Minutes)

### Step 1: Run Database Migration

```bash
# Connect to your Supabase project
psql -h db.your-project.supabase.co -U postgres -d postgres

# Run the migration
\i supabase/migrations/20250124_dashboard_stats_function.sql

# Verify function exists
SELECT * FROM get_user_reading_stats('00000000-0000-0000-0000-000000000000');
```

### Step 2: Update Dashboard Page

The page has already been updated to use the enhanced component:

```typescript
// app/dashboard/page.tsx
import dynamic from 'next/dynamic'

const DashboardEnhanced = dynamic(
  () => import('@/components/dashboard/dashboard-enhanced').then(mod => ({ default: mod.DashboardEnhanced })),
  { loading: () => <DashboardSkeleton />, ssr: false }
)

export default function DashboardPage() {
  return <DashboardEnhanced />
}
```

### Step 3: Test Locally

```bash
npm run dev
# Visit http://localhost:3000/dashboard
# Login and verify all features work
```

### Step 4: Deploy

```bash
git add .
git commit -m "feat: enhanced dashboard with 5-agent protocol"
git push origin main
# Vercel will auto-deploy
```

---

## Detailed Migration Steps

### 1. Database Setup

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push

# Verify
supabase db functions list
```

#### Option B: Using SQL Editor in Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20250124_dashboard_stats_function.sql`
3. Paste and run
4. Verify no errors

#### Option C: Using psql

```bash
# Get connection string from Supabase Dashboard
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Run migration
\i supabase/migrations/20250124_dashboard_stats_function.sql

# Test function
SELECT * FROM get_user_reading_stats('your-user-id');
```

### 2. Verify Database Function

```sql
-- Should return stats for the user
SELECT * FROM get_user_reading_stats('user-id-here');

-- Expected output:
-- total_books | completed_books | total_pages | total_reading_time | books_this_week | pages_this_week
-- 5           | 2               | 150         | 120                | 2               | 50
```

### 3. Update Environment Variables (If Needed)

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 4. Install Dependencies (If Missing)

```bash
npm install @tanstack/react-query framer-motion lucide-react
```

### 5. Test All Features

#### Checklist:

- [ ] Dashboard loads without errors
- [ ] User greeting shows correct name
- [ ] XP progress bar displays correctly
- [ ] Streak flame shows current streak
- [ ] Level badge shows correct level
- [ ] Stats cards show real data (not mock)
- [ ] Currently reading section works
- [ ] Achievements display (if any)
- [ ] Daily goal shows progress
- [ ] Empty states show when no data
- [ ] Loading skeleton appears briefly
- [ ] Error handling works (disconnect internet)
- [ ] Animations are smooth (60fps)
- [ ] Mobile responsive
- [ ] RTL support works

### 6. Performance Verification

```bash
# Run Lighthouse audit
npm run build
npm run start
# Open Chrome DevTools → Lighthouse → Run audit

# Expected scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: N/A (private page)
```

### 7. Monitor After Deployment

```bash
# Check Vercel logs
vercel logs

# Check Supabase logs
# Go to Supabase Dashboard → Logs

# Monitor database queries
# Go to Supabase Dashboard → Database → Query Performance
```

---

## Rollback Plan (If Needed)

### If Something Goes Wrong

#### Option 1: Revert to Old Component

```typescript
// app/dashboard/page.tsx
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default function DashboardPage() {
  return <DashboardClient />
}
```

#### Option 2: Remove Database Function

```sql
DROP FUNCTION IF EXISTS get_user_reading_stats(UUID);
```

#### Option 3: Full Rollback

```bash
git revert HEAD
git push origin main
```

---

## Troubleshooting

### Issue: "Function get_user_reading_stats does not exist"

**Solution:**
```bash
# Re-run migration
psql -f supabase/migrations/20250124_dashboard_stats_function.sql

# Or create manually in Supabase Dashboard
```

### Issue: "Dashboard shows loading forever"

**Possible Causes:**
1. User not authenticated
2. Database function not created
3. RLS policies blocking access
4. Network error

**Debug:**
```typescript
// Add console.log in dashboard-enhanced.tsx
console.log('User:', user)
console.log('Data:', data)
console.log('Error:', error)
```

### Issue: "Stats show 0 for everything"

**Possible Causes:**
1. User has no data yet
2. Database function returning wrong data
3. RLS policies blocking access

**Debug:**
```sql
-- Test function directly
SELECT * FROM get_user_reading_stats('your-user-id');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_library';
```

### Issue: "Animations are laggy"

**Solution:**
```typescript
// Add to user settings
const prefersReducedMotion = useReducedMotion()

// Disable animations if needed
{!prefersReducedMotion && <Animation />}
```

### Issue: "TypeScript errors"

**Solution:**
```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id your-project > types/database.types.ts

# Restart TypeScript server
# In VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Performance Optimization Tips

### 1. Adjust Cache Times

```typescript
// For more frequent updates
staleTime: 1 * 60 * 1000  // 1 minute

// For less frequent updates
staleTime: 10 * 60 * 1000  // 10 minutes
```

### 2. Add Prefetching

```typescript
// Prefetch dashboard data on login
await queryClient.prefetchQuery(['dashboard-complete', userId])
```

### 3. Optimize Images

```typescript
// Use next/image with proper sizes
<Image
  src={coverImage}
  alt={title}
  width={300}
  height={450}
  sizes="(max-width: 768px) 50vw, 300px"
/>
```

### 4. Add Service Worker (PWA)

```bash
npm install next-pwa
# Configure in next.config.js
```

---

## Testing Checklist

### Unit Tests (Optional)

```typescript
// __tests__/dashboard-enhanced.test.tsx
import { render, screen } from '@testing-library/react'
import { DashboardEnhanced } from '@/components/dashboard/dashboard-enhanced'

test('renders greeting', () => {
  render(<DashboardEnhanced />)
  expect(screen.getByText(/صبح بخیر|عصر بخیر|شب بخیر/)).toBeInTheDocument()
})
```

### Integration Tests

```typescript
// Test database function
test('get_user_reading_stats returns correct data', async () => {
  const { data } = await supabase.rpc('get_user_reading_stats', { p_user_id: userId })
  expect(data.total_books).toBeGreaterThanOrEqual(0)
})
```

### E2E Tests (Playwright)

```typescript
test('dashboard loads and shows user data', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.locator('h1')).toContainText('صبح بخیر')
})
```

---

## Monitoring & Analytics

### Add Analytics Events

```typescript
// Track dashboard views
useEffect(() => {
  analytics.track('Dashboard Viewed', {
    userId: user.id,
    timestamp: new Date()
  })
}, [user])

// Track feature usage
const handleGoalComplete = () => {
  analytics.track('Daily Goal Completed', {
    userId: user.id,
    goal: 20,
    actual: 20
  })
}
```

### Monitor Performance

```typescript
// Add performance marks
performance.mark('dashboard-start')
// ... load data
performance.mark('dashboard-end')
performance.measure('dashboard-load', 'dashboard-start', 'dashboard-end')
```

---

## Support

### Need Help?

1. Check [README.md](./README.md) for detailed documentation
2. Check [ENHANCEMENT_SUMMARY.md](./ENHANCEMENT_SUMMARY.md) for technical details
3. Review agent protocols in `.kiro/steering/`
4. Open an issue on GitHub
5. Contact the development team

---

**Migration Status**: ✅ Ready  
**Estimated Time**: 5-15 minutes  
**Difficulty**: Easy  
**Risk Level**: Low (rollback available)
