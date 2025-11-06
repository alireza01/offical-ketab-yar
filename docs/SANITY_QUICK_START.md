# 🚀 Quick Start: Adding Content to Sanity Studio

## 📍 Step 1: Access Sanity Studio

1. Make sure your dev server is running: `npm run dev`
2. Open your browser and go to: **http://localhost:3000/Studio**
3. You'll see the Sanity Studio interface

---

## 👤 Step 2: Add an Author (Do This First!)

**Why first?** Books need authors, so create authors before books.

### Steps:
1. In the Studio sidebar, click **"Author"**
2. Click the **"+ Create"** button (top right)
3. Fill in the fields:

```
Name: James Clear
Slug: Click "Generate" button (it will create: james-clear)
Biography: American author and speaker focused on habits, decision making, and continuous improvement.
Photo: Click "Upload" and select an image
Birth Year: 1986
Nationality: American
```

4. Click **"Publish"** button (bottom right)

### ✅ Result:
You now have your first author! Repeat for more authors.

**Quick tip:** Create 3-5 authors first, then move to books.

---

## 📚 Step 3: Add a Genre (Optional but Recommended)

### Steps:
1. Click **"Genre"** in sidebar
2. Click **"+ Create"**
3. Fill in:

```
Name: Self-Help
Slug: Click "Generate" (creates: self-help)
Description: Books focused on personal development and improvement
```

4. Click **"Publish"**

### Common Genres to Add:
- Fiction
- Non-Fiction
- Self-Help
- Business
- Science Fiction
- Romance
- Mystery
- Biography

---

## 📖 Step 4: Add a Book

### Steps:
1. Click **"Book"** in sidebar
2. Click **"+ Create"**
3. Fill in the fields:

```
Title: Atomic Habits
Slug: Click "Generate" (creates: atomic-habits)
Subtitle: An Easy & Proven Way to Build Good Habits & Break Bad Ones
Author: Click and select "James Clear" (from dropdown)
Cover Image: Upload book cover image
Summary: 
  "Atomic Habits is a comprehensive guide to changing your habits 
   and getting 1% better every day. Learn how tiny changes can 
   lead to remarkable results."

Publication Year: 2018
ISBN: 978-0735211292
Publisher: Avery
Genres: Click and select "Self-Help" (can select multiple)
Language: Select "English" or "Bilingual"
Total Pages: 320
Free Preview Pages: 20 (default)

Content (English):
  Click in the text area and paste or type your book content.
  You can format text with the toolbar (bold, italic, headings, etc.)

Content (Persian):
  If bilingual, add Persian translation here

Status: Select "Published" (or "Draft" if not ready)
Featured: Toggle ON if you want it on homepage
Premium Only: Toggle ON if it requires subscription
```

4. Click **"Publish"**

### ✅ Result:
Your first book is live! It will appear on your website.

---

## 📝 Step 5: Add a Blog Post

### Steps:
1. Click **"Blog Post"** in sidebar
2. Click **"+ Create"**
3. Fill in:

```
Title: Top 10 Books for Building Better Habits
Slug: Click "Generate"
Excerpt: 
  "Discover the best books that will help you build lasting 
   habits and transform your life."

Cover Image: Upload a blog cover image
Content: 
  Write your blog post here. Use the rich text editor to:
  - Add headings (H2, H3)
  - Format text (bold, italic)
  - Add lists
  - Insert links

Author: Select an author
Published At: Click calendar and select date/time
Status: Select "Published"
```

4. Click **"Publish"**

---

## 🎯 Quick Workflow for Adding Multiple Books

### Efficient Process:

**Day 1: Setup Authors & Genres**
1. Add 5-10 authors
2. Add 8-10 genres

**Day 2-3: Add Books**
1. Create book entry
2. Fill basic info (title, author, summary)
3. Upload cover image
4. Set to "Draft" status
5. Repeat for 10-20 books

