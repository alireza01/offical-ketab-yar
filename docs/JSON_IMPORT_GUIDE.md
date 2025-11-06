# 📥 JSON Import Guide for Ketab-Yar
## How to Import Books from JSON Files

---

## 🎯 Overview

You can prepare your book content in JSON format and import it directly into Sanity. This is much faster than typing everything in the Studio.

### Benefits
- ✅ Prepare content offline
- ✅ Use your favorite text editor
- ✅ Version control with Git
- ✅ Batch import multiple books
- ✅ Easy to backup and restore

---

## 📝 JSON Structure Explained

### Complete Book Structure

```json
{
  "_type": "book",
  "title": { "en": "English Title", "fa": "عنوان فارسی" },
  "slug": { "_type": "slug", "current": "book-slug" },
  "subtitle": { "en": "English Subtitle", "fa": "زیرعنوان فارسی" },
  "author": { "_type": "reference", "_ref": "author-id" },
  "coverImage": { ... },
  "summary": { "en": "...", "fa": "..." },
  "chapters": [ ... ],
  "seoTitle": { "en": "...", "fa": "..." },
  "seoDescription": { "en": "...", "fa": "..." },
  "status": "published"
}
```

---

## 📖 Chapter Structure

Each chapter contains bilingual paragraphs:

```json
{
  "_type": "chapter",
  "_key": "chapter-1",
  "title": {
    "en": "Chapter Title in English",
    "fa": "عنوان فصل به فارسی"
  },
  "chapterNumber": 1,
  "content": [
    {
      "_type": "bilingualParagraph",
      "_key": "para-1-1",
      "english": [ ... ],
      "farsi": [ ... ],
      "alignment": "justify",
      "pageBreakAfter": false
    }
  ]
}
```

---

## 🎨 Text Formatting

### Normal Text

```json
{
  "_type": "block",
  "style": "normal",
  "children": [
    {
      "_type": "span",
      "text": "This is normal text."
    }
  ]
}
```

### Bold Text

```json
{
  "_type": "span",
  "text": "This is bold",
  "marks": ["strong"]
}
```

### Italic Text

```json
{
  "_type": "span",
  "text": "This is italic",
  "marks": ["em"]
}
```

### Bold + Italic

```json
{
  "_type": "span",
  "text": "This is bold and italic",
  "marks": ["strong", "em"]
}
```

### Underline

```json
{
  "_type": "span",
  "text": "This is underlined",
  "marks": ["underline"]
}
```

### Strikethrough

```json
{
  "_type": "span",
  "text": "This is crossed out",
  "marks": ["strike-through"]
}
```

---

## 📐 Paragraph Styles

### Normal Paragraph

```json
{
  "_type": "block",
  "style": "normal",
  "children": [ ... ]
}
```

### Heading 1

```json
{
  "_type": "block",
  "style": "h1",
  "children": [
    { "_type": "span", "text": "Main Heading" }
  ]
}
```

### Heading 2

```json
{
  "_type": "block",
  "style": "h2",
  "children": [
    { "_type": "span", "text": "Section Heading" }
  ]
}
```

### Heading 3

```json
{
  "_type": "block",
  "style": "h3",
  "children": [
    { "_type": "span", "text": "Subsection Heading" }
  ]
}
```

### Blockquote

```json
{
  "_type": "block",
  "style": "blockquote",
  "children": [
    { "_type": "span", "text": "This is a quote." }
  ]
}
```

---

## 🔗 Links

```json
{
  "_type": "span",
  "text": "Click here",
  "marks": [
    {
      "_type": "link",
      "href": "https://example.com"
    }
  ]
}
```

---

## 🖼️ Images

```json
{
  "_type": "image",
  "_key": "img-1",
  "asset": {
    "_type": "reference",
    "_ref": "image-asset-id"
  },
  "alt": "Image description",
  "caption": {
    "en": "English caption",
    "fa": "توضیح فارسی"
  }
}
```

