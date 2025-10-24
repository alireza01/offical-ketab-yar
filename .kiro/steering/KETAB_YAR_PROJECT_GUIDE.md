# Ketab Yar - Ultimate Online Book Reading Platform
## Complete Project Guide & Requirements

---

## 🎯 Project Vision

Build a **modern, premium online book reading platform** with bilingual support (English/Persian) that rivals Netflix and other streaming services in design quality and user experience. The platform should feel sophisticated, smooth, and engaging with a primary color scheme based on **gold/beige tones** (not bright yellow, but elegant warm tones).

---

## 🎨 Design Philosophy

### Visual Identity
- **Primary Color**: Elegant gold/beige (#D4AF37, #C9A961, #B8956A range)
- **Design Inspiration**: Netflix, Disney+, Apple TV+ - premium streaming service aesthetic
- **Modern & Clean**: Minimalist with purposeful animations
- **Dark Mode**: Fully supported with elegant transitions
- **Responsive**: Flawless experience on desktop, tablet, and mobile

### Animation Standards
- Smooth, satisfying transitions (Framer Motion)
- Page turn animations that feel realistic
- Micro-interactions on hover/click
- Loading states that don't feel jarring
- Scroll-triggered animations for engagement

---

## 📚 Core Features

### 1. Landing Page
**Purpose**: Showcase the platform and available books

**Components**:
- Hero section with compelling CTA
- Featured books carousel
- Genre sections with book grids
- "How it works" section
- Testimonials/reviews
- Footer with links

**Book Display**:
- Book covers with hover effects
- Genre tags
- Rating display
- Quick preview on hover

**Navigation**:
- Click book → Go to book detail page
- Genre filtering
- Search functionality

---

### 2. Book Detail Page
**Information Displayed**:
- Book cover (large, high-quality)
- Title and subtitle
- Author name (clickable to author page)
- Publication year
- Genre/categories
- Average rating (stars + number)
- Summary/description
- Page count
- Language availability (English/Persian toggle)

**Interactive Elements**:
- "Read Free Preview" button
- "Add to Library" button
- "Add to Wishlist" button
- Share buttons
- Language switcher (EN ⟷ FA)

**Comments Section**:
- User reviews and ratings
- Sort by: Most recent, Highest rated, Most helpful
- Reply to comments
- Like/helpful buttons
- Moderation for admin

**Free Preview**:
- Set number of free pages per book (admin configurable)
- After free pages: Blurred page with lock icon
- "Upgrade to Premium" CTA overlay

---

### 3. Library Page
**Features**:
- Grid/List view toggle
- Advanced filtering:
  - Genre (multi-select)
  - Language
  - Rating
  - Publication year
  - Author
  - Reading status (Not started, In progress, Completed)
- Sorting options:
  - Recently added
  - Title (A-Z, Z-A)
  - Author
  - Rating
  - Publication date
  - Most popular
- Search bar with autocomplete
- Pagination or infinite scroll

**Book Cards**:
- Cover image
- Title, author
- Progress bar (if started)
- Quick actions (Read, Remove, Details)

---

### 4. Reading Interface
**The Most Important Feature - Must Be Perfect**

**Book-Like Experience**:
- Realistic page-turning animation
- Drag from any point on the page to turn
- Text wraps naturally during page turn
- Page curl effect with shadow
- Smooth physics-based animation

**Reading Controls**:
- Page navigation (previous/next arrows)
- Page number display
- Progress bar
- Jump to page
- Bookmark current page
- Table of contents sidebar

**Customization**:
- Font family selection
- Font size adjustment
- Line height
- Text alignment
- Background color/theme
- Brightness control
- Reading mode (single page, double page, scroll)

**Highlighting & Notes**:
- Select text to highlight
- Color-coded highlights
- Add notes to highlights
- View all highlights/notes in sidebar
- Export highlights

**AI Chat Feature**:
- Floating AI button
- Chat with the book using Gemini 2.5 Flash
- Context sent to AI:
  - Book metadata (title, author, year, genre, summary)
  - Current page number
  - Current page text
  - Previous 5 pages text
- System prompt: AI acts as the book/author
- Conversation history maintained during session
- Clear chat option
- Collapsible chat panel

**Vocabulary Builder**:
- Select unknown words
- Add to personal vocabulary list
- Automatic definition lookup
- Create flashcards
- Quiz yourself
- Track learning progress

**Mobile Optimization**:
- Touch gestures for page turning
- Swipe left/right
- Pinch to zoom
- Tap zones (left=previous, right=next)

---

### 5. User Dashboard
**Overview Section**:
- Reading statistics
- Books in progress
- Reading streak
- Total pages read
- Time spent reading

**My Library**:
- Currently reading
- Want to read
- Completed
- Favorites

**Reading History**:
- Timeline of reading activity
- Books finished this month/year
- Reading goals progress

**Highlights & Notes**:
- All saved highlights
- Filter by:
  - Book
  - Genre
  - Date
  - Color
- Search within highlights
- Export options (PDF, TXT, CSV)

**Vocabulary**:
- Saved words
- Flashcard practice
- Quiz mode
- Progress tracking
- Spaced repetition system

**Gamification**:
- Achievements/badges
- Reading challenges
- Leaderboard
- Points system
- Levels/ranks

---

### 6. Admin Panel
**Access Control**: Admin-only routes with authentication

**Dashboard**:
- Total users
- Active subscriptions
- Revenue metrics
- Popular books
- User engagement stats
- Traffic analytics
- Conversion rates

**Book Management**:
- Add new book
- Edit existing books
- Delete books
- Bulk operations
- Import/export

**Book Publishing Interface**:
- Rich text editor (TipTap with full Word-like features):
  - Bold, italic, underline, strikethrough
  - Font family, size, color
  - Text alignment
  - Lists (ordered, unordered)
  - Headings
  - Blockquotes
  - Code blocks
  - Tables
  - Images
  - Links
  - Copy/paste from Word (preserve formatting)
  - Undo/redo
  - Character/word count

**Book Information Form**:
- Title
- Subtitle
- Author (select existing or create new)
- Co-authors
- Publication year
- ISBN
- Publisher
- Language(s)
- Genre (multi-select, create new)
- Tags
- Summary/description
- Cover image upload
- Preview image
- Free preview pages (number)
- Price/subscription tier
- Status (draft, published, archived)

**User Management**:
- View all users
- User details
- Subscription status
- Reading activity
- Ban/suspend users
- Send notifications

**Analytics & Reports**:
- User growth charts
- Revenue reports
- Book popularity
- Reading patterns
- Engagement metrics
- Export to Excel/CSV
- Date range filters
- Custom reports

**API Management**:
- API keys
- Rate limiting
- Usage statistics
- Webhook configuration

**Content Moderation**:
- Review comments
- Approve/reject
- Ban users
- Content flags

---

### 7. Subscription System
**Tiers**:
- Free: Limited preview pages
- Premium: Full access to all books
- (Optional) Family plan

**Features**:
- Payment integration (Stripe/PayPal)
- Subscription management
- Cancel/upgrade/downgrade
- Billing history
- Invoices

---

### 8. Recommendation System
**"You Might Like" Section**:
- Smart recommendations based on:
  - Books read
  - Books viewed
  - Reading history
  - Genres preferred
  - Similar users' preferences
  - Time spent on books
  - Ratings given

**Algorithm Considerations**:
- Collaborative filtering
- Content-based filtering
- Hybrid approach
- Machine learning (future enhancement)

---

### 9. Bilingual Support
**Language Toggle**:
- Global language switcher (EN ⟷ FA)
- Persists user preference
- Smooth transition

**Content**:
- All UI text translated
- Books available in both languages
- Side-by-side reading mode (optional feature)
- Same page in both languages

**RTL Support**:
- Proper RTL layout for Persian
- Mirrored UI elements
- Text direction handling

---

## 🛠 Technical Stack

### Frontend
- **Framework**: Next.js 15 (latest, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **State Management**: React Context + Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (book covers, assets)
- **API**: Next.js API Routes
- **AI Integration**: Google Gemini 2.5 Flash

### Additional Tools
- **Rich Text Editor**: TipTap
- **Charts**: Recharts
- **Date Handling**: date-fns
- **SEO**: next-seo
- **Analytics**: Google Analytics / Vercel Analytics
- **Error Tracking**: Sentry (optional)
- **Testing**: Jest + React Testing Library (optional)

---

## 📊 Database Schema

### Tables Needed

**users**
- id (uuid, primary key)
- email
- name
- avatar_url
- subscription_tier
- subscription_expires_at
- created_at
- updated_at
- preferences (jsonb)

**books**
- id (uuid, primary key)
- title
- subtitle
- author_id (foreign key)
- publication_year
- isbn
- publisher
- summary
- cover_image_url
- preview_image_url
- free_preview_pages
- total_pages
- language
- status (draft, published, archived)
- created_at
- updated_at

**authors**
- id (uuid, primary key)
- name
- bio
- photo_url
- created_at

**genres**
- id (uuid, primary key)
- name
- slug
- description

**book_genres** (junction table)
- book_id
- genre_id

**book_content**
- id (uuid, primary key)
- book_id (foreign key)
- page_number
- content (text)
- language

**user_library**
- id (uuid, primary key)
- user_id (foreign key)
- book_id (foreign key)
- status (reading, completed, want_to_read)
- current_page
- progress_percentage
- started_at
- completed_at

**bookmarks**
- id (uuid, primary key)
- user_id (foreign key)
- book_id (foreign key)
- page_number
- created_at

**highlights**
- id (uuid, primary key)
- user_id (foreign key)
- book_id (foreign key)
- page_number
- text
- color
- note
- created_at

**vocabulary**
- id (uuid, primary key)
- user_id (foreign key)
- word
- definition
- book_id (foreign key)
- page_number
- context
- mastery_level
- created_at

**reviews**
- id (uuid, primary key)
- user_id (foreign key)
- book_id (foreign key)
- rating (1-5)
- comment
- helpful_count
- created_at
- updated_at

**reading_sessions**
- id (uuid, primary key)
- user_id (foreign key)
- book_id (foreign key)
- pages_read
- duration_minutes
- created_at

**achievements**
- id (uuid, primary key)
- name
- description
- icon
- points

**user_achievements**
- user_id (foreign key)
- achievement_id (foreign key)
- earned_at

---

## 🎯 SEO & Performance

### SEO Optimization
- Dynamic meta tags per page
- Open Graph tags
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt
- Canonical URLs
- Alt text for images
- Semantic HTML

### Performance
- Image optimization (Next.js Image)
- Lazy loading
- Code splitting
- Server-side rendering
- Static generation where possible
- CDN for assets
- Caching strategies
- Lighthouse score 90+

---

## 🚀 Development Phases

### Phase 1: Foundation
- Project setup with latest Next.js
- Database schema design
- Authentication system
- Basic UI components
- Landing page

### Phase 2: Core Features
- Book detail pages
- Library page with filters
- Reading interface (basic)
- User dashboard

### Phase 3: Advanced Reading
- Page-turning animations
- Highlighting & notes
- Vocabulary builder
- AI chat integration

### Phase 4: Admin & Publishing
- Admin panel
- Book publishing interface
- User management
- Analytics dashboard

### Phase 5: Enhancement
- Recommendation system
- Gamification
- Mobile optimization
- Performance tuning

### Phase 6: Polish
- Animations refinement
- Dark mode perfection
- Accessibility
- Testing & bug fixes

---

## 📝 Analysis of Existing Projects

### dfgf-main & iuu-main
**Strengths**:
- Good project structure
- Comprehensive UI components
- TipTap integration
- Supabase setup
- TypeScript usage

**Weaknesses**:
- Using Next.js 14.1.0 (outdated)
- Missing realistic reading interface
- No AI chat feature
- Limited gamification
- Basic recommendation system
- Incomplete admin panel

### ketab-yar-vercalee-master
**Strengths**:
- Testing setup (Jest)
- Code quality tools (Husky, Prettier)
- Sentry integration
- NextAuth.js

**Weaknesses**:
- Mixed architecture (pages + app router)
- Older dependencies
- Less comprehensive features
- No advanced reading interface

---

## ✅ Action Plan

1. **Create new folder**: `official-ketab-yar`
2. **Initialize with latest stack**: Next.js 15, React 18+, TypeScript 5+
3. **Set up database**: Supabase with complete schema
4. **Build component library**: Modern, reusable components
5. **Implement features**: Following the priority order above
6. **Test thoroughly**: Each feature on desktop and mobile
7. **Optimize**: Performance, SEO, accessibility
8. **Deploy**: Vercel with proper environment setup

---

## 🎨 UI/UX Mockup References

Think of these platforms for inspiration:
- **Netflix**: Content discovery, smooth navigation
- **Apple Books**: Reading interface, typography
- **Goodreads**: Book details, reviews, recommendations
- **Duolingo**: Gamification, progress tracking
- **Medium**: Reading experience, highlighting

---

## 🔧 Configuration Files Needed

- `.env.local` - Environment variables
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind customization
- `tsconfig.json` - TypeScript settings
- `components.json` - shadcn/ui config
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Code formatting

---

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1536px

---

## 🎭 Animation Guidelines

- Page transitions: 300-500ms
- Micro-interactions: 150-250ms
- Page turns: 600-800ms (realistic)
- Hover effects: 200ms
- Loading states: Skeleton screens, not spinners

---

## 🔐 Security Considerations

- Row Level Security (RLS) in Supabase
- API rate limiting
- Input validation
- XSS protection
- CSRF tokens
- Secure authentication
- Environment variable protection

---

## 📈 Success Metrics

- Page load time < 2s
- Lighthouse score > 90
- User engagement rate
- Reading completion rate
- Subscription conversion rate
- User retention
- Mobile responsiveness score

---

**This guide should serve as the complete blueprint for building the ultimate Ketab Yar platform. Every feature, every detail, every consideration is documented here.**
