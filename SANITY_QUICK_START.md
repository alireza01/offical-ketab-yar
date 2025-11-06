# 🚀 Sanity CMS - Quick Start Guide
## Get up and running in 30 minutes

---

## ⚡ Super Quick Setup

### 1. Run Setup Script (5 minutes)

**Windows:**
```bash
npm run setup-sanity
```

**Linux/Mac:**
```bash
chmod +x scripts/setup-sanity.sh
./scripts/setup-sanity.sh
```

### 2. Get Sanity Credentials (5 minutes)

1. Go to https://www.sanity.io/manage
2. Click **Create Project**
3. Name: `ketab-yar-cms`
4. Dataset: `production`
5. Copy **Project ID**
6. Go to **API** → **Tokens** → **Add Token**
7. Name: `Admin Token`, Permissions: **Editor**
8. Copy token

### 3. Add to .env.local (2 minutes)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_ADMIN_TOKEN=sk...
```

### 4. Start Studio (1 minute)

```bash
npm run studio
```

Open: http://localhost:3333

### 5. Import Sample Book (2 minutes)

```bash
npm run import-books scripts/import-example.json
```

### 6. Publish in Studio (5 minutes)

1. Open http://localhost:3333
2. Go to **Books**
3. Click on "The Great Gatsby"
4. Review content
5. Click **Publish**

### 7. Test in Next.js (10 minutes)

Update `app/books/[slug]/page.tsx`:

```typescript
import { sanityClient } from '@/lib/sanity/client'
import { bookBySlugQuery } from '@/lib/sanity/queries'

export default async function BookPage({ params }) {
  const book = await sanityClient.fetch(bookBySlugQuery, {
    slug: params.slug
  })
  
  return <BookDetailClient book={book} />
}
```

Start dev server:
```bash
npm run dev
```

Visit: http://localhost:3000/books/the-great-gatsby

---

## 📚 Common Commands

```bash
# Start Sanity Studio
npm run studio

# Import books from JSON
npm run import-books path/to/books.json

# Deploy Studio to cloud
cd studio && npm run deploy

# Start Next.js dev server
npm run dev

# Build for production
npm run build
```

---

## 🎯 Next Steps

1. **Add More Books:**
   - Create JSON file with your books
   - Run import script
   - Review and publish in Studio

2. **Customize Schemas:**
   - Edit `studio/schemas/*.ts`
   - Restart studio to see changes

3. **Update Next.js Pages:**
   - Replace mock data with Sanity queries
   - Use `lib/sanity/queries.ts`

4. **Deploy:**
   - Deploy Studio: `cd studio && npm run deploy`
   - Deploy Next.js: `vercel deploy --prod`

---

## 📖 Full Documentation

- **Complete Guide:** `docs/SANITY_CMS_INTEGRATION.md`
- **Studio Guide:** `studio/README.md`
- **Summary Report:** `SANITY_CMS_COMPLETE.md`

---

## 🆘 Quick Troubleshooting

**Studio won't start:**
```bash
cd studio
rm -rf node_modules
npm install
npm run dev
```

**Import fails:**
- Check `SANITY_ADMIN_TOKEN` in `.env.local`
- Verify token has Editor permissions
- Check JSON file format

**Images not loading:**
- Add to `next.config.mjs`:
```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cdn.sanity.io' }
  ]
}
```

---

## ✅ Success Checklist

- [ ] Sanity Studio running at localhost:3333
- [ ] Sample book imported and published
- [ ] Next.js can fetch book from Sanity
- [ ] Images loading correctly
- [ ] Both EN and FA content displaying

---

**Time to Complete:** ~30 minutes  
**Difficulty:** Easy  
**Support:** Check full docs or ask agent team

**Ready? Run:** `npm run setup-sanity`