**Day 4: Add Content**
1. Go back to each book
2. Add full content (English/Persian)
3. Change status to "Published"

---

## 🔍 Finding Your Content

### In Studio:
- Click any content type in sidebar
- You'll see a list of all items
- Click any item to edit
- Use search bar to find specific content

### On Your Website:
- Books appear at: `/books/[slug]`
- Authors appear at: `/authors/[slug]`
- Blog posts appear at: `/blog/[slug]`

---

## 💡 Pro Tips

### 1. Use "Generate" for Slugs
Always click the "Generate" button for slugs - it creates SEO-friendly URLs automatically.

### 2. Start with Draft
Create books as "Draft" first, then publish when content is complete.

### 3. Featured Books
Toggle "Featured" ON for your best 5-10 books - they'll appear on the homepage.

### 4. Free Preview Pages
Set this to 20-30 pages for free users. They can read this much before hitting the paywall.

### 5. Premium Strategy
- Mark your best/newest books as "Premium Only"
- Keep 2-3 popular books completely free
- This creates the "hook" for free users

### 6. Bilingual Content
For bilingual books:
- Set Language to "Bilingual"
- Fill both "Content (English)" and "Content (Persian)"
- Users can toggle between languages in the reader

### 7. Cover Images
- Use high-quality images (at least 600x900px)
- Keep file size under 500KB
- Use JPG or PNG format

---

## 🐛 Common Issues

### "Author not found in dropdown"
**Solution:** Make sure you published the author first. Refresh the page.

### "Slug already exists"
**Solution:** Change the title slightly or manually edit the slug.

### "Image won't upload"
**Solution:** Check file size (max 10MB) and format (JPG, PNG, WebP).

### "Content not showing on website"
**Solution:** 
1. Make sure Status is "Published"
2. Clear your browser cache
3. Restart dev server

---

## 📊 Recommended Content for MVP

### Phase 1 (Week 1):
- ✅ 5 Authors
- ✅ 8 Genres
- ✅ 10 Books (3 free, 7 premium)
- ✅ 3 Blog Posts

### Phase 2 (Week 2-3):
- ✅ 10 more Authors
- ✅ 30 more Books
- ✅ 10 Blog Posts

### Phase 3 (Month 2):
- ✅ 50+ Books total
- ✅ 20+ Blog Posts
- ✅ Regular content updates

---

## 🎨 Content Strategy

### Free Books (Hook Users):
1. One bestseller (e.g., "Atomic Habits")
2. One classic (e.g., "Pride and Prejudice")
3. One popular fiction (e.g., "The Alchemist")

### Premium Books:
- Latest releases
- Exclusive content
- Full series
- Advanced topics

### Blog Posts (SEO):
- "Top 10 Books for [Topic]"
- "How to Learn English by Reading [Book]"
- Book reviews and summaries
- Reading tips and strategies

---

## ✅ Checklist: Your First Book

- [ ] Author created and published
- [ ] Genre created and published
- [ ] Book title and slug set
- [ ] Author selected from dropdown
- [ ] Cover image uploaded
- [ ] Summary written (3-5 sentences)
- [ ] Genre(s) selected
- [ ] Language set (English/Bilingual)
- [ ] Total pages set
- [ ] Free preview pages set (20-30)
- [ ] Content added (at least first chapter)
- [ ] Status set to "Published"
- [ ] Featured toggle set (if applicable)
- [ ] Premium toggle set (if applicable)
- [ ] Published!

---

## 🚀 Next Steps

After adding your first content:

1. **Test on Website**: Visit `/books/your-book-slug` to see it live
2. **Add More Content**: Aim for 10-20 books minimum
3. **Write Blog Posts**: For SEO and user engagement
4. **Set Up Freemium**: Mark which books are free vs premium
5. **Monitor**: Use Sanity's built-in analytics

---

**Need Help?** Check the main README at `sanity/README.md` for more technical details.

**Ready to Start?** Go to http://localhost:3000/Studio and create your first author! 🎉
