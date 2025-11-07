# 🚀 Quick Start with Mock Data

**Test the entire app locally WITHOUT Sanity setup!**

## ⚡ 3-Step Setup (30 seconds)

### 1. Enable Mock Data Mode

Create `.env.local` file in project root:

```bash
NEXT_PUBLIC_USE_MOCK_DATA=true
```

That's it! No Sanity credentials needed.

### 2. Run the App

```bash
npm run dev
```

### 3. Test the Book

Open your browser:
```
http://localhost:3000/books/the-great-banana-adventure
```

Click **"Start Reading"** and enjoy! 📚

---

## ✨ What You Can Test

### ✅ All Features Work with Mock Data:

- **Book Reading**: Full bilingual content (English/Persian)
- **Language Toggle**: Switch between EN ⟷ FA
- **Progressive Loading**: Chapters load on-demand (60% prefetch)
- **Text Formatting**: Bold, italic, underline, headings, quotes
- **Text Selection**: Highlight, vocabulary, AI chat
- **Offline Mode**: IndexedDB caching
- **Page Navigation**: Next/Previous with smooth animations
- **Progress Tracking**: XP, streaks, completion
- **All UI Features**: Settings, themes, font size, etc.

### 📖 Mock Book Details:

- **Title**: The Great Banana Adventure
- **Chapters**: 2 complete chapters
- **Paragraphs**: 20+ with rich formatting
- **Languages**: English + Persian (فارسی)
- **Story**: Benny the Banana's adventure in Costa Rica rainforest

---

## 🔍 How It Works

```typescript
// Your hooks automatically use mock data when enabled
import { sanityClientCDNWithMock } from '@/lib/sanity/client-with-mock'

// This client checks NEXT_PUBLIC_USE_MOCK_DATA
// If true → Returns local data from lib/mock-data/banana-book.ts
// If false → Fetches from real Sanity
```

### Progressive Loading Still Works!

Even with mock data, your `use-chapter-loader.ts` hook:
- ✅ Loads Chapter 1 first
- ✅ Prefetches Chapter 2 at 60%
- ✅ Caches in IndexedDB
- ✅ Provides instant chapter transitions

---

## 🎯 When to Use Each Mode

### Use Mock Data Mode When:
- 🏠 Developing locally without internet
- 🧪 Testing features quickly
- 👥 Onboarding new developers
- 🐛 Debugging without Sanity complications
- 🚀 Prototyping new features

### Use Real Sanity When:
- 🌐 Deploying to production
- 📝 Testing with real content
- 👨‍💼 Client demos
- 📊 Testing with large datasets

---

## 🔄 Switching Between Modes

### Enable Mock Data:
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Disable Mock Data (Use Real Sanity):
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false

# Also add your Sanity credentials:
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
```

---

## 📁 Mock Data Files

```
lib/mock-data/
└── banana-book.ts          # Complete book data in TypeScript

lib/sanity/
└── client-with-mock.ts     # Smart client that switches modes

scripts/mock-data/
├── MOCK_DATA_banana-book.ndjson  # For importing to Sanity
└── README.md                     # Detailed documentation
```

---

## 🐛 Troubleshooting

### Mock data not loading?

1. **Check .env.local exists:**
```bash
ls -la .env.local
```

2. **Verify the setting:**
```bash
cat .env.local | grep MOCK
# Should show: NEXT_PUBLIC_USE_MOCK_DATA=true
```

3. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

4. **Check browser console:**
- Should see: `🎭 Using MOCK DATA (no Sanity required)`

### Book not found?

The mock book slug is: `the-great-banana-adventure`

Make sure you're visiting:
```
http://localhost:3000/books/the-great-banana-adventure
```

### Features not working?

Mock data supports ALL features! If something doesn't work:
1. Check browser console for errors
2. Verify you're using the correct book slug
3. Make sure `NEXT_PUBLIC_USE_MOCK_DATA=true` is set
4. Restart the dev server

---

## 🎉 Benefits

### For Developers:
- ⚡ **Instant setup** - No Sanity account needed
- 🏠 **Works offline** - No internet required
- 🧪 **Fast testing** - No API delays
- 🔒 **No credentials** - No security concerns

### For Testing:
- 📚 **Complete book** - Full bilingual content
- 🎨 **Rich formatting** - All text styles
- 🔄 **Progressive loading** - Real-world behavior
- 💾 **Offline caching** - IndexedDB works

### For Team:
- 👥 **Easy onboarding** - New devs start immediately
- 🚀 **Fast prototyping** - Test ideas quickly
- 🐛 **Easier debugging** - No external dependencies
- 💰 **Save costs** - No Sanity API usage

---

## 📝 Next Steps

1. ✅ Test with mock data locally
2. ✅ Verify all features work
3. ✅ When ready, import to Sanity:
   ```bash
   npx sanity dataset import scripts/mock-data/MOCK_DATA_banana-book.ndjson production
   ```
4. ✅ Switch to real Sanity mode
5. ✅ Deploy to production

---

**Happy coding! 🎉**

Questions? Check `scripts/mock-data/README.md` for more details.
