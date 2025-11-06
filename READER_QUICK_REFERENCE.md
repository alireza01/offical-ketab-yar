# 📖 Reader Quick Reference
## Essential Commands & Features

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development
npm run dev

# 3. Test reader
# Visit: http://localhost:3000/books/read/the-great-gatsby
```

---

## 🎯 Language Modes

| Mode | Display | Use Case |
|------|---------|----------|
| `EN` | English only | Native English readers |
| `FA` | Persian only | Native Persian readers |
| `EN_FA` | English (large) + Persian (small) | English learners |
| `FA_EN` | Persian (large) + English (small) | Persian learners |

**Switch:** Click language button in reader header

---

## 📚 Chapter Loading Logic

```
Initial Load:
└─ Chapter 1 (immediate)
   └─ Chapter 2 (auto-load after Chapter 1)

While Reading:
├─ At 60% of chapter → Load next chapter
└─ At 80% of chapter → Load chapter after next

Result: Always 2 chapters ahead
```

---

## 🎨 Reader Controls

### Header (Auto-hide)
- **Language Switch** - Change reading mode
- **Chapter Menu** - Jump to any chapter
- **Close Button** - Return to book detail

### Footer (Auto-hide)
- **Previous/Next** - Navigate chapters
- **Progress** - Current chapter number

### Behavior
- Show on scroll
- Hide after 3 seconds
- Always accessible

---

## 🔧 Developer Reference

### Use Language Store

```typescript
import { useLanguageStore } from '@/stores/useLanguageStore'

const { mode, setMode } = useLanguageStore()

// Get current mode
console.log(mode) // 'EN' | 'FA' | 'EN_FA' | 'FA_EN'

// Change mode
setMode('EN_FA')
```

### Use Chapter Loader

```typescript
import { useChapterLoader } from '@/hooks/use-chapter-loader'

const {
  chapters,           // Loaded chapters cache
  currentChapter,     // Current chapter number
  totalChapters,      // Total chapters in book
  loading,            // Loading state per chapter
  goToChapter,        // Navigate to chapter
  handleScroll,       // Track scroll for prefetch
  hasNextChapter,     // Can go forward
  hasPrevChapter,     // Can go backward
} = useChapterLoader({
  bookSlug: 'book-slug',
  initialChapter: firstChapterData
})
```

### Render Bilingual Content

```typescript
import { BilingualRenderer } from '@/components/reader/BilingualRenderer'

<BilingualRenderer
  paragraph={{
    english: [/* Portable Text */],
    farsi: [/* Portable Text */]
  }}
  index={0}
/>
```

---

## 📊 Performance Tips

### Optimize Loading
```typescript
// ✅ Good: Load only first chapter
const book = await sanityClient.fetch(bookWithFirstChapterQuery, { slug })

// ❌ Bad: Load entire book
const book = await sanityClient.fetch(bookBySlugQuery, { slug })
```

### Prefetch Strategy
```typescript
// Automatic prefetching at:
- 60% scroll → Next chapter
- 80% scroll → Chapter after next

// Manual prefetch:
loadChapter(chapterNumber)
```

---

## 🐛 Troubleshooting

### Chapter not loading
```typescript
// Check if chapter exists
console.log(totalChapters)

// Check loading state
console.log(loading[chapterNumber])

// Manually trigger load
loadChapter(chapterNumber)
```

### Language not switching
```typescript
// Check current mode
const { mode } = useLanguageStore()
console.log(mode)

// Clear localStorage
localStorage.removeItem('ketab-yar-language-mode')
```

### Scroll tracking not working
```typescript
// Ensure contentRef is attached
<div ref={contentRef} onScroll={handleScrollEvent}>

// Check scroll percentage
const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100
console.log(scrollPercentage)
```

---

## 📱 Mobile Optimization

### Touch Targets
- Minimum 44x44px
- Adequate spacing
- Clear visual feedback

### Responsive Text
```css
/* Base */
text-base md:text-lg

/* Small (secondary) */
text-sm

/* Large (headings) */
text-3xl
```

### RTL Support
```typescript
// Automatic based on language mode
dir="ltr"  // English
dir="rtl"  // Persian
```

---

## 🎯 Testing Checklist

### Functionality
- [ ] All 4 language modes work
- [ ] Chapter navigation works
- [ ] Auto-prefetch triggers
- [ ] Controls auto-hide
- [ ] Progress bar updates

### Performance
- [ ] Initial load < 1 second
- [ ] Chapter switch instant
- [ ] No lag on scroll
- [ ] Smooth animations

### Mobile
- [ ] Responsive layout
- [ ] Touch-friendly
- [ ] Readable text
- [ ] Smooth scrolling

---

## 📖 Related Documentation

- **[PHASE_2_COMPLETE.md](PHASE_2_COMPLETE.md)** - Complete feature guide
- **[SANITY_CMS_INTEGRATION.md](docs/SANITY_CMS_INTEGRATION.md)** - Sanity setup
- **[SANITY_ARCHITECTURE.md](docs/SANITY_ARCHITECTURE.md)** - System design

---

## 🆘 Quick Fixes

### Reset language preference
```javascript
localStorage.removeItem('ketab-yar-language-mode')
```

### Clear chapter cache
```javascript
// Reload page to reset cache
window.location.reload()
```

### Force chapter load
```typescript
// In browser console
loadChapter(3) // Load chapter 3
```

---

**Quick Start:** `npm run dev` → Visit `/books/read/the-great-gatsby`

**Support:** Check [PHASE_2_COMPLETE.md](PHASE_2_COMPLETE.md) for details
