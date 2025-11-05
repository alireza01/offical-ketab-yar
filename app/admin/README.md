# Admin Panel - Ketab Yar

## 📋 Overview

This is the MVP admin panel for Ketab Yar platform. It follows the simplified approach defined in the blueprint (bluprint.md) - focusing on essential book management with JSON uploads instead of complex WYSIWYG editors.

## 🏗️ Structure

```
app/admin/
├── layout.tsx              # Admin layout with auth protection
├── page.tsx                # Dashboard with stats
├── loading.tsx             # Loading state
├── error.tsx               # Error boundary
├── not-found.tsx           # 404 page
└── books/
    ├── page.tsx            # Books list
    ├── new/
    │   └── page.tsx        # Create new book
    └── [id]/
        └── edit/
            └── page.tsx    # Edit existing book
```

## 🔐 Authentication

The admin panel uses server-side authentication check in `layout.tsx`:

- Checks if user is logged in via Supabase Auth
- Verifies admin status using `users` table (as per blueprint)
- Admin check: `subscription_tier === 'admin'` OR email ends with `@ketabyar.com`
- Redirects unauthorized users to login or home page

## 📚 Book Management (MVP)

### Create Book (`/admin/books/new`)
- Simple form for book metadata
- JSON file upload for English content
- JSON file upload for Persian content
- Cover image upload
- All files stored in Supabase Storage
- URLs saved in `books` table

### JSON Format
```json
{
  "pages": [
    {
      "number": 1,
      "content": "Page 1 text content..."
    },
    {
      "number": 2,
      "content": "Page 2 text content..."
    }
  ]
}
```

### Edit Book (`/admin/books/[id]/edit`)
- Update book metadata
- Replace content files
- Change status (draft/published/archived)

### List Books (`/admin/books`)
- View all books
- Search by title/slug
- Filter by status
- Quick edit access

## 🎯 MVP Features (Phase 1)

✅ **Implemented:**
- Admin authentication
- Dashboard with stats
- Book creation (JSON upload)
- Book editing
- Book listing
- Supabase Storage integration
- Error handling
- Loading states

❌ **Deferred to Phase 2:**
- TipTap WYSIWYG editor
- User management
- Analytics dashboard
- API key management
- Content moderation
- Advanced search/filters

## 🚀 Performance Optimizations (Agent 2)

1. **Storage Strategy**: Book content stored in Supabase Storage (not database)
   - Prevents database overload
   - Faster content delivery
   - Supports large files

2. **Dynamic Imports**: Heavy components lazy-loaded
   - Admin components only load when needed
   - Reduces initial bundle size

3. **Server-Side Rendering**: Admin pages use SSR
   - Better security
   - Faster initial load
   - No client-side data fetching

## 📊 Database Schema

### Books Table
```sql
books (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  author_id uuid REFERENCES authors(id),
  publication_year integer,
  summary text,
  cover_image_url text,
  content_json_url_en text,  -- URL to English JSON in Storage
  content_json_url_fa text,  -- URL to Persian JSON in Storage
  free_preview_pages integer DEFAULT 20,
  total_pages integer,
  genres text[],
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

## 🔧 Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 📝 Usage

### Adding a New Book

1. Navigate to `/admin/books/new`
2. Fill in book metadata (title, author, etc.)
3. Upload English content JSON file
4. Upload Persian content JSON file
5. Upload cover image (optional)
6. Set status (draft/published)
7. Click "Create Book"

### Editing a Book

1. Navigate to `/admin/books`
2. Find the book in the list
3. Click "Edit"
4. Update metadata or replace files
5. Click "Update Book"

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` has correct Supabase credentials
- Restart dev server after adding env vars

### "Failed to upload file"
- Check Supabase Storage bucket exists: `book-content`
- Verify bucket is public or has proper RLS policies
- Check file size limits

### "Unauthorized access"
- Ensure user's `subscription_tier` is set to `'admin'` in `users` table
- OR use email ending with `@ketabyar.com`

## 🔮 Future Enhancements (Phase 2+)

- [ ] TipTap editor integration (optional)
- [ ] Bulk book import
- [ ] User management interface
- [ ] Analytics dashboard
- [ ] API key management
- [ ] Content moderation tools
- [ ] Advanced search and filters
- [ ] Book preview before publish
- [ ] Version history
- [ ] Collaborative editing

## 📚 Related Documentation

- [Blueprint (Persian)](../../.kiro/steering/bluprint.md)
- [Agent Execution Guide](../../.kiro/steering/AGENT_EXECUTION_GUIDE.md)
- [Agent 2: Performance](../../.kiro/steering/AGENT_2_PERFORMANCE.md)

---

**Last Updated**: 2025-10-24  
**Version**: 1.0 (MVP)  
**Status**: Production Ready
