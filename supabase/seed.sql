-- Seed Data for Ketab-Yar
-- Initial categories, leagues, and achievements

-- Insert Categories
INSERT INTO public.categories (name, name_fa, slug, description, display_order) VALUES
('Fiction', 'داستانی', 'fiction', 'Fictional stories and novels', 1),
('Non-Fiction', 'غیرداستانی', 'non-fiction', 'Real-world topics and information', 2),
('Self-Help', 'خودیاری', 'self-help', 'Personal development and improvement', 3),
('Business', 'کسبوکار', 'business', 'Business and entrepreneurship', 4),
('Science', 'علمی', 'science', 'Scientific topics and discoveries', 5),
('History', 'تاریخی', 'history', 'Historical events and figures', 6),
('Biography', 'زندگینامه', 'biography', 'Life stories of notable people', 7),
('Philosophy', 'فلسفه', 'philosophy', 'Philosophical thoughts and ideas', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert Leagues
INSERT INTO public.leagues (name, name_fa, tier, min_xp, max_xp, icon, color) VALUES
('Bronze', 'برنز', 1, 0, 999, '', '#CD7F32'),
('Silver', 'نقره', 2, 1000, 2999, '', '#C0C0C0'),
('Gold', 'طلا', 3, 3000, 5999, '', '#FFD700'),
('Platinum', 'پلاتین', 4, 6000, 9999, '', '#E5E4E2'),
('Diamond', 'الماس', 5, 10000, 19999, '', '#B9F2FF'),
('Master', 'استاد', 6, 20000, NULL, '', '#FF6B6B')
ON CONFLICT (tier) DO NOTHING;

-- Insert Achievements
INSERT INTO public.achievements (name, name_fa, description, description_fa, icon, category, points, requirement_type, requirement_value) VALUES
('First Steps', 'قدمهای اول', 'Read your first page', 'اولین صفحه را بخوانید', '', 'reading', 10, 'pages_read', 1),
('Bookworm', 'کتابخوان', 'Read 100 pages', '100 صفحه بخوانید', '', 'reading', 50, 'pages_read', 100),
('Scholar', 'دانشمند', 'Read 1000 pages', '1000 صفحه بخوانید', '', 'reading', 200, 'pages_read', 1000),
('First Book', 'اولین کتاب', 'Complete your first book', 'اولین کتاب را تمام کنید', '', 'completion', 25, 'books_completed', 1),
('Bibliophile', 'کتابدوست', 'Complete 10 books', '10 کتاب را تمام کنید', '', 'completion', 100, 'books_completed', 10),
('Word Collector', 'جمعآوری کلمات', 'Save 50 vocabulary words', '50 کلمه ذخیره کنید', '', 'vocabulary', 30, 'words_saved', 50),
('Linguist', 'زبانشناس', 'Save 200 vocabulary words', '200 کلمه ذخیره کنید', '', 'vocabulary', 100, 'words_saved', 200),
('Dedicated', 'متعهد', 'Maintain a 7-day streak', 'استریک 7 روزه داشته باشید', '', 'streak', 50, 'streak_days', 7),
('Unstoppable', 'توقفناپذیر', 'Maintain a 30-day streak', 'استریک 30 روزه داشته باشید', '', 'streak', 200, 'streak_days', 30),
('Early Bird', 'سحرخیز', 'Read before 8 AM', 'قبل از 8 صبح بخوانید', '', 'special', 20, 'special', 1),
('Night Owl', 'شبزندهدار', 'Read after 10 PM', 'بعد از 10 شب بخوانید', '', 'special', 20, 'special', 1)
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Authors
INSERT INTO public.authors (name, name_fa, bio) VALUES
('James Clear', 'جیمز کلیر', 'Author of Atomic Habits'),
('Dale Carnegie', 'دیل کارنگی', 'Author of How to Win Friends and Influence People'),
('Stephen Covey', 'استیفن کاوی', 'Author of The 7 Habits of Highly Effective People'),
('Malcolm Gladwell', 'مالکوم گلدول', 'Author of Outliers and The Tipping Point'),
('Yuval Noah Harari', 'یووال نوح هراری', 'Author of Sapiens')
ON CONFLICT DO NOTHING;
