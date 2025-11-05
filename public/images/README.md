# 🖼️ Image Assets for Ketab-Yar
## Complete Image Asset Specification

This folder contains all static images for the PWA, branding, and UI.

## Required Files

### PWA Icons (manifest.json requirements)
All icons should use the gold theme (#C9A961, #D4AF37) with book/reading motif.

#### App Icons (Required for PWA Installation)
- **icon-72x72.png** - 72x72px, PNG, optimized
- **icon-96x96.png** - 96x96px, PNG, optimized
- **icon-128x128.png** - 128x128px, PNG, optimized
- **icon-144x144.png** - 144x144px, PNG, optimized
- **icon-152x152.png** - 152x152px, PNG, optimized
- **icon-192x192.png** - 192x192px, PNG, optimized (Android)
- **icon-384x384.png** - 384x384px, PNG, optimized
- **icon-512x512.png** - 512x512px, PNG, optimized (Android splash)

**Design Guidelines:**
- Background: Gold gradient (#C9A961 to #D4AF37)
- Icon: White book symbol or "کتاب‌یار" text
- Style: Flat, modern, recognizable at small sizes
- Format: PNG with transparency
- Purpose: "any maskable" (safe zone: 80% of canvas)

#### Shortcut Icons (Quick Actions)
- **icon-library.png** - 96x96px, library/bookshelf icon
- **icon-vocabulary.png** - 96x96px, vocabulary/dictionary icon
- **icon-dashboard.png** - 96x96px, dashboard/stats icon

#### Screenshots (PWA Store Listings)
- **screenshot-mobile-1.png** - 540x720px (9:16 ratio)
  - Show: Book reader with bilingual text
- **screenshot-mobile-2.png** - 540x720px
  - Show: Dashboard with XP and streak
- **screenshot-desktop-1.png** - 1280x720px (16:9 ratio)
  - Show: Landing page with featured books
- **screenshot-desktop-2.png** - 1280x720px
  - Show: Book reader in fullscreen

### Favicon Files (SEO & Browser)
- **favicon.ico** - Multi-size ICO (16x16, 32x32, 48x48)
- **apple-touch-icon.png** - 180x180px (iOS home screen)
- **favicon-16x16.png** - 16x16px
- **favicon-32x32.png** - 32x32px

### Windows Tiles (browserconfig.xml)
- **mstile-70x70.png** - 70x70px
- **mstile-150x150.png** - 150x150px
- **mstile-310x310.png** - 310x310px
- **mstile-310x150.png** - 310x150px (wide)

### Logo Variations
- **logo-light.svg** - Logo for light backgrounds
- **logo-dark.svg** - Logo for dark backgrounds
- **logo-icon.svg** - Icon-only version (no text)
- **logo-full.svg** - Full logo with text

### UI Assets
- **loading-spinner.svg** - Gold-themed loading animation
- **empty-state-books.svg** - Empty library illustration
- **empty-state-vocabulary.svg** - Empty vocabulary illustration
- **error-404.svg** - 404 page illustration
- **error-500.svg** - 500 page illustration

### Social Media / OG Images
- **og-image.png** - 1200x630px (Open Graph default)
- **og-image-home.png** - 1200x630px (Homepage specific)
- **twitter-card.png** - 1200x600px (Twitter card)

## File Size Optimization (Agent 2 - Performance)

### Optimization Rules
1. **Icons**: Use PNG with TinyPNG compression
2. **Logos**: Use SVG (vector, scalable, tiny)
3. **Screenshots**: Use WebP format (50% smaller than PNG)
4. **Total folder size**: Target < 2MB

### Optimization Tools
```bash
# Install optimization tools
npm install -D sharp imagemin imagemin-pngquant imagemin-webp

# Optimize PNGs
npx imagemin public/images/*.png --out-dir=public/images --plugin=pngquant

# Convert to WebP
npx imagemin public/images/*.png --out-dir=public/images --plugin=webp
```

## Generation Script (Recommended)

Create a script to generate all icon sizes from one source:

```javascript
// scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = 'assets/icon-source.png'; // 1024x1024 source

sizes.forEach(size => {
  sharp(sourceIcon)
    .resize(size, size)
    .png({ quality: 90 })
    .toFile(`public/images/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated ${size}x${size}`));
});
```

## Design Specifications

### Color Palette
- Primary Gold: #D4AF37
- Gold Variant: #C9A961
- Background: #FFFFFF
- Text: #1A1A1A

### Icon Design
- Style: Flat, modern, minimalist
- Motif: Open book, pages, reading
- Typography: Clean, Persian-friendly
- Safe zone: 80% of canvas (for maskable icons)

### Screenshot Guidelines
- Show real UI (not mockups)
- Highlight key features
- Use actual Persian/English content
- Show premium feel (gold accents)
- Mobile: Portrait orientation
- Desktop: Landscape orientation

## Accessibility
- All images should have proper alt text in code
- Icons should be recognizable at small sizes
- High contrast for visibility
- Support for dark mode where applicable

## Implementation Example

```typescript
// app/layout.tsx - Favicon links
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

// Open Graph
<meta property="og:image" content="/og-image.png" />
<meta name="twitter:image" content="/twitter-card.png" />
```

---

**Status**: 🚧 All files need to be created
**Priority**: HIGH (PWA is broken without these)
**Agent 1 Impact**: High (SEO, brand recognition)
**Agent 2 Impact**: Medium (file size optimization needed)
**Agent 3 Impact**: High (premium feel, native app experience)

## Next Steps
1. Design source icon (1024x1024) with gold theme
2. Run generation script for all sizes
3. Create screenshots from actual app
4. Optimize all files
5. Test PWA installation on mobile
6. Verify favicon appears in all browsers