**Note**: You need to upload images to Sanity first and get their asset IDs.

---

## 📏 Text Alignment

```json
{
  "_type": "bilingualParagraph",
  "alignment": "justify",  // Options: "left", "center", "right", "justify"
  "pageBreakAfter": false  // Set to true for page break
}
```

---

## 🔄 Complete Example with All Features

See `example-book.json` in the project root for a complete example with:
- ✅ Bold, italic, underline text
- ✅ Headings (H1, H2, H3)
- ✅ Blockquotes
- ✅ Links
- ✅ Images
- ✅ Multiple chapters
- ✅ Page breaks
- ✅ Different alignments

---

## 🚀 How to Import

### Step 1: Prepare Your JSON File

Create a file like `my-book.json` with your book content.

### Step 2: Create Author & Genres First

Before importing, make sure you have:
1. Created the author in Sanity Studio
2. Created the genres
3. Note their IDs (you'll need them in the JSON)

**To get Author ID:**
```bash
# In Sanity Studio, go to Authors
# Click on the author
# Look at the URL: /studio/author;author-james-clear
# The ID is: author-james-clear
```

### Step 3: Run Import Script

```bash
npx ts-node scripts/import-book-from-json.ts my-book.json
```

### Step 4: Verify in Sanity Studio

1. Open Sanity Studio: http://localhost:3000/studio
2. Go to Books
3. Find your imported book
4. Check all chapters and formatting

---

## 🛠️ Tools to Help You

### 1. Convert Word/Google Docs to JSON

Create a simple converter script:

```typescript
// scripts/word-to-json.ts
// This is a template - you'll need to customize it

import * as fs from 'fs'

function convertWordToJSON(textFile: string) {
  const content = fs.readFileSync(textFile, 'utf-8')
  const lines = content.split('\n')
  
  const chapters: any[] = []
  let currentChapter: any = null
  let paragraphCounter = 0
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      // New chapter
      if (currentChapter) chapters.push(currentChapter)
      currentChapter = {
        _type: 'chapter',
        _key: `chapter-${chapters.length + 1}`,
        title: { en: line.replace('# ', ''), fa: '' },
        chapterNumber: chapters.length + 1,
        content: []
      }
      paragraphCounter = 0
    } else if (line.trim() && currentChapter) {
      // New paragraph
      paragraphCounter++
      currentChapter.content.push({
        _type: 'bilingualParagraph',
        _key: `para-${currentChapter.chapterNumber}-${paragraphCounter}`,
        english: [{
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: line }]
        }],
        farsi: [{
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: '' }]
        }],
        alignment: 'justify',
        pageBreakAfter: false
      })
    }
  }
  
  if (currentChapter) chapters.push(currentChapter)
  
  return {
    _type: 'book',
    title: { en: 'My Book', fa: '' },
    slug: { _type: 'slug', current: 'my-book' },
    chapters
  }
}
```

### 2. Validate JSON Before Import

```bash
# Check if JSON is valid
node -e "console.log(JSON.parse(require('fs').readFileSync('my-book.json', 'utf-8')))"
```

---

## 📋 JSON Template Generator

Use this template to start:

```json
{
  "_type": "book",
  "title": {
    "en": "YOUR_BOOK_TITLE_EN",
    "fa": "YOUR_BOOK_TITLE_FA"
  },
  "slug": {
    "_type": "slug",
    "current": "your-book-slug"
  },
  "author": {
    "_type": "reference",
    "_ref": "AUTHOR_ID_HERE"
  },
  "summary": {
    "en": "Book summary in English...",
    "fa": "خلاصه کتاب به فارسی..."
  },
  "publishYear": 2024,
  "genres": [
    { "_type": "reference", "_ref": "GENRE_ID_HERE" }
  ],
  "level": "intermediate",
  "chapters": [
    {
      "_type": "chapter",
      "_key": "chapter-1",
      "title": {
        "en": "Chapter 1 Title",
        "fa": "عنوان فصل ۱"
      },
      "chapterNumber": 1,
      "content": [
        {
          "_type": "bilingualParagraph",
          "_key": "para-1-1",
          "english": [
            {
              "_type": "block",
              "style": "normal",
              "children": [
                { "_type": "span", "text": "Your English text here..." }
              ]
            }
          ],
          "farsi": [
            {
              "_type": "block",
              "style": "normal",
              "children": [
                { "_type": "span", "text": "متن فارسی شما اینجا..." }
              ]
            }
          ],
          "alignment": "justify",
          "pageBreakAfter": false
        }
      ]
    }
  ],
  "freePreviewPages": 20,
  "isPremium": true,
  "featured": false,
  "status": "draft"
}
```

---

## ⚠️ Common Mistakes

### 1. Missing `_key` Fields

❌ **Wrong:**
```json
{
  "_type": "chapter",
  "title": { ... }
}
```

✅ **Correct:**
```json
{
  "_type": "chapter",
  "_key": "chapter-1",
  "title": { ... }
}
```

### 2. Wrong Text Structure

❌ **Wrong:**
```json
"english": "Just a string"
```

✅ **Correct:**
```json
"english": [
  {
    "_type": "block",
    "style": "normal",
    "children": [
      { "_type": "span", "text": "Text here" }
    ]
  }
]
```

### 3. Missing Both Languages

❌ **Wrong:**
```json
"title": { "en": "Only English" }
```

✅ **Correct:**
```json
"title": {
  "en": "English Title",
  "fa": "عنوان فارسی"
}
```

---

## 🎓 Advanced Tips

### 1. Batch Import Multiple Books

```bash
for file in books/*.json; do
  npx ts-node scripts/import-book-from-json.ts "$file"
done
```

### 2. Export Existing Book to JSON

```typescript
// scripts/export-book-to-json.ts
import { sanityClient } from '@/lib/sanity/client'
import * as fs from 'fs'

async function exportBook(slug: string) {
  const book = await sanityClient.fetch(
    `*[_type == "book" && slug.current == $slug][0]`,
    { slug }
  )
  
  fs.writeFileSync(
    `${slug}.json`,
    JSON.stringify(book, null, 2)
  )
}
```

### 3. Validate Before Import

Create a validation script to check your JSON:

```typescript
function validateBookJSON(data: any): string[] {
  const errors: string[] = []
  
  if (!data.title?.en) errors.push('Missing title.en')
  if (!data.title?.fa) errors.push('Missing title.fa')
  if (!data.slug?.current) errors.push('Missing slug.current')
  if (!data.chapters?.length) errors.push('No chapters found')
  
  data.chapters?.forEach((chapter: any, i: number) => {
    if (!chapter._key) errors.push(`Chapter ${i + 1} missing _key`)
    if (!chapter.title?.en) errors.push(`Chapter ${i + 1} missing title.en`)
    if (!chapter.title?.fa) errors.push(`Chapter ${i + 1} missing title.fa`)
  })
  
  return errors
}
```

---

## 📚 Resources

- **Example File**: `example-book.json` (complete working example)
- **Import Script**: `scripts/import-book-from-json.ts`
- **Sanity Docs**: https://www.sanity.io/docs/importing-data

---

## 🆘 Troubleshooting

### Error: "Author not found"

**Solution**: Create the author in Sanity Studio first, then use their ID in your JSON.

### Error: "Invalid JSON"

**Solution**: Validate your JSON at https://jsonlint.com/

### Error: "Missing _key"

**Solution**: Add unique `_key` to all chapters and paragraphs.

### Import succeeds but text looks wrong

**Solution**: Check that you're using the correct Portable Text structure (blocks with children).

---

**Last Updated**: 2025-11-06  
**Version**: 1.0

