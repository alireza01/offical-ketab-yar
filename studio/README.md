# 🎨 Ketab-Yar Sanity Studio

This is the Sanity Studio for managing content in the Ketab-Yar platform.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
```

Get your credentials from: https://www.sanity.io/manage

### 3. Start Studio

```bash
npm run dev
```

Studio will be available at: http://localhost:3333

### 4. Deploy Studio (Optional)

```bash
npm run deploy
```

Your studio will be hosted at: `https://your-project.sanity.studio`

---

## 📚 Content Types

### Books
- **Title**: Bilingual (EN/FA)
- **Author**: Reference to author document
- **Chapters**: Array of chapter objects with bilingual paragraphs
- **Metadata**: ISBN, publisher, genres, level
- **Settings**: Free preview pages, premium status, featured

### Authors
- **Name**: Author full name
- **Bio**: Bilingual rich text
- **Photo**: Author image
- **Metadata**: Nationality, birth year, website, social media

### Blog Posts
- **Title**: Bilingual
- **Content**: Bilingual rich text with internal linking
- **Author**: Reference to author
- **Related Books**: Array of book references
- **Categories**: Tags for organization

---

## 🎯 Workflow

### Adding a New Book

1. **Create Author** (if doesn't exist)
   - Go to **Authors** section
   - Click **Create**
   - Fill in name, bio, photo
   - Click **Publish**

2. **Create Book**
   - Go to **Books** section
   - Click **Create**
   - Fill in metadata (title, author, year, etc.)
   - Add cover image
   - Add chapters with bilingual content
   - **Save as Draft** (don't publish yet)

3. **Preview & Edit**
   - Review content in preview mode
   - Fix any formatting issues
   - Add missing translations
   - Upload better cover image if needed

4. **Publish**
   - When ready, click **Publish**
   - Book will appear on website immediately

### Bulk Import

For importing multiple books at once, use the import script:

```bash
# From project root
node scripts/import-book.mjs path/to/books.json
```

Books will be created as **DRAFTS** for review before publishing.

---

## 🔧 Customization

### Adding New Fields

Edit schema files in `schemas/` folder:

```typescript
// schemas/book.ts
{
  name: 'newField',
  title: 'New Field',
  type: 'string',
  validation: (Rule) => Rule.required(),
}
```

### Custom Preview

Customize document preview in schema:

```typescript
preview: {
  select: {
    title: 'title.en',
    subtitle: 'author.name',
    media: 'coverImage',
  },
  prepare({ title, subtitle, media }) {
    return {
      title,
      subtitle,
      media,
    }
  },
}
```

### Custom Structure

Edit `sanity.config.ts` to customize sidebar structure.

---

## 📊 Content Guidelines

### Book Content

**Chapter Structure:**
- Each chapter should have a clear title
- Paragraphs should be aligned (EN/FA)
- Keep paragraphs reasonably short (3-5 sentences)
- Use proper punctuation

**Translations:**
- Ensure both EN and FA are complete
- Maintain consistent tone
- Preserve formatting (bold, italic)

**Images:**
- Cover images: 400x600px minimum
- Chapter images: 800px width minimum
- Use descriptive alt text
- Add captions when relevant

### Author Bios

- Keep bios concise (2-3 paragraphs)
- Include notable works
- Add publication dates
- Link to official website/social media

### Blog Posts

- Use clear, descriptive titles
- Add relevant categories
- Link to related books (internal linking)
- Include featured image
- Write engaging summaries

---

## 🐛 Troubleshooting

### Studio won't start

**Check:**
- `.env` file exists with correct credentials
- Dependencies installed (`npm install`)
- Port 3333 is not in use

### Can't publish documents

**Check:**
- You have Editor permissions
- Token is not expired
- All required fields are filled

### Images not uploading

**Check:**
- Image file size < 10MB
- Image format is supported (JPG, PNG, WebP)
- You have storage quota remaining

---

## 📞 Support

**Sanity Documentation:**
- https://www.sanity.io/docs

**Schema Reference:**
- https://www.sanity.io/docs/schema-types

**GROQ Query Language:**
- https://www.sanity.io/docs/groq

**Community:**
- https://slack.sanity.io

---

## 🎯 Best Practices

1. **Always save as draft first** - Review before publishing
2. **Use descriptive slugs** - Good for SEO
3. **Add alt text to images** - Accessibility & SEO
4. **Keep content organized** - Use consistent naming
5. **Preview on mobile** - Ensure responsive content
6. **Backup regularly** - Export content periodically

---

**Version:** 1.0  
**Last Updated:** 2025-01-24  
**Maintained by:** Ketab-Yar Team
