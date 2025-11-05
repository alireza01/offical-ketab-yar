# Ketab-Yar API Documentation

Complete API reference for the Ketab-Yar platform.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Reading APIs (MVP)](#reading-apis-mvp)
- [Vocabulary APIs (MVP)](#vocabulary-apis-mvp)
- [Admin APIs](#admin-apis)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All authenticated endpoints require a valid Supabase session cookie.

### Register User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check your email to confirm your account",
  "requiresEmailConfirmation": true
}
```

**Validation Rules:**
- Email: Valid email format
- Password: Min 8 chars, must contain uppercase, lowercase, and number
- Name: Min 2 chars (optional)

**Rate Limit:** 5 requests per minute per IP

---

## 📖 Reading APIs (MVP)

### Get Reading Progress

**GET** `/api/reading/progress?bookId={uuid}`

Get user's reading progress for a specific book.

**Response:**
```json
{
  "progress": {
    "user_id": "uuid",
    "book_id": "uuid",
    "current_page": 45,
    "progress_percentage": 30,
    "status": "reading",
    "started_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
```

**Rate Limit:** 100 requests per minute

---

### Update Reading Progress

**POST** `/api/reading/progress`

Update user's reading progress.

**Request Body:**
```json
{
  "bookId": "uuid",
  "currentPage": 45,
  "totalPages": 150,
  "progressPercentage": 30
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "user_id": "uuid",
    "book_id": "uuid",
    "current_page": 45,
    "progress_percentage": 30,
    "status": "reading"
  }
}
```

**Rate Limit:** 200 requests per minute

---

### Get User XP

**GET** `/api/reading/xp`

Get user's current XP and level.

**Response:**
```json
{
  "xp": 450,
  "level": 5,
  "xpToNextLevel": 50
}
```

**Level Calculation:** Level = floor(XP / 100) + 1

**Rate Limit:** 100 requests per minute

---

### Award XP

**POST** `/api/reading/xp`

Award XP to user for reading activities.

**Request Body:**
```json
{
  "bookId": "uuid",
  "xpAmount": 10,
  "reason": "page_read" // page_read | chapter_complete | book_complete | streak_bonus
}
```

**Response:**
```json
{
  "success": true,
  "xp": 460,
  "xpAwarded": 10,
  "level": 5,
  "leveledUp": false,
  "reason": "page_read"
}
```

**XP Limits:** 1-1000 per request

**Rate Limit:** 50 requests per minute (stricter to prevent abuse)

---

### Get Reading Streak

**GET** `/api/reading/streak`

Get user's current daily reading streak.

**Response:**
```json
{
  "currentStreak": 7,
  "lastReadAt": "2025-01-15T12:00:00Z",
  "isStreakActive": true,
  "streakStatus": "active" // active | at_risk | none
}
```

**Streak Logic:**
- Active: Read within last 24 hours
- At Risk: Haven't read today but streak > 0
- None: No streak

**Rate Limit:** 100 requests per minute

---

### Update Reading Streak

**POST** `/api/reading/streak`

Update user's streak (called when user reads).

**Response:**
```json
{
  "success": true,
  "currentStreak": 8,
  "streakIncreased": true,
  "streakBroken": false,
  "lastReadAt": "2025-01-16T10:00:00Z"
}
```

**Streak Rules:**
- Same day: No change
- Next day: Increment streak
- Missed day: Reset to 1

**Rate Limit:** 20 requests per minute

---

## 📚 Vocabulary APIs (MVP)

### Get Vocabulary Words

**GET** `/api/vocabulary?bookId={uuid}&limit=100&offset=0`

Get user's saved vocabulary words.

**Query Parameters:**
- `bookId` (optional): Filter by book
- `limit` (optional): Max 100, default 100
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "words": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "word": "serendipity",
      "definition": "Finding something good without looking for it",
      "book_id": "uuid",
      "context": "It was pure serendipity that we met.",
      "mastery_level": 0,
      "created_at": "2025-01-15T12:00:00Z",
      "books": {
        "title": "Book Title",
        "slug": "book-slug"
      }
    }
  ],
  "total": 15,
  "limit": 20,
  "canAddMore": true
}
```

**Free Tier Limit:** 20 words

**Rate Limit:** 100 requests per minute

---

### Add Vocabulary Word

**POST** `/api/vocabulary`

Add a new word to vocabulary.

**Request Body:**
```json
{
  "word": "serendipity",
  "definition": "Finding something good without looking for it", // optional
  "bookId": "uuid", // optional
  "context": "It was pure serendipity that we met." // optional, max 500 chars
}
```

**Response:**
```json
{
  "success": true,
  "word": {
    "id": "uuid",
    "word": "serendipity",
    "definition": "...",
    "mastery_level": 0
  }
}
```

**Errors:**
- 403: Word limit reached (free tier)
- 409: Word already exists

**Rate Limit:** 50 requests per minute

---

### Delete Vocabulary Word

**DELETE** `/api/vocabulary?id={uuid}`

Delete a vocabulary word.

**Response:**
```json
{
  "success": true
}
```

**Rate Limit:** 50 requests per minute

---

## 📕 Book Content API (MVP)

### Load Book Content

**GET** `/api/books/content/[id]?language=en`

Load book content from Supabase Storage.

**Query Parameters:**
- `language`: `en` or `fa` (required)

**Response:**
```json
{
  "bookId": "uuid",
  "language": "en",
  "pages": [
    {
      "pageNumber": 1,
      "content": "Page 1 text content..."
    }
  ],
  "totalPages": 20,
  "fullBookPages": 150,
  "isPremium": false,
  "isPreview": true
}
```

**Free Preview:** Non-premium users get first 20 pages (configurable per book)

**Cache Headers:** 1 hour client, 24 hours CDN

**Rate Limit:** 50 requests per minute

---

## 🔧 Admin APIs

All admin endpoints require admin authentication (`subscription_tier = 'admin'` or email ends with `@ketabyar.com`).

### Create Book

**POST** `/api/admin/books`

Create a new book (multipart/form-data).

**Form Fields:**
- `title` (required)
- `author` (required)
- `description`
- `language` (required)
- `difficulty_level` (required)
- `is_published` (boolean)
- `cover` (file)

**Response:**
```json
{
  "id": "uuid",
  "title": "Book Title",
  "status": "published"
}
```

---

### List Books

**GET** `/api/admin/books?search=&language=&difficulty=&published=&sort=created_at&order=desc&page=1&limit=10`

List all books with filters.

**Response:**
```json
{
  "books": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

---

### Delete Book

**DELETE** `/api/admin/books?id={uuid}`

Delete a book and its cover image.

**Response:**
```json
{
  "success": true
}
```

---

### Site Settings (Phase 2+)

**GET/POST** `/api/admin/settings`

Manage site settings (coming in Phase 2).

---

### Email Settings (Phase 2+)

**GET/POST** `/api/admin/email-settings`

Manage SMTP settings (coming in Phase 2).

---

### API Keys (Phase 2+)

**POST** `/api/admin/api-keys`

Generate API keys (coming in Phase 2).

---

## 🔔 Webhooks

### Stripe Subscription Webhook

**POST** `/api/webhooks/subscription`

Handle Stripe subscription events (Phase 2+).

**Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Updates:** User's `subscription_tier` in `users` table

---

## ❌ Error Handling

All endpoints return consistent error format:

```json
{
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## ⏱️ Rate Limiting

Rate limits are applied per user ID (authenticated) or IP address (public endpoints).

**Limits:**
- Registration: 5/minute per IP
- Reading Progress: 200/minute
- XP Award: 50/minute
- Streak Update: 20/minute
- Vocabulary: 50/minute
- Book Content: 50/minute
- General: 100/minute

**Rate Limit Response:**
```json
{
  "error": "Too many requests"
}
```

**Implementation:** Simple in-memory for MVP. Use Redis/Vercel KV in production.

---

## 🔒 Security Features

1. **Authentication:** Supabase Auth with session cookies
2. **Authorization:** Role-based (admin vs user)
3. **Validation:** Zod schemas for all inputs
4. **Rate Limiting:** Prevent abuse
5. **Logging:** Centralized error logging
6. **CORS:** Configured for production domain

---

## 📊 Performance Optimizations

1. **Storage over Database:** Book content in Storage (1 request vs 500 queries)
2. **Caching:** CDN cache headers for book content
3. **Pagination:** All list endpoints support pagination
4. **Minimal Queries:** Optimized database queries
5. **Zero Server Load:** CSR for app, SSG for public pages

---

## 🚀 MVP vs Phase 2+

**MVP (Phase 1):**
- ✅ Reading Progress
- ✅ XP System
- ✅ Streak Tracking
- ✅ Vocabulary Management
- ✅ Book Content Loading
- ✅ User Registration
- ✅ Basic Admin (Books CRUD)

**Phase 2+:**
- ⏳ Stripe Payment Integration
- ⏳ API Keys Management
- ⏳ Email Settings
- ⏳ Site Settings
- ⏳ Advanced Admin Features

---

*Last Updated: 2025-10-24*  
*API Version: 1.0 (MVP)*
