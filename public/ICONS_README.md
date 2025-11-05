# PWA Icons for Ketab-Yar

## Required Icon Files

Place the following PNG icon files in the `public/` directory:

### App Icons (PWA)
1. **icon-192x192.png** - 192x192 pixels
2. **icon-256x256.png** - 256x256 pixels
3. **icon-384x384.png** - 384x384 pixels
4. **icon-512x512.png** - 512x512 pixels

### Favicon Icons
5. **favicon.ico** - 32x32 pixels (already exists)
6. **favicon-16x16.png** - 16x16 pixels
7. **apple-touch-icon.png** - 180x180 pixels

### Open Graph Images
8. **og-image.png** - 1200x630 pixels (for social sharing)
9. **og-book-default.png** - 1200x630 pixels (default book image)
10. **og-about.png** - 1200x630 pixels
11. **og-help.png** - 1200x630 pixels
12. **og-library.png** - 1200x630 pixels
13. **og-status.png** - 1200x630 pixels
14. **og-support.png** - 1200x630 pixels

### Screenshots (PWA)
15. **screenshot-1.png** - 1280x720 pixels (homepage)
16. **screenshot-2.png** - 1280x720 pixels (reader)

### Logo
17. **logo.png** - 512x512 pixels (transparent background)

## Design Guidelines

### Color Scheme
- Primary: #D4AF37 (Gold)
- Secondary: #C9A961 (Gold Variant)
- Accent: #B8956A (Gold Variant 2)
- Background: #f4ecd8 (Sepia)

### Icon Design
- Use the gold color scheme
- Include a book or reading symbol
- Keep it simple and recognizable
- Ensure good contrast
- Test on both light and dark backgrounds

### Recommended Tools

#### Online Generators
1. **PWA Builder Image Generator**
   - https://www.pwabuilder.com/imageGenerator
   - Upload one 512x512 image, generates all sizes

2. **Real Favicon Generator**
   - https://realfavicongenerator.net/
   - Generates all favicon formats

3. **Canva**
   - https://www.canva.com/
   - Free design tool for creating icons

#### Design Software
- **Figma** (free, web-based)
- **Adobe Illustrator** (professional)
- **Inkscape** (free, open-source)
- **GIMP** (free, open-source)

## Quick Setup

### Option 1: Use PWA Builder (Easiest)
1. Create one 512x512 PNG icon with your logo
2. Go to https://www.pwabuilder.com/imageGenerator
3. Upload your icon
4. Download the generated package
5. Extract all icons to `public/` directory

### Option 2: Use Canva Template
1. Go to Canva
2. Search for "App Icon" template
3. Customize with Ketab-Yar branding
4. Download in all required sizes
5. Place in `public/` directory

### Option 3: Hire a Designer
- Fiverr: $5-50 for icon design
- Upwork: Professional designers
- 99designs: Design contest

## Temporary Placeholder

For development, you can use a simple colored square:

```bash
# Create placeholder icons (requires ImageMagick)
convert -size 512x512 xc:#D4AF37 -pointsize 200 -fill white -gravity center -annotate +0+0 "کتاب" icon-512x512.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
convert icon-512x512.png -resize 256x256 icon-256x256.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
```

Or use online placeholder generators:
- https://placeholder.com/
- https://via.placeholder.com/

## Verification

After adding icons, verify:
1. All files exist in `public/` directory
2. File names match exactly (case-sensitive)
3. File sizes are correct
4. Images are not corrupted
5. PWA manifest references correct paths

Test PWA installation:
1. Build project: `npm run build`
2. Start server: `npm start`
3. Open in Chrome
4. Check DevTools > Application > Manifest
5. Verify all icons load correctly

## Current Status

- ✅ manifest.json created (references icons)
- ⏳ Icon files need to be created
- ⏳ OG images need to be created
- ⏳ Screenshots need to be captured

## Priority

**High Priority** (Required for PWA):
- icon-192x192.png
- icon-512x512.png
- favicon.ico (already exists)

**Medium Priority** (Improves UX):
- apple-touch-icon.png
- og-image.png
- All other icon sizes

**Low Priority** (Nice to have):
- Screenshots
- All OG images for specific pages

---

*Note: The app will work without these icons, but PWA installation and social sharing will be limited.*
