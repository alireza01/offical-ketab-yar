# Mock Data for Testing

This folder contains mock book data for testing the Ketab-Yar platform locally.

## 📚 What's Included

**Book**: "The Great Banana Adventure" (ماجراجویی بزرگ موز)
- 2 complete chapters (Chapter 1 & 2) in NDJSON
- 20+ paragraphs of bilingual content (English/Persian)
- Rich formatting: **bold**, *italic*, underline, headings, blockquotes
- Full story about Benny the Banana's adventure through Costa Rica rainforest

**Author**: Marina Tropical (Costa Rican environmental educator)
**Genres**: Adventure, Fiction
**Level**: Intermediate (B1-B2)
**Status**: Published & Featured

## 🚀 Quick Start

### Option 1: Use Mock Data Locally (NO SANITY REQUIRED) ⚡

**Perfect for testing without Sanity setup!**

1. **Enable mock data mode:**
```bash
# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local and set:
NEXT_PUBLIC_USE_MOCK_DATA=true
```

2. **Run the app:**
```bash
npm run dev
# Go to http://localhost:3000
```

3. **Test the book:**
- Navigate to `/books/the-great-banana-adventure`
- Click "Start Reading"
- Test all features with mock data!

**That's it!** No Sanity login, no internet required. Perfect for local development! 🎉

---

### Option 2: Import to Sanity (For Production)

**When you're ready to use real Sanity:**

1. **Import the data:**
```bash
npx sanity dataset import scripts/mock-data/MOCK_DATA_banana-book.ndjson production
```

2. **Disable mock mode:**
```bash
# In .env.local, set:
NEXT_PUBLIC_USE_MOCK_DATA=false
```

3. **View in Sanity Studio:**
```bash
npm run dev
# Go to http://localhost:3000/Studio
```

### Test in Reader
1. Go to http://localhost:3000
2. Find "The Great Banana Adventure" book
3. Click to read
4. Test all features:
   - ✅ Language toggle (EN ⟷ FA)
   - ✅ Page navigation
   - ✅ Word selection & dictionary
   - ✅ Vocabulary saving
   - ✅ Highlighting
   - ✅ Comments
   - ✅ Formatting (bold, italic, headings, quotes)

## 🗑️ Remove Mock Data (Before Deployment)

### Option 1: Run cleanup script
```bash
bash scripts/mock-data/REMOVE_MOCK_DATA.sh
```

### Option 2: Manual deletion
```bash
npx sanity documents delete mock-banana-adventure
npx sanity documents delete mock-author-banana
npx sanity documents delete mock-genre-adventure
npx sanity documents delete mock-genre-fiction
npx sanity documents delete image.banana-cover
```

### Option 3: Delete from Sanity Studio
1. Go to Studio
2. Find documents with "mock-" prefix
3. Delete manually

## 📁 Files

- `MOCK_DATA_banana-book.ndjson` - **USE THIS** - Complete Sanity import file
- `REMOVE_MOCK_DATA.sh` - Cleanup script
- `banana-*.json` - Individual JSON files (for reference only)

## ⚠️ Important Notes

1. **All mock data has "mock-" prefix** in IDs for easy identification
2. **Image is from Unsplash** - Replace with real cover before production
3. **Only 2 chapters included** in NDJSON to keep file size reasonable
4. **Full 4 chapters** available in separate JSON files if needed

## 🎯 Testing Checklist

### Book Discovery
- [ ] Book appears in homepage
- [ ] Book shows in featured section
- [ ] Book detail page loads correctly
- [ ] Cover image displays
- [ ] Author info shows
- [ ] Genres display correctly

### Reader Features
- [ ] Reader opens with bilingual content
- [ ] Language toggle works (EN ⟷ FA)
- [ ] Text formatting displays correctly (bold, italic, underline, headings, quotes)
- [ ] Page breaks work properly
- [ ] Chapter navigation works

### Progressive Loading (IMPORTANT!)
- [ ] Chapter 1 loads immediately (fast!)
- [ ] Chapter 2 prefetches at 60% of chapter 1
- [ ] Chapter transition is instant (already cached)
- [ ] Check browser DevTools Network tab - should see individual chapter requests
- [ ] Offline mode works (IndexedDB caching)

### Interactive Features
- [ ] Text selection works
- [ ] Dictionary popup works on word click
- [ ] Vocabulary can be saved (20 word limit for free users)
- [ ] Highlighting works (yellow, orange, gold)
- [ ] Highlights panel shows saved highlights
- [ ] Comments can be added
- [ ] AI chat works with context

### Gamification
- [ ] Progress tracking works
- [ ] XP system updates on reading
- [ ] Streak system tracks daily reading
- [ ] Completion celebration shows

## 📊 How Progressive Loading Works

Your `use-chapter-loader.ts` hook implements smart chapter loading:

### Strategy
```
1. User opens book → Load Chapter 1 only (130KB)
2. User reads Chapter 1 → At 60%, prefetch Chapter 2 in background
3. User finishes Chapter 1 → Chapter 2 already loaded (instant!)
4. User reads Chapter 2 → At 60%, prefetch Chapter 3
```

### Performance Benefits
- **Initial load**: Only 1 chapter (vs all chapters)
- **Chapter transitions**: Instant (already prefetched)
- **Offline support**: Chapters cached in IndexedDB
- **Bandwidth savings**: Only download what user reads

### How to Verify
1. Open browser DevTools → Network tab
2. Start reading the book
3. Watch for Sanity API calls:
   - First call: `chapters[0]` (Chapter 1)
   - At 60%: `chapters[1]` (Chapter 2 prefetch)
   - Click "Next": Instant (no new request!)

### Current Structure (NDJSON)
```json
{
  "_id": "mock-banana-adventure",
  "chapters": [
    { chapter 1 content },  // Loaded on demand
    { chapter 2 content }   // Prefetched at 60%
  ]
}
```

**Note**: Sanity is smart - when you query `chapters[0]`, it only sends that chapter's data, not the entire array. This makes your current structure efficient for MVP!

## 🔧 Troubleshooting

**Import fails?**
- Make sure you're in project root
- Check Sanity credentials in `.env.local`
- Try: `npx sanity login` first

**Book doesn't appear?**
- Check status is "published" in Studio
- Verify `featured: true` is set
- Clear Next.js cache: `rm -rf .next`

**Images not loading?**
- Mock uses Unsplash URL
- Upload real image in Studio if needed

**Progressive loading not working?**
- Check browser console for errors
- Verify `use-chapter-loader.ts` is being used
- Check Network tab - should see separate chapter requests
- Clear IndexedDB: DevTools → Application → IndexedDB → Delete

## 📝 Story Summary

Benny the Banana lives a comfortable life on a Costa Rican plantation until a storm separates him from his family. He lands in the wild Monteverde Cloud Forest where he meets Fernando the Frog and Tessa the Toucan. Together, they embark on an adventure to help Benny find his way home, teaching him about courage, friendship, and self-discovery.

Perfect for testing:
- Bilingual reading experience
- Rich text formatting
- Long-form content
- Chapter navigation
- All reader features
