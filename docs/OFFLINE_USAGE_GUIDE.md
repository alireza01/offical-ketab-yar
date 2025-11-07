# Offline-First System Usage Guide
## For Developers & Users

---

## 🚀 Quick Start

### For Users:

1. **Visit the site** - No login required!
2. **Browse books** - Explore the library
3. **Like books** - Click the heart ❤️ button
4. **Read books** - Start reading immediately
5. **Save words** - Build your vocabulary
6. **Works offline** - Everything saves locally

### When you're ready:
- **Login** - Your offline data syncs automatically
- **Check sync status** - Click the cloud icon in header
- **View liked books** - See them in your dashboard

---

## 💻 For Developers

### Using the Offline Storage:

```typescript
import { likedBooks, vocabulary, readingProgress } from '@/lib/storage/offline-storage'

// Like a book
await likedBooks.add({
  book_id: 'book-123',
  book_slug: 'atomic-habits',
  book_title: 'Atomic Habits',
  book_cover: '/covers/atomic-habits.jpg'
})

// Check if liked
const isLiked = await likedBooks.isLiked('book-123')

// Get all liked books
const allLiked = await likedBooks.getAll()

// Save vocabulary
await vocabulary.add({
  word: 'serendipity',
  definition: 'Finding something good without looking for it',
  context: 'It was pure serendipity that we met.',
  book_id: 'book-123',
  page_number: 42
})

// Save reading progress
await readingProgress.save({
  book_id: 'book-123',
  current_page: 42,
  total_pages: 200,
  progress_percentage: 21
})
```

### Using the Liked Books Hook:

```typescript
import { useLikedBooks } from '@/hooks/use-liked-books'

function BookCard({ book }) {
  const { isLiked, toggleLike } = useLikedBooks()
  const liked = isLiked(book.id) // Synchronous check
  
  return (
    <div>
      <h3>{book.title}</h3>
      <button onClick={() => toggleLike(book)}>
        {liked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </div>
  )
}
```

### Using the Like Button Component:

```typescript
import { LikeButton } from '@/components/books/like-button'

function BookCard({ book }) {
  return (
    <div>
      <h3>{book.title}</h3>
      <LikeButton 
        book={book}
        variant="ghost"
        size="icon"
        showLabel={false}
      />
    </div>
  )
}
```

### Triggering Manual Sync:

```typescript
import { syncOfflineData } from '@/lib/storage/sync-manager'

// Trigger sync
await syncOfflineData()

// With user ID
await syncOfflineData(userId)
```

### Listening to Sync Progress:

```typescript
import { onSyncProgress } from '@/lib/storage/sync-manager'

useEffect(() => {
  const unsubscribe = onSyncProgress((progress) => {
    console.log(`Syncing: ${progress.synced}/${progress.total}`)
    console.log(`Status: ${progress.status}`)
    console.log(`Message: ${progress.message}`)
  })
  
  return unsubscribe
}, [])
```

### Getting Sync Status:

```typescript
import { getSyncStatus } from '@/lib/storage/sync-manager'

const status = await getSyncStatus()
console.log(`Unsynced items: ${status.unsyncedCount}`)
console.log(`Online: ${status.isOnline}`)
```

---

## 🎨 UI Components

### Sync Indicator:
```typescript
import { SyncIndicator } from '@/components/sync/sync-indicator'

// Add to header
<SyncIndicator />
```

Shows:
- Unsynced count badge
- Offline indicator
- Sync progress
- Manual sync button

### Like Button:
```typescript
import { LikeButton } from '@/components/books/like-button'

<LikeButton 
  book={{
    id: 'book-123',
    slug: 'atomic-habits',
    title: 'Atomic Habits',
    cover_url: '/covers/atomic-habits.jpg'
  }}
  variant="ghost"  // or "default" | "outline"
  size="icon"      // or "default" | "sm" | "lg"
  showLabel={false} // Show "افزودن به علاقه‌مندی‌ها" text
/>
```

Features:
- Heart animation
- Particle effect
- Works offline
- Auto-syncs

---

## 🔧 Advanced Usage

### Custom Sync Logic:

```typescript
import { getSyncQueue, removeSyncQueueItem } from '@/lib/storage/offline-storage'

// Get pending sync items
const queue = await getSyncQueue()

// Process manually
for (const item of queue) {
  try {
    // Your custom sync logic
    await myCustomSync(item)
    
    // Remove from queue
    await removeSyncQueueItem(item.id!)
  } catch (error) {
    console.error('Sync failed:', error)
  }
}
```

### Clear Offline Data:

```typescript
import { clearAllOfflineData } from '@/lib/storage/offline-storage'

// Clear everything (use with caution!)
await clearAllOfflineData()
```

### Check Unsynced Count:

