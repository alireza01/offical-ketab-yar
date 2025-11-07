/**
 * LOCAL MOCK DATA - No Sanity Required
 * 
 * This file provides mock book data for local development
 * without needing Sanity authentication or internet connection.
 * 
 * Usage:
 * - Set NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local
 * - Data will be served from this file instead of Sanity
 */

export const mockAuthor = {
    _id: 'mock-author-banana',
    _type: 'author',
    name: 'Marina Tropical',
    slug: { current: 'marina-tropical' },
    bio: 'Marina Tropical is an award-winning children\'s author and environmental educator based in Costa Rica. With a background in tropical ecology and a passion for storytelling, she creates enchanting tales that introduce young readers to the wonders of rainforest ecosystems.',
    birthYear: 1985,
    nationality: 'Costa Rican',
}

export const mockGenres = [
    {
        _id: 'mock-genre-adventure',
        _type: 'genre',
        name: 'Adventure',
        slug: { current: 'adventure' },
        description: 'Exciting stories of exploration, discovery, and overcoming challenges',
    },
    {
        _id: 'mock-genre-fiction',
        _type: 'genre',
        name: 'Fiction',
        slug: { current: 'fiction' },
        description: 'Imaginative stories and creative narratives',
    },
]

export const mockBook = {
    _id: 'mock-banana-adventure',
    _type: 'book',
    title: {
        en: 'The Great Banana Adventure',
        fa: 'ماجراجویی بزرگ موز',
    },
    slug: { current: 'the-great-banana-adventure' },
    subtitle: {
        en: 'A Journey Through Tropical Mysteries and Friendship',
        fa: 'سفری در میان رازهای استوایی و دوستی',
    },
    author: mockAuthor,
    coverImage: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=1200&fit=crop',
    summary: {
        en: 'Join Benny the Banana on an extraordinary journey through the lush rainforests of Costa Rica. When a mysterious storm separates him from his bunch, Benny must navigate treacherous terrain, make unlikely friends, and discover the true meaning of courage.',
        fa: 'به بنی موز در یک سفر فوق‌العاده در میان جنگل‌های بارانی سرسبز کاستاریکا بپیوندید. وقتی یک طوفان مرموز او را از خوشه‌اش جدا می‌کند، بنی باید از زمین‌های خطرناک عبور کند، دوستان غیرمنتظره پیدا کند و معنای واقعی شجاعت را کشف کند.',
    },
    isbn: '978-1234567890',
    publisher: 'Tropical Tales Publishing',
    genres: mockGenres,
    level: 'intermediate',
    freePreviewPages: 15,
    isPremium: false,
    featured: true,
    status: 'published',
    publishedAt: '2024-11-07T10:00:00Z',
    seoTitle: {
        en: 'The Great Banana Adventure | Free Bilingual Book | Ketab-Yar',
        fa: 'ماجراجویی بزرگ موز | کتاب دوزبانه رایگان | کتاب‌یار',
    },
    seoDescription: {
        en: 'Read The Great Banana Adventure - a heartwarming tale of courage and friendship. Free bilingual preview in English and Persian.',
        fa: 'ماجراجویی بزرگ موز را بخوانید - داستانی دلگرم‌کننده از شجاعت و دوستی. پیش‌نمایش رایگان دوزبانه به انگلیسی و فارسی.',
    },
    seoKeywords: [
        'adventure story',
        'bilingual book',
        'English learning',
        'tropical adventure',
        'friendship story',
        'داستان ماجراجویی',
        'کتاب دوزبانه',
        'یادگیری انگلیسی',
    ],
    chapters: [
        {
            _type: 'chapter',
            _key: 'chapter-1',
            title: {
                en: 'The Storm That Changed Everything',
                fa: 'طوفانی که همه چیز را تغییر داد',
            },
            chapterNumber: 1,
            content: [
                {
                    _type: 'bilingualParagraph',
                    _key: 'c1-p1',
                    english: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'The morning sun cast golden rays through the dense canopy of the Costa Rican rainforest, illuminating thousands of water droplets that clung to emerald leaves like tiny diamonds. ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'Benny the Banana',
                                    marks: ['strong'],
                                },
                                {
                                    _type: 'span',
                                    text: ' hung contentedly from his bunch, swaying gently in the warm tropical breeze. Life in the plantation had always been predictable, comfortable, and safe—exactly the way Benny liked it.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'خورشید صبحگاهی پرتوهای طلایی را از میان سایبان متراکم جنگل بارانی کاستاریکا می‌تاباند و هزاران قطره آب را که مانند الماس‌های کوچک به برگ‌های زمردی چسبیده بودند، روشن می‌کرد. ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'بنی موز',
                                    marks: ['strong'],
                                },
                                {
                                    _type: 'span',
                                    text: ' با رضایت از خوشه‌اش آویزان بود و به آرامی در نسیم گرم استوایی تاب می‌خورد. زندگی در مزرعه همیشه قابل پیش‌بینی، راحت و امن بود—دقیقاً همان‌طور که بنی دوست داشت.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: false,
                },
                {
                    _type: 'bilingualParagraph',
                    _key: 'c1-p2',
                    english: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: '"Another beautiful day in paradise," Benny murmured to his neighbor, ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'Bella',
                                    marks: ['em'],
                                },
                                {
                                    _type: 'span',
                                    text: ', who was ripening nicely beside him. "I can\'t imagine living anywhere else."',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: '«یک روز زیبای دیگر در بهشت»، بنی به همسایه‌اش، ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'بلا',
                                    marks: ['em'],
                                },
                                {
                                    _type: 'span',
                                    text: '، که در کنارش به خوبی می‌رسید، زمزمه کرد. «نمی‌توانم تصور کنم در جای دیگری زندگی کنم.»',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: false,
                },
                {
                    _type: 'bilingualParagraph',
                    _key: 'c1-p3',
                    english: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'Bella smiled, her yellow skin glowing in the morning light. "You\'re such a homebody, Benny. Don\'t you ever wonder what\'s beyond the plantation? The ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'wild rainforest',
                                    marks: ['strong', 'em'],
                                },
                                {
                                    _type: 'span',
                                    text: ', the mysterious mountains, the vast ocean?"',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'بلا لبخند زد، پوست زرد او در نور صبح می‌درخشید. «تو واقعاً خانه‌نشینی، بنی. هرگز کنجکاو نمی‌شوی که آن طرف مزرعه چه چیزی هست؟ ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'جنگل بارانی وحشی',
                                    marks: ['strong', 'em'],
                                },
                                {
                                    _type: 'span',
                                    text: '، کوه‌های مرموز، اقیانوس وسیع؟»',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: false,
                },
                {
                    _type: 'bilingualParagraph',
                    _key: 'c1-p4',
                    english: [
                        {
                            _type: 'block',
                            style: 'h2',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'The Storm Arrives',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'h2',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'طوفان فرا می‌رسد',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'center',
                    pageBreakAfter: false,
                },
                {
                    _type: 'bilingualParagraph',
                    _key: 'c1-p5',
                    english: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'Before Benny could respond, the sky suddenly darkened. ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'Ominous clouds',
                                    marks: ['underline'],
                                },
                                {
                                    _type: 'span',
                                    text: ' rolled in from the east, swallowing the sun whole. The gentle breeze transformed into a howling wind that whipped through the plantation with terrifying force.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'قبل از اینکه بنی بتواند پاسخ دهد، آسمان ناگهان تاریک شد. ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'ابرهای شوم',
                                    marks: ['underline'],
                                },
                                {
                                    _type: 'span',
                                    text: ' از شرق غلتیدند و خورشید را به کلی بلعیدند. نسیم ملایم به بادی خروشان تبدیل شد که با نیرویی وحشتناک از میان مزرعه می‌گذشت.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: true,
                },
            ],
        },
        {
            _type: 'chapter',
            _key: 'chapter-2',
            title: {
                en: 'Landing in the Unknown',
                fa: 'فرود در ناشناخته‌ها',
            },
            chapterNumber: 2,
            content: [
                {
                    _type: 'bilingualParagraph',
                    _key: 'c2-p1',
                    english: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'Benny\'s wild flight finally came to an abrupt end when he crashed through a canopy of leaves and landed with a soft ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'thud',
                                    marks: ['em'],
                                },
                                {
                                    _type: 'span',
                                    text: ' on a bed of moss. For several moments, he lay there, dazed and disoriented.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'پرواز وحشی بنی سرانجام با یک پایان ناگهانی به پایان رسید وقتی که او از میان سایبان برگ‌ها عبور کرد و با یک ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'تق',
                                    marks: ['em'],
                                },
                                {
                                    _type: 'span',
                                    text: ' نرم روی بستری از خزه فرود آمد. برای چند لحظه، او آنجا دراز کشید، گیج و سردرگم.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: false,
                },
                {
                    _type: 'bilingualParagraph',
                    _key: 'c2-p2',
                    english: [
                        {
                            _type: 'block',
                            style: 'blockquote',
                            children: [
                                {
                                    _type: 'span',
                                    text: '"Well, well, well," a voice croaked from above. "What do we have here? A banana, of all things, in the middle of the jungle!"',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'blockquote',
                            children: [
                                {
                                    _type: 'span',
                                    text: '«خب، خب، خب»، صدایی از بالا قورباغه‌وار گفت. «اینجا چه داریم؟ یک موز، از همه چیز، در وسط جنگل!»',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: false,
                },
                {
                    _type: 'bilingualParagraph',
                    _key: 'c2-p3',
                    english: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'Benny looked up to see a ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'bright green tree frog',
                                    marks: ['strong', 'em'],
                                },
                                {
                                    _type: 'span',
                                    text: ' perched on a branch, regarding him with large, curious eyes. The frog introduced himself as Fernando and offered to help Benny find his way home.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    farsi: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [
                                {
                                    _type: 'span',
                                    text: 'بنی به بالا نگاه کرد و ',
                                    marks: [],
                                },
                                {
                                    _type: 'span',
                                    text: 'قورباغه درختی سبز روشنی',
                                    marks: ['strong', 'em'],
                                },
                                {
                                    _type: 'span',
                                    text: ' را دید که روی شاخه‌ای نشسته بود و با چشمان بزرگ و کنجکاو به او نگاه می‌کرد. قورباغه خود را فرناندو معرفی کرد و پیشنهاد کرد که به بنی کمک کند راه خانه را پیدا کند.',
                                    marks: [],
                                },
                            ],
                        },
                    ],
                    alignment: 'justify',
                    pageBreakAfter: true,
                },
            ],
        },
    ],
}

// Helper to get all mock books (for listing pages)
export const mockBooks = [mockBook]

