# Sanity CMS Setup for Ketab-Yar

This directory contains the Sanity Studio configuration and schema for the Ketab-Yar platform.

## 📁 Structure

```
sanity/
├── lib/
│   ├── client.ts       # Sanity client configuration
│   ├── fetch.ts        # Server-side data fetching utilities
│   └── queries.ts      # GROQ queries for content
├── schemaTypes/
│   ├── author.ts       # Author schema
│   ├── book.ts         # Book schema (main content type)
│   ├── blogPost.ts     # Blog post schema
│   ├── genre.ts        # Genre/category schema
│   └── index.ts        # Schema registry
├── env.ts              # Environment variable configuration
├── structure.ts        # Studio structure configuration
└── README.md           # This file
```

## 🚀 Getting Started

### 1. Environment Variables

Make sure you have these variables in your `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

### 2. Access Sanity Studio

The Sanity Studio is available at:
- **Local**: http://localhost:3000/Studio
- **Production**: https://your-domain.com/Studio

### 3. Create Your First Content

1. Navigate to `/Studio` in your browser
2. You'll see these content types:
   - **Books**: Main content (bilingual support)
   - **Authors**: Book authors
   - **Genres**: Book categories
   - **Blog Posts**: SEO content

## 📚 Content Types

### Book
The main content type for bilingual books:
- Title, subtitle, slug
- Author reference
- Cover image
- Summary
- Content (English & Persian)
- Genres (multiple)
- Publication info (year, ISBN, publisher)
- Settings (featured, premium, free preview pages)
- Status (draft/published/archived)

### Author
Author information:
- Name, slug
- Biography
- Photo
- Birth year, nationality

### Genre
Book categories:
- Name, slug
- Description

### Blog Post
SEO-focused blog content:
- Title, slug, excerpt
- Cover image
- Rich text content
- Author reference
- Publication date
- Status (draft/published)

## 🔍 Querying Data

### Server Components (Recommended)

```typescript
import { getBooks, getBookBySlug } from '@/sanity/lib/fetch'

// Get all published books
const books = await getBooks()

// Get specific book
const book = await getBookBySlug('atomic-habits')
```

### Client Components

```typescript
import { client } from '@/sanity/lib/client'
import { booksQuery } from '@/sanity/lib/queries'

const books = await client.fetch(booksQuery)
```

## 🎨 Customizing the Studio

### Adding New Fields

Edit the schema files in `sanity/schemaTypes/`:

```typescript
defineField({
  name: 'newField',
  title: 'New Field',
  type: 'string',
  validation: (Rule) => Rule.required(),
})
```

### Customizing Structure

Edit `sanity/structure.ts` to customize the Studio sidebar and navigation.

## 🔐 Security

- The Studio is protected by Sanity's authentication
- API tokens should be kept secret
- Use environment variables for sensitive data
- Enable CORS in Sanity dashboard for your domain

## 📖 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js Integration](https://www.sanity.io/docs/nextjs)
- [Schema Types](https://www.sanity.io/docs/schema-types)

## 🐛 Troubleshooting

### Studio not loading?
- Check environment variables are set correctly
- Verify project ID and dataset name
- Check browser console for errors

### Content not appearing?
- Ensure content status is "published"
- Check GROQ queries in `sanity/lib/queries.ts`
- Verify API token has read permissions

### Build errors?
- Run `npm run type-check` to check TypeScript errors
- Ensure all schema imports are correct
- Check Sanity CLI version compatibility

## 🎯 Next Steps

1. **Add Sample Content**: Create a few books, authors, and genres
2. **Test Queries**: Use the Vision plugin in Studio to test GROQ queries
3. **Integrate with Frontend**: Use the fetch utilities in your pages
4. **Customize Schema**: Add fields specific to your needs
5. **Set Up Webhooks**: For real-time updates (optional)

---

**Note**: This setup follows the Ketab-Yar architecture with bilingual support (English/Persian) and is optimized for the freemium book reading platform.