```typescript
import { getUnsyncedCount } from '@/lib/storage/offline-storage'

const count = await getUnsyncedCount()
console.log(`${count} items need syncing`)
```

---

## 🐛 Debugging

### Check IndexedDB:
1. Open Chrome DevTools
2. Go to **Application** tab
3. Click **IndexedDB** → **ketab-yar-offline**
4. Inspect stores: `liked_books`, `vocabulary`, `reading_progress`, `sync_queue`

### Check Sync Queue:
```typescript
import { getSyncQueue } from '@/lib/storage/offline-storage'

const queue = await getSyncQueue()
console.log('Pending syncs:', queue)
```

### Test Offline Mode:
1. Open DevTools
2. Go to **Network** tab
3. Select **Offline** from throttling dropdown
4. Try liking a book, saving a word
5. Go back **Online**
6. Watch sync happen automatically

### Monitor Sync Events:
```typescript
// Add to your component
useEffect(() => {
  const unsubscribe = onSyncProgress((progress) => {
    console.log('Sync progress:', progress)
  })
  return unsubscribe
}, [])
```

---

## 📱 Mobile Testing

### iOS Safari:
1. Open site in Safari
2. Tap **Share** button
3. Tap **Add to Home Screen**
4. Open from home screen
5. Works like native app!

### Android Chrome:
1. Open site in Chrome
2. Tap **Menu** (3 dots)
3. Tap **Add to Home Screen**
4. Open from home screen
5. Works like native app!

### Test Offline:
1. Enable **Airplane Mode**
2. Open app
3. Like books, save words
4. Disable **Airplane Mode**
5. Watch sync happen

---

## 🎯 Best Practices

### For Developers:

1. **Always use offline storage first**
   ```typescript
   // ✅ Good
   await likedBooks.add(book)
   
   // ❌ Bad
   await supabase.from('user_library').insert(...)
   ```

2. **Let sync manager handle Supabase**
   ```typescript
   // ✅ Good - sync manager handles it
   await likedBooks.add(book)
   
   // ❌ Bad - manual Supabase call
   await likedBooks.add(book)
   await supabase.from('user_library').insert(...)
   ```

3. **Check auth status before Supabase calls**
   ```typescript
   const { data: { user } } = await supabase.auth.getUser()
   if (user) {
     // Only then call Supabase
   }
   ```

4. **Use hooks for common operations**
   ```typescript
   // ✅ Good
   const { toggleLike, isLiked } = useLikedBooks()
   
   // ❌ Bad
   import { likedBooks } from '@/lib/storage/offline-storage'
   // Manual operations
   ```

### For Users:

1. **Login to backup data** - Your offline data syncs to cloud
2. **Check sync indicator** - Make sure everything is synced
3. **Use offline mode** - App works without internet
4. **Add to home screen** - Better mobile experience

---

## 🚨 Troubleshooting

### Sync Not Working:
1. Check if online: `navigator.onLine`
2. Check sync queue: `await getSyncQueue()`
3. Check console for errors
4. Try manual sync: `await syncOfflineData()`

### Data Not Persisting:
1. Check IndexedDB in DevTools
2. Verify browser supports IndexedDB
3. Check storage quota
4. Clear cache and try again

### Liked Books Not Showing:
1. Check if data in IndexedDB
2. Reload page
3. Check console for errors
4. Try unliking and liking again

### Sync Indicator Not Updating:
1. Check if `onSyncProgress` is registered
2. Verify sync is actually running
3. Check console for errors
4. Refresh page

---

## 📚 API Reference

### Offline Storage API:

```typescript
// Liked Books
likedBooks.add(book)
likedBooks.remove(bookId)
likedBooks.getAll()
likedBooks.isLiked(bookId)
likedBooks.markSynced(bookId)

// Reading Progress
readingProgress.save(progress)
readingProgress.get(bookId)
readingProgress.getAll()
readingProgress.markSynced(bookId)

// Vocabulary
vocabulary.add(word)
vocabulary.getAll()
vocabulary.getByBook(bookId)
vocabulary.markSynced(id)

// Highlights
highlights.add(highlight)
highlights.getByBook(bookId)
highlights.markSynced(id)

// Sync Queue
getSyncQueue()
clearSyncQueue()
removeSyncQueueItem(id)
getUnsyncedCount()
clearAllOfflineData()
```

### Sync Manager API:

```typescript
// Sync
syncOfflineData(userId?)

// Progress
onSyncProgress(callback)

// Status
getSyncStatus()
```

---

## 🎉 Success!

You now have a fully functional offline-first system that:
- ✅ Works without authentication
- ✅ Syncs automatically
- ✅ Provides instant feedback
- ✅ Handles conflicts
- ✅ Shows sync status
- ✅ Works on mobile
- ✅ Persists across sessions

Happy coding! 🚀
