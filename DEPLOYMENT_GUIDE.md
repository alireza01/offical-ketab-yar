# 🚀 Deployment Guide
## Complete Production Deployment for Ketab-Yar

**Date:** 2025-01-24  
**Estimated Time:** 2-3 hours

---

## 📋 Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All features tested locally
- [ ] No console.logs in production code
- [ ] TypeScript errors resolved
- [ ] ESLint warnings fixed
- [ ] Build succeeds locally (`npm run build`)

### 2. Environment Variables Ready
- [ ] Sanity credentials
- [ ] Supabase credentials
- [ ] Preview secrets
- [ ] All tokens secured

### 3. Database Ready
- [ ] All tables created
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] Sample data loaded

---

## 🗄️ Step 1: Supabase Setup (30 minutes)

### 1.1 Create Tables

```sql
-- profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE,
    subscription_tier TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'inactive',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- user_progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL,
    current_page INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    reading_time INTEGER DEFAULT 0,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);

-- vocabulary table
CREATE TABLE vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    meaning TEXT,
    definition TEXT,
    context TEXT,
    book_id TEXT,
    page_number INTEGER,
    level TEXT DEFAULT 'learning',
    status TEXT DEFAULT 'active',
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 day',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_book_id ON user_progress(book_id);
CREATE INDEX idx_vocabulary_user_id ON vocabulary(user_id);
CREATE INDEX idx_vocabulary_word ON vocabulary(word);
```

### 1.2 Enable Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view own progress"
    ON user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Vocabulary policies
CREATE POLICY "Users can view own vocabulary"
    ON vocabulary FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary"
    ON vocabulary FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary"
    ON vocabulary FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vocabulary"
    ON vocabulary FOR DELETE
    USING (auth.uid() = user_id);
```

### 1.3 Create Profile Trigger

```sql
-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, created_at)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎨 Step 2: Sanity Studio Setup (20 minutes)

### 2.1 Deploy Sanity Studio

```bash
cd studio

# Build studio
npm run build

# Deploy to Sanity hosting
npm run deploy

# Note the deployed URL
# Example: https://ketab-yar.sanity.studio
```

### 2.2 Configure CORS

In Sanity dashboard:
1. Go to **Settings** → **API**
2. Add CORS origins:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
   - `https://your-domain.vercel.app` (Vercel preview)

### 2.3 Create API Token

1. Go to **Settings** → **API** → **Tokens**
2. Create new token:
   - Name: "Production API Token"
   - Permissions: **Viewer** (for preview mode)
3. Copy token (you'll need it for Vercel)

---

## ☁️ Step 3: Vercel Deployment (30 minutes)

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your Git repository
4. Select **Next.js** framework

### 3.2 Configure Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_ADMIN_TOKEN=your_admin_token
SANITY_API_TOKEN=your_api_token
SANITY_PREVIEW_SECRET=your_random_secret_string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional
NEXT_PUBLIC_USE_MOCK_DATA=false
```

**Important:** Set variables for all environments:
- Production
- Preview
- Development

### 3.3 Deploy

```bash
# Option 1: Deploy via Vercel dashboard
# Click "Deploy" button

# Option 2: Deploy via CLI
npm install -g vercel
vercel login
vercel --prod
```

### 3.4 Configure Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## 🔧 Step 4: Post-Deployment Configuration (30 minutes)

### 4.1 Update Sanity Preview URL

In `studio/.env`:
```env
SANITY_STUDIO_PREVIEW_URL=https://your-domain.com
```

Redeploy studio:
```bash
cd studio
npm run deploy
```

### 4.2 Test Preview Mode

1. Go to Sanity Studio
2. Create a draft book
3. Click preview button
4. Should open: `https://your-domain.com/api/preview?secret=XXX&slug=book-slug`
5. Verify draft content shows

### 4.3 Import Sample Books

```bash
# Set production environment variables
export SANITY_PROJECT_ID=your_project_id
export SANITY_ADMIN_TOKEN=your_admin_token
export SANITY_DATASET=production

# Import books
node scripts/import-book.mjs scripts/import-example.json

# Or import your own books
node scripts/import-book.mjs path/to/your-books.json
```

### 4.4 Verify All Features

**Test Checklist:**
- [ ] Homepage loads
- [ ] Book detail pages work
- [ ] Reader opens correctly
- [ ] Language switch works
- [ ] Chapter loading works
- [ ] Paywall triggers correctly
- [ ] Sign up works
- [ ] XP tracking works
- [ ] Vocabulary saving works
- [ ] Preview mode works

---

## 📊 Step 5: Analytics & Monitoring (20 minutes)

### 5.1 Vercel Analytics

1. Go to **Analytics** tab in Vercel
2. Enable **Web Analytics**
3. Enable **Speed Insights**

### 5.2 Supabase Monitoring

1. Go to Supabase dashboard
2. Check **Database** → **Usage**
3. Monitor:
   - Active connections
   - Database size
   - API requests

### 5.3 Error Tracking (Optional)

**Sentry Setup:**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

Add to `next.config.mjs`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(nextConfig, {
    silent: true,
    org: 'your-org',
    project: 'ketab-yar',
})
```

---

## 🔒 Step 6: Security Hardening (15 minutes)

### 6.1 Environment Variables

**Verify:**
- [ ] No secrets in code
- [ ] All tokens in environment variables
- [ ] Preview secret is random and secure
- [ ] API tokens have minimal permissions

### 6.2 Supabase Security

**Enable:**
- [ ] Email verification required
- [ ] Rate limiting on auth endpoints
- [ ] RLS policies on all tables
- [ ] API key restrictions

### 6.3 Vercel Security

**Configure:**
- [ ] Enable **Deployment Protection**
- [ ] Set up **Password Protection** for preview deployments
- [ ] Enable **HTTPS** only
- [ ] Configure **Security Headers**

Add to `next.config.mjs`:
```javascript
async headers() {
    return [
        {
            source: '/(.*)',
            headers: [
                {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'origin-when-cross-origin',
                },
            ],
        },
    ]
},
```

---

## 📱 Step 7: PWA Configuration (15 minutes)

### 7.1 Verify PWA Setup

```bash
# Build and test
npm run build
npm run start

# Open Chrome DevTools
# Application → Manifest
# Verify manifest.json is correct

# Application → Service Workers
# Verify service worker is registered
```

### 7.2 Test Offline Functionality

1. Open app in Chrome
2. Open DevTools → Network
3. Check "Offline"
4. Navigate app
5. Verify offline page shows

### 7.3 Test Installation

**Desktop:**
1. Open app in Chrome
2. Click install icon in address bar
3. Verify app installs

**Mobile:**
1. Open app in mobile browser
2. Tap "Add to Home Screen"
3. Verify app installs

---

## 🧪 Step 8: Final Testing (30 minutes)

### 8.1 Functional Testing

**Test all user flows:**
- [ ] Guest browsing
- [ ] Sign up process
- [ ] Free trial activation
- [ ] Reading experience
- [ ] Vocabulary saving
- [ ] XP tracking
- [ ] Paywall triggers
- [ ] Premium upgrade
- [ ] Profile management

### 8.2 Performance Testing

**Use Lighthouse:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view

# Check scores:
# - Performance: > 90
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 95
```

### 8.3 Cross-Browser Testing

**Test on:**
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)

