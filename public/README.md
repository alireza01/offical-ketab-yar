# 📦 Public Assets Folder - Ketab-Yar
## Complete Static Assets Directory

This folder contains all static assets served directly by Next.js without processing.

---

## 📁 Folder Structure

```
public/
├── favicon.ico                 # Multi-size favicon (16, 32, 48)
├── apple-touch-icon.png        # iOS home screen icon (180x180)
├── manifest.json               # PWA manifest
├── robots.txt                  # SEO crawl directives
├── sitemap.xml                 # Site map (can be dynamic)
├── browserconfig.xml           # Windows tile configuration
├── offline.html                # PWA offline fallback page
├── ASSETS_GUIDE.md             # Complete asset creation guide
├── README.md                   # This file
│
├── images/                     # All image assets
│   ├── icon-*.png              # PWA icons (8 sizes)
│   ├── screenshot-*.png        # PWA screenshots
│   ├── mstile-*.png            # Windows tiles
│   ├── logo-*.svg              # Logo variations
│   ├── empty-state-*.svg       # Empty state illustrations
│   ├── loading-spinner.svg     # Loading animation
│   └── README.md               # Image specifications
│
└── sounds/                     # Audio feedback files
    ├── xp-gain.mp3             # XP reward sound
    ├── level-up.mp3            # Level up celebration
    ├── streak-flame.mp3        # Streak maintenance
    ├── badge-unlock.mp3        # Achievement unlock
    ├── page-turn.mp3           # Page turn effect
    └── README.md               # Sound specifications
```

---

## 🎯 Agent Responsibilities

### Agent 1 (SEO) - Search Optimization
**Files Managed:**
- `robots.txt` - Crawl budget optimization
- `sitemap.xml` - Site structure for Google
- `favicon.ico` - Brand recognition in SERPs
- `browserconfig.xml` - Windows search integration

**SEO Impact:**
- ✅ Proper crawl directives (block private pages)
- ✅ Sitemap for efficient indexing
- ✅ Favicon for brand recognition
- ✅ Structured data support

### Agent 2 (Performance) - Optimization
**Files Managed:**
- `manifest.json` - PWA configuration
- `offline.html` - Offline fallback
- All image assets - Size optimization
- Sound files - Lazy loading strategy

**Performance Impact:**
- ✅ PWA for app-like experience
- ✅ Offline functionality
- ✅ Optimized asset sizes (< 3MB total)
- ✅ Lazy loading for non-critical assets

### Agent 3 (Psychology) - User Experience
**Files Managed:**
- Sound effects - Gamification feedback
- Empty state illustrations - Delightful UX
- Loading animations - Perceived performance
- Logo variations - Brand consistency

**UX Impact:**
- ✅ Audio feedback for engagement
- ✅ Visual delight in empty states
- ✅ Premium feel with gold theme
- ✅ Native app experience (PWA)

---

## 🚀 Current Status

### ✅ Completed
- [x] robots.txt (SEO optimized)
- [x] manifest.json (PWA configured)
- [x] sitemap.xml (placeholder)
- [x] browserconfig.xml (Windows tiles)
- [x] offline.html (PWA fallback)
- [x] Documentation (README files)
- [x] Placeholder SVG assets
- [x] Asset generation guide

### 🚧 In Progress (Need Creation)
- [ ] favicon.ico (multi-size)
- [ ] apple-touch-icon.png (180x180)
- [ ] PWA icons (8 sizes: 72-512px)
- [ ] Screenshots (2 mobile, 2 desktop)
- [ ] Shortcut icons (3 files)
- [ ] Windows tiles (4 files)
- [ ] Sound effects (7 files)
- [ ] Logo variations (4 files)

### 📊 File Size Targets
- Icons: < 500KB
- Screenshots: < 1MB
- Sounds: < 500KB
- **Total: < 3MB** (Agent 2 requirement)

---

## 🛠️ Quick Start

### Generate All Icons
```bash
# Install dependencies
npm install -D sharp to-ico imagemin imagemin-pngquant

# Create source icon (1024x1024) in assets/icon-source.png
# Then run generation script
node scripts/generate-icons.js
```

### Optimize Images
```bash
# Optimize all PNGs
npx imagemin public/images/*.png --out-dir=public/images --plugin=pngquant

# Convert screenshots to WebP
npx imagemin public/images/screenshot-*.png --out-dir=public/images --plugin=webp
```

### Verify Assets
```bash
# Check all manifest icons exist
node scripts/verify-assets.js
```

---

## 📱 PWA Configuration

### Manifest.json Features
- **Name**: کتاب‌یار - پلتفرم هوشمند مطالعه آنلاین
- **Theme Color**: #C9A961 (Gold)
- **Display**: Standalone (full-screen app)
- **Orientation**: Portrait (mobile-first)
- **Icons**: 8 sizes (72-512px)
- **Shortcuts**: Library, Vocabulary, Dashboard
- **Screenshots**: Mobile + Desktop

