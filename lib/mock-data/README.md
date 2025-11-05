# Mock Data System for Local Development

This folder contains a complete mock data system that allows you to test the Ketab-Yar app locally **without any Supabase connection**.

## 🎭 What's Included

### Sample Data
- **6 Books** with covers, authors, ratings, and reviews
- **Mock User** with XP, streak, and profile data
- **3 Comments/Reviews** on books
- **3 Vocabulary Words** saved by user
- **User Library** with reading progress (1 reading, 1 completed, 1 want-to-read)
- **Book Content** in English and Persian for testing the reader

### Features That Work
✅ Browse books on homepage  
✅ View book details  
✅ Read book content (with language toggle)  
✅ User dashboard with XP and streak  
✅ Library page with filters  
✅ Vocabulary list  
✅ Profile page  
✅ Comments and reviews  
✅ All UI components and animations  

## 🚀 How to Use

### 1. Enable Dev Mode
Make sure your `.env.local` has:
```env
NEXT_PUBLIC_DEV_MODE=true
```

### 2. Run the App
```bash
npm run dev
```

You'll see this message in console:
```
🎭 DEV MODE: Using mock Supabase with sample books, users, and data
```

### 3. Test Everything
- Browse books at `http://localhost:3001`
- View book details at `/books/atomic-habits`
- Read books at `/books/read/atomic-habits`
- Check dashboard at `/dashboard`
- View library at `/library`
- See vocabulary at `/vocabulary`

## 📝 Customizing Mock Data

### Add More Books
Edit `lib/mock-data/books.ts` and add to the `mockBooks` array:

```typescript
{
  id: '7',
  slug: 'your-book-slug',
  title: 'Your Book Title',
  author: { name: 'Author Name', ... },
  // ... other fields
}
```

### Add Book Content
Add to `mockBookContent` object:

```typescript
'7': {
  en: `Your English content here...`,
  fa: `محتوای فارسی شما اینجا...`,
}
```

### Change User Data
Edit `mockUser` in `books.ts`:

```typescript
export const mockUser = {
  name: 'Your Name',
  xp: 5000,
  current_streak: 30,
  // ... other fields
}
```

## 🗑️ Removing Mock Data for Production

When you're ready to deploy with real Supabase:

### Option 1: Delete the Folder
```bash
rm -rf lib/mock-data
```

Then update `lib/supabase/client.ts` and `lib/supabase/server.ts` to remove the import:
```typescript
// Remove this line:
import { createMockSupabaseClient } from '@/lib/mock-data/mock-supabase'
```

### Option 2: Just Disable Dev Mode
In `.env.local`:
```env
NEXT_PUBLIC_DEV_MODE=false
```

And add your real Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
```

The app will automatically use real Supabase instead of mocks.

## 🎨 Mock Data Structure

### Books
- Atomic Habits (Self-Help)
- The Great Gatsby (Classic)
- 1984 (Dystopian)
- Sapiens (History)
- The Alchemist (Fiction)
- Thinking, Fast and Slow (Psychology)

### User Stats
- XP: 1250
- Streak: 7 days
- Books Reading: 1
- Books Completed: 1
- Vocabulary Words: 3

## 💡 Tips

1. **Images**: Mock data uses Unsplash placeholder images. They work without any setup.

2. **Realistic Delays**: The mock client simulates network delays (50-300ms) so animations and loading states work properly.

3. **Filtering Works**: The mock client supports `.eq()`, `.order()`, `.limit()` and other Supabase query methods.

4. **No Database Needed**: Everything runs in memory. Refresh the page to reset data.

5. **Easy Testing**: Perfect for testing UI, animations, and user flows without backend setup.

## 🐛 Troubleshooting

### "Module not found" error
Make sure you're importing from the correct path:
```typescript
import { createMockSupabaseClient } from '@/lib/mock-data/mock-supabase'
```

### Mock data not showing
Check that `NEXT_PUBLIC_DEV_MODE=true` in `.env.local` and restart the dev server.

### Want to add authentication
The mock client has a simple auth system. It accepts any email/password and returns the mock user.

---

**Remember**: This is for local development only. Always use real Supabase in production!