### 8.4 Device Testing

**Test on:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large mobile (414x896)

---

## 📈 Step 9: Launch Preparation (15 minutes)

### 9.1 Content Preparation

- [ ] Import all books
- [ ] Verify all book covers
- [ ] Check all translations
- [ ] Publish all content

### 9.2 Marketing Setup

- [ ] Set up social media accounts
- [ ] Prepare launch announcement
- [ ] Create demo video
- [ ] Write blog post

### 9.3 Support Setup

- [ ] Create help documentation
- [ ] Set up support email
- [ ] Prepare FAQ page
- [ ] Create tutorial videos

---

## 🎉 Step 10: Launch! (5 minutes)

### 10.1 Final Checks

- [ ] All features working
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security hardened
- [ ] Monitoring active

### 10.2 Go Live

1. Remove any "Coming Soon" pages
2. Enable public access
3. Announce on social media
4. Monitor for issues

### 10.3 Post-Launch Monitoring

**First 24 hours:**
- Monitor error logs every hour
- Check analytics every 2 hours
- Respond to user feedback
- Fix critical bugs immediately

**First week:**
- Daily error log review
- Daily analytics review
- Collect user feedback
- Plan improvements

---

## 🐛 Troubleshooting

### Issue: Build Fails on Vercel

**Solution:**
```bash
# Check build locally
npm run build

# Check Node version
# Vercel uses Node 18 by default
# Set in vercel.json:
{
    "buildCommand": "npm run build",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "nextjs",
    "nodeVersion": "18.x"
}
```

### Issue: Environment Variables Not Working

**Solution:**
1. Verify variables are set in Vercel
2. Check variable names (case-sensitive)
3. Redeploy after adding variables
4. Check variable scope (Production/Preview/Development)

### Issue: Database Connection Fails

**Solution:**
```bash
# Check Supabase URL
echo $NEXT_PUBLIC_SUPABASE_URL

# Verify anon key
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
curl https://your-project.supabase.co/rest/v1/
```

---

## 📞 Support Resources

**Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Sanity Docs](https://www.sanity.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

**Community:**
- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com)
- [Sanity Slack](https://slack.sanity.io)

---

## ✅ Deployment Complete!

**Your app is now live at:** `https://your-domain.com`

**Next steps:**
1. Monitor performance
2. Collect user feedback
3. Plan Phase 4 features
4. Iterate and improve

---

**Deployed by:** Your Team  
**Deployment Date:** 2025-01-24  
**Version:** 1.0.0  
**Status:** 🚀 LIVE