### Installation Behavior
- **Android**: Add to Home Screen prompt
- **iOS**: Add to Home Screen (manual)
- **Desktop**: Install app prompt (Chrome/Edge)

### Offline Strategy
- Service Worker caches app shell
- `offline.html` shown when offline
- Book content cached in IndexedDB (encrypted)
- XP/streak synced when back online

---

## 🎨 Design Standards

### Color Palette
```css
Primary Gold: #D4AF37
Gold Variant: #C9A961
Gold Light: #B8956A
Background: #FFFFFF
Text: #1A1A1A
```

### Icon Design
- **Style**: Flat, modern, minimalist
- **Motif**: Open book, reading, pages
- **Safe Zone**: 80% of canvas (maskable icons)
- **Format**: PNG (icons), SVG (logos)

### Sound Design
- **Duration**: 150ms - 2s
- **Volume**: 20-50% (subtle)
- **Format**: MP3, 32-64kbps
- **Style**: Pleasant, non-intrusive

---

## 🔍 SEO Configuration

### robots.txt Strategy
**Allowed (Public SSG Pages):**
- `/` (homepage)
- `/about`, `/help`, `/support`
- `/books/[slug]` (book detail pages)
- `/subscription`

**Disallowed (Private CSR Pages):**
- `/dashboard`, `/library`, `/profile`
- `/settings`, `/vocabulary`, `/review`
- `/books/read/[slug]` (actual reader)
- `/admin`, `/auth`, `/api`

### Sitemap Strategy
- Homepage (priority: 1.0)
- About/Help (priority: 0.7-0.8)
- Subscription (priority: 0.9)
- Book pages (priority: 0.9, dynamic)
- Updated: Daily for homepage, weekly for books

---

## 📊 Performance Metrics

### Target Metrics (Agent 2)
- **Lighthouse PWA**: 100/100
- **Total Asset Size**: < 3MB
- **Icon Load Time**: < 100ms
- **Offline Ready**: Yes

### Optimization Techniques
- PNG compression (TinyPNG/pngquant)
- WebP for screenshots (50% smaller)
- SVG for logos (scalable, tiny)
- MP3 low bitrate for sounds
- Lazy loading for non-critical assets

---

## 🧪 Testing Checklist

### PWA Testing
- [ ] Install on Android (Chrome)
- [ ] Install on iOS (Safari)
- [ ] Install on Desktop (Chrome/Edge)
- [ ] Test offline functionality
- [ ] Verify icon appears correctly
- [ ] Test shortcuts work

### SEO Testing
- [ ] Verify robots.txt accessible
- [ ] Check sitemap.xml loads
- [ ] Confirm favicon appears in browser
- [ ] Test apple-touch-icon on iOS
- [ ] Run Lighthouse SEO audit (> 95)

### Performance Testing
- [ ] Run Lighthouse Performance (> 90)
- [ ] Check total asset size (< 3MB)
- [ ] Verify lazy loading works
- [ ] Test on slow 3G connection
- [ ] Confirm sounds load on demand

---

## 🚨 Common Issues & Solutions

### Issue: PWA Install Prompt Not Showing
**Solution:**
- Verify all manifest icons exist
- Check HTTPS is enabled
- Ensure Service Worker registered
- Test on mobile device (not desktop)

### Issue: Favicon Not Appearing
**Solution:**
- Clear browser cache
- Verify favicon.ico in public root
- Check file is multi-size ICO format
- Add explicit link in layout.tsx

### Issue: Sounds Not Playing
**Solution:**
- Check user hasn't muted sounds
- Verify audio files exist
- Test on different browsers
- Ensure HTTPS (required for audio)

---

## 📚 Related Documentation

- **ASSETS_GUIDE.md** - Complete asset creation workflow
- **images/README.md** - Image specifications
- **sounds/README.md** - Sound specifications
- **Agent Steering Docs** - Agent responsibilities

---

## 🎯 Next Steps

1. **Create Source Icon** (1024x1024 in Figma)
2. **Run Generation Scripts** (icons, favicon)
3. **Capture Screenshots** (from deployed app)
4. **Create/Source Sounds** (Freesound.org)
5. **Optimize All Assets** (imagemin, compression)
6. **Test PWA Installation** (mobile + desktop)
7. **Run Lighthouse Audit** (verify scores)
8. **Deploy to Production** (Vercel)

---

**Status**: 🚧 Documentation Complete, Assets In Progress
**Priority**: HIGH (PWA broken without icons)
**Estimated Time**: 4-6 hours for complete asset creation
**Responsible**: Design team + Developer

---

*Last Updated: 2025-10-24*
*Version: 1.0*
*Project: Ketab-Yar (کتاب‌یار)*
