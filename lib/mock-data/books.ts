/**
 * Mock book data for local development without Supabase
 * Easy to remove when deploying - just delete this file
 */

export const mockBooks = [
    {
        id: '1',
        slug: 'atomic-habits',
        title: 'Atomic Habits',
        subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
        author_id: '1',
        author: {
            id: '1',
            name: 'James Clear',
            bio: 'James Clear is a writer and speaker focused on habits, decision making, and continuous improvement.',
            photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        },
        publication_year: 2018,
        isbn: '9780735211292',
        publisher: 'Avery',
        summary: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
        cover_image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        preview_image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
        free_preview_pages: 20,
        total_pages: 320,
        genres: ['Self-Help', 'Psychology', 'Productivity'],
        status: 'published',
        rating: 4.8,
        reviews_count: 1250,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        slug: 'the-great-gatsby',
        title: 'The Great Gatsby',
        subtitle: null,
        author_id: '2',
        author: {
            id: '2',
            name: 'F. Scott Fitzgerald',
            bio: 'Francis Scott Key Fitzgerald was an American novelist and short story writer.',
            photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        },
        publication_year: 1925,
        isbn: '9780743273565',
        publisher: 'Scribner',
        summary: 'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. First published in 1925, this quintessential novel of the Jazz Age has been acclaimed by generations of readers.',
        cover_image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        preview_image_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
        free_preview_pages: 30,
        total_pages: 180,
        genres: ['Classic', 'Fiction', 'Literature'],
        status: 'published',
        rating: 4.5,
        reviews_count: 890,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
    },
    {
        id: '3',
        slug: '1984',
        title: '1984',
        subtitle: null,
        author_id: '3',
        author: {
            id: '3',
            name: 'George Orwell',
            bio: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic.',
            photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        },
        publication_year: 1949,
        isbn: '9780451524935',
        publisher: 'Signet Classic',
        summary: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
        cover_image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
        preview_image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
        free_preview_pages: 25,
        total_pages: 328,
        genres: ['Dystopian', 'Fiction', 'Classic'],
        status: 'published',
        rating: 4.7,
        reviews_count: 2100,
        created_at: '2024-01-05T10:00:00Z',
        updated_at: '2024-01-05T10:00:00Z',
    },
    {
        id: '4',
        slug: 'sapiens',
        title: 'Sapiens',
        subtitle: 'A Brief History of Humankind',
        author_id: '4',
        author: {
            id: '4',
            name: 'Yuval Noah Harari',
            bio: 'Prof. Yuval Noah Harari is a historian, philosopher, and the bestselling author of Sapiens.',
            photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        },
        publication_year: 2011,
        isbn: '9780062316097',
        publisher: 'Harper',
        summary: 'From a renowned historian comes a groundbreaking narrative of humanity\'s creation and evolution that explores the ways in which biology and history have defined us.',
        cover_image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        preview_image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
        free_preview_pages: 20,
        total_pages: 443,
        genres: ['History', 'Science', 'Philosophy'],
        status: 'published',
        rating: 4.6,
        reviews_count: 1580,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z',
    },
    {
        id: '5',
        slug: 'the-alchemist',
        title: 'The Alchemist',
        subtitle: null,
        author_id: '5',
        author: {
            id: '5',
            name: 'Paulo Coelho',
            bio: 'Paulo Coelho is a Brazilian lyricist and novelist, best known for his novel The Alchemist.',
            photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        },
        publication_year: 1988,
        isbn: '9780062315007',
        publisher: 'HarperOne',
        summary: 'Paulo Coelho\'s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.',
        cover_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        preview_image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
        free_preview_pages: 20,
        total_pages: 208,
        genres: ['Fiction', 'Philosophy', 'Adventure'],
        status: 'published',
        rating: 4.4,
        reviews_count: 950,
        created_at: '2024-01-12T10:00:00Z',
        updated_at: '2024-01-12T10:00:00Z',
    },
    {
        id: '6',
        slug: 'thinking-fast-and-slow',
        title: 'Thinking, Fast and Slow',
        subtitle: null,
        author_id: '6',
        author: {
            id: '6',
            name: 'Daniel Kahneman',
            bio: 'Daniel Kahneman is an Israeli-American psychologist and economist notable for his work on the psychology of judgment and decision-making.',
            photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        },
        publication_year: 2011,
        isbn: '9780374533557',
        publisher: 'Farrar, Straus and Giroux',
        summary: 'In this work, Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
        cover_image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
        preview_image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
        free_preview_pages: 20,
        total_pages: 499,
        genres: ['Psychology', 'Science', 'Non-Fiction'],
        status: 'published',
        rating: 4.5,
        reviews_count: 1120,
        created_at: '2024-01-08T10:00:00Z',
        updated_at: '2024-01-08T10:00:00Z',
    },
]

export const mockBookContent = {
    '1': {
        en: `Chapter 1: The Surprising Power of Atomic Habits

Why do small habits make a big difference? It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action.

Meanwhile, improving by 1 percent isn't particularly notable—sometimes it isn't even noticeable—but it can be far more meaningful, especially in the long run. The difference a tiny improvement can make over time is astounding. Here's how the math works out: if you can get 1 percent better each day for one year, you'll end up thirty-seven times better by the time you're done.

Conversely, if you get 1 percent worse each day for one year, you'll decline nearly down to zero. What starts as a small win or a minor setback accumulates into something much more.`,
        fa: `فصل ۱: قدرت شگفت‌انگیز عادت‌های اتمی

چرا عادت‌های کوچک تفاوت بزرگی ایجاد می‌کنند؟ بسیار آسان است که اهمیت یک لحظه تعیین‌کننده را بیش از حد ارزیابی کنیم و ارزش بهبودهای کوچک روزانه را دست کم بگیریم. اغلب خودمان را متقاعد می‌کنیم که موفقیت عظیم نیازمند اقدام عظیم است.

در همین حال، بهبود یک درصدی چندان قابل توجه نیست - گاهی اوقات حتی قابل مشاهده نیست - اما می‌تواند بسیار معنادارتر باشد، به خصوص در درازمدت. تفاوتی که یک بهبود کوچک می‌تواند در طول زمان ایجاد کند، شگفت‌انگیز است.`,
    },
    '2': {
        en: `Chapter 1

In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.

"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.`,
        fa: `فصل ۱

در سال‌های جوانی و آسیب‌پذیرترم، پدرم نصیحتی به من کرد که از آن زمان تاکنون در ذهنم می‌چرخاند.

"هر وقت احساس کردی می‌خواهی کسی را نقد کنی"، به من گفت، "فقط به یاد داشته باش که همه مردم در این دنیا مزایایی که تو داشته‌ای را نداشته‌اند."

او چیز بیشتری نگفت، اما ما همیشه به شیوه‌ای محفوظ، ارتباط غیرمعمولی داشتیم و من فهمیدم که منظورش بسیار بیشتر از این بود.`,
    },
}

export const mockComments = [
    {
        id: '1',
        book_id: '1',
        user_id: 'mock-user-1',
        user: {
            id: 'mock-user-1',
            name: 'علی محمدی',
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        },
        rating: 5,
        comment: 'کتاب فوق‌العاده‌ای است! واقعاً زندگی‌ام را تغییر داد. توصیه می‌کنم حتماً بخوانید.',
        helpful_count: 45,
        created_at: '2024-01-20T14:30:00Z',
        updated_at: '2024-01-20T14:30:00Z',
    },
    {
        id: '2',
        book_id: '1',
        user_id: 'mock-user-2',
        user: {
            id: 'mock-user-2',
            name: 'Sara Johnson',
            avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        },
        rating: 4,
        comment: 'Great book with practical advice. The 1% improvement concept is brilliant!',
        helpful_count: 32,
        created_at: '2024-01-18T10:15:00Z',
        updated_at: '2024-01-18T10:15:00Z',
    },
    {
        id: '3',
        book_id: '2',
        user_id: 'mock-user-3',
        user: {
            id: 'mock-user-3',
            name: 'محمد رضایی',
            avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
        },
        rating: 5,
        comment: 'شاهکار ادبیات جهان. هر بار که می‌خوانم چیز جدیدی کشف می‌کنم.',
        helpful_count: 28,
        created_at: '2024-01-15T16:45:00Z',
        updated_at: '2024-01-15T16:45:00Z',
    },
]

export const mockVocabulary = [
    {
        id: '1',
        user_id: 'mock-user',
        word: 'atomic',
        definition: 'extremely small; relating to an atom or atoms',
        book_id: '1',
        page_number: 5,
        context: 'The surprising power of atomic habits',
        mastery_level: 2,
        created_at: '2024-01-20T10:00:00Z',
    },
    {
        id: '2',
        user_id: 'mock-user',
        word: 'vulnerable',
        definition: 'exposed to the possibility of being attacked or harmed',
        book_id: '2',
        page_number: 1,
        context: 'In my younger and more vulnerable years',
        mastery_level: 1,
        created_at: '2024-01-19T15:30:00Z',
    },
    {
        id: '3',
        user_id: 'mock-user',
        word: 'accumulate',
        definition: 'gather together or acquire an increasing number or quantity of',
        book_id: '1',
        page_number: 8,
        context: 'What starts as a small win accumulates into something much more',
        mastery_level: 3,
        created_at: '2024-01-18T12:20:00Z',
    },
]

export const mockUserLibrary = [
    {
        id: '1',
        user_id: 'mock-user',
        book_id: '1',
        status: 'reading',
        current_page: 45,
        progress_percentage: 14,
        started_at: '2024-01-15T10:00:00Z',
        completed_at: null,
        updated_at: '2024-01-20T18:30:00Z',
    },
    {
        id: '2',
        user_id: 'mock-user',
        book_id: '2',
        status: 'completed',
        current_page: 180,
        progress_percentage: 100,
        started_at: '2024-01-01T10:00:00Z',
        completed_at: '2024-01-10T20:15:00Z',
        updated_at: '2024-01-10T20:15:00Z',
    },
    {
        id: '3',
        user_id: 'mock-user',
        book_id: '4',
        status: 'want_to_read',
        current_page: 0,
        progress_percentage: 0,
        started_at: null,
        completed_at: null,
        updated_at: '2024-01-18T14:00:00Z',
    },
]

export const mockUser = {
    id: 'mock-user',
    email: 'test@ketabyar.ir',
    name: 'کاربر تستی',
    avatar_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
    subscription_tier: 'free',
    subscription_expires_at: null,
    xp: 1250,
    current_streak: 7,
    last_read_at: new Date().toISOString().split('T')[0],
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-20T18:30:00Z',
    preferences: {
        language: 'fa',
        theme: 'system',
    },
}
