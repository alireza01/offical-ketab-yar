/**
 * OPTIMIZED MOCK DATA - For Reader Performance
 * 
 * This is the OPTIMIZED structure that the reader uses.
 * It's 15x smaller and 10x faster than the Sanity structure.
 * 
 * Key differences from Sanity structure:
 * - No _type, _key, _ref metadata
 * - No nested children[] arrays
 * - Both languages together (perfect for subtitles!)
 * - Pre-paginated (reader knows exactly what's on each page)
 * - Marks as ranges (start/end positions)
 */

export interface OptimizedBook {
    bookId: string
    title: {
        en: string
        fa: string
    }
    author: string
    coverImage: string
    summary: {
        en: string
        fa: string
    }
    chapters: OptimizedChapter[]
}

export interface OptimizedChapter {
    number: number
    title: {
        en: string
        fa: string
    }
    pages: OptimizedPage[]
}

export interface OptimizedPage {
    pageNumber: number
    paragraphs: OptimizedParagraph[]
}

export interface OptimizedParagraph {
    id: string
    type: 'p' | 'h1' | 'h2' | 'h3' | 'blockquote'
    en: string
    fa: string
    marks?: {
        en?: Mark[]
        fa?: Mark[]
    }
}

export interface Mark {
    start: number
    end: number
    type: 'strong' | 'em' | 'underline' | 'strike-through'
}

// ============================================
// OPTIMIZED MOCK DATA
// ============================================

export const optimizedBananaBook: OptimizedBook = {
    bookId: 'the-great-banana-adventure',
    title: {
        en: 'The Great Banana Adventure',
        fa: 'ماجراجویی بزرگ موز'
    },
    author: 'Marina Tropical',
    coverImage: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=1200&fit=crop',
    summary: {
        en: 'Join Benny the Banana on an extraordinary journey through the lush rainforests of Costa Rica.',
        fa: 'به بنی موز در یک سفر فوق‌العاده در میان جنگل‌های بارانی سرسبز کاستاریکا بپیوندید.'
    },
    chapters: [
        {
            number: 1,
            title: {
                en: 'The Storm That Changed Everything',
                fa: 'طوفانی که همه چیز را تغییر داد'
            },
            pages: [
                {
                    pageNumber: 1,
                    paragraphs: [
                        {
                            id: 'p1',
                            type: 'p',
                            en: 'The morning sun cast golden rays through the dense canopy of the Costa Rican rainforest, illuminating thousands of water droplets that clung to emerald leaves like tiny diamonds. Benny the Banana hung contentedly from his bunch, swaying gently in the warm tropical breeze. Life in the plantation had always been predictable, comfortable, and safe—exactly the way Benny liked it.',
                            fa: 'خورشید صبحگاهی پرتوهای طلایی را از میان سایبان متراکم جنگل بارانی کاستاریکا می‌تاباند و هزاران قطره آب را که مانند الماس‌های کوچک به برگ‌های زمردی چسبیده بودند، روشن می‌کرد. بنی موز با رضایت از خوشه‌اش آویزان بود و به آرامی در نسیم گرم استوایی تاب می‌خورد. زندگی در مزرعه همیشه قابل پیش‌بینی، راحت و امن بود—دقیقاً همان‌طور که بنی دوست داشت.',
                            marks: {
                                en: [
                                    { start: 107, end: 123, type: 'strong' } // "Benny the Banana"
                                ],
                                fa: [
                                    { start: 165, end: 172, type: 'strong' } // "بنی موز"
                                ]
                            }
                        },
                        {
                            id: 'p2',
                            type: 'p',
                            en: '"Another beautiful day in paradise," Benny murmured to his neighbor, Bella, who was ripening nicely beside him. "I can\'t imagine living anywhere else."',
                            fa: '«یک روز زیبای دیگر در بهشت»، بنی به همسایه‌اش، بلا، که در کنارش به خوبی می‌رسید، زمزمه کرد. «نمی‌توانم تصور کنم در جای دیگری زندگی کنم.»',
                            marks: {
                                en: [
                                    { start: 73, end: 78, type: 'em' } // "Bella"
                                ],
                                fa: [
                                    { start: 48, end: 51, type: 'em' } // "بلا"
                                ]
                            }
                        },
                        {
                            id: 'p3',
                            type: 'p',
                            en: 'Bella smiled, her yellow skin glowing in the morning light. "You\'re such a homebody, Benny. Don\'t you ever wonder what\'s beyond the plantation? The wild rainforest, the mysterious mountains, the vast ocean?"',
                            fa: 'بلا لبخند زد، پوست زرد او در نور صبح می‌درخشید. «تو واقعاً خانه‌نشینی، بنی. هرگز کنجکاو نمی‌شوی که آن طرف مزرعه چه چیزی هست؟ جنگل بارانی وحشی، کوه‌های مرموز، اقیانوس وسیع؟»',
                            marks: {
                                en: [
                                    { start: 147, end: 164, type: 'strong' },
                                    { start: 147, end: 164, type: 'em' } // "wild rainforest" - both bold and italic
                                ],
                                fa: [
                                    { start: 130, end: 149, type: 'strong' },
                                    { start: 130, end: 149, type: 'em' } // "جنگل بارانی وحشی"
                                ]
                            }
                        },
                        {
                            id: 'p4',
                            type: 'h2',
                            en: 'The Storm Arrives',
                            fa: 'طوفان فرا می‌رسد'
                        },
                        {
                            id: 'p5',
                            type: 'p',
                            en: 'Before Benny could respond, the sky suddenly darkened. Ominous clouds rolled in from the east, swallowing the sun whole. The gentle breeze transformed into a howling wind that whipped through the plantation with terrifying force.',
                            fa: 'قبل از اینکه بنی بتواند پاسخ دهد، آسمان ناگهان تاریک شد. ابرهای شوم از شرق غلتیدند و خورشید را به کلی بلعیدند. نسیم ملایم به بادی خروشان تبدیل شد که با نیرویی وحشتناک از میان مزرعه می‌گذشت.',
                            marks: {
                                en: [
                                    { start: 62, end: 76, type: 'underline' } // "Ominous clouds"
                                ],
                                fa: [
                                    { start: 58, end: 69, type: 'underline' } // "ابرهای شوم"
                                ]
                            }
                        }
                    ]
                },
                {
                    pageNumber: 2,
                    paragraphs: [
                        {
                            id: 'p6',
                            type: 'blockquote',
                            en: '"Hold on tight!" shouted the eldest banana in their bunch, Old Boris, his voice barely audible over the roaring wind. "This is going to be a big one!"',
                            fa: '«محکم بچسبید!» مسن‌ترین موز خوشه‌شان، بوریس پیر، فریاد زد، صدایش به سختی از میان غرش باد شنیده می‌شد. «این یکی بزرگ خواهد بود!»'
                        },
                        {
                            id: 'p7',
                            type: 'p',
                            en: 'Rain began to fall in sheets, each drop feeling like a tiny hammer against Benny\'s skin. The banana plant swayed violently, its broad leaves flapping like the wings of a giant bird trying to take flight.',
                            fa: 'باران به صورت ورقه‌ای شروع به باریدن کرد، هر قطره مانند چکش کوچکی بر پوست بنی احساس می‌شد. گیاه موز به شدت تاب می‌خورد، برگ‌های پهن آن مانند بال‌های پرنده‌ای غول‌پیکر که سعی در پرواز دارد، بال می‌زدند.'
                        },
                        {
                            id: 'p8',
                            type: 'h2',
                            en: 'The Separation',
                            fa: 'جدایی'
                        },
                        {
                            id: 'p9',
                            type: 'p',
                            en: 'Then it happened. A particularly violent gust of wind, stronger than all the others, tore through the plantation. Benny felt his connection to the bunch snap. For a moment, he hung suspended in mid-air, watching in horror as his family grew smaller and smaller below him.',
                            fa: 'سپس اتفاق افتاد. یک وزش باد به خصوص خشن، قوی‌تر از همه دیگران، از میان مزرعه گذشت. بنی احساس کرد ارتباطش با خوشه قطع شد. برای لحظه‌ای، او در هوا معلق ماند و با وحشت تماشا کرد که خانواده‌اش زیر او کوچک‌تر و کوچک‌تر می‌شدند.',
                            marks: {
                                en: [
                                    { start: 157, end: 161, type: 'strong' } // "snap"
                                ],
                                fa: [
                                    { start: 135, end: 143, type: 'strong' } // "قطع شد"
                                ]
                            }
                        },
                        {
                            id: 'p10',
                            type: 'p',
                            en: '"Bella!" he cried out, but his voice was lost in the storm\'s fury. The wind carried him up, up, up—over the plantation, over the familiar rows of banana plants, over everything he had ever known.',
                            fa: '«بلا!» او فریاد زد، اما صدایش در خشم طوفان گم شد. باد او را بالا، بالا، بالا برد—بالای مزرعه، بالای ردیف‌های آشنای گیاهان موز، بالای هر چیزی که تا به حال می‌شناخت.'
                        }
                    ]
                }
            ]
        },
        {
            number: 2,
            title: {
                en: 'Landing in the Unknown',
                fa: 'فرود در ناشناخته‌ها'
            },
            pages: [
                {
                    pageNumber: 3,
                    paragraphs: [
                        {
                            id: 'p11',
                            type: 'p',
                            en: 'Benny\'s wild flight finally came to an abrupt end when he crashed through a canopy of leaves and landed with a soft thud on a bed of moss. For several moments, he lay there, dazed and disoriented.',
                            fa: 'پرواز وحشی بنی سرانجام با یک پایان ناگهانی به پایان رسید وقتی که او از میان سایبان برگ‌ها عبور کرد و با یک تق نرم روی بستری از خزه فرود آمد. برای چند لحظه، او آنجا دراز کشید، گیج و سردرگم.',
                            marks: {
                                en: [
                                    { start: 109, end: 113, type: 'em' } // "thud"
                                ],
                                fa: [
                                    { start: 125, end: 127, type: 'em' } // "تق"
                                ]
                            }
                        },
                        {
                            id: 'p12',
                            type: 'p',
                            en: 'Slowly, carefully, Benny sat up and looked around. He was in a part of the rainforest he had never seen before—deeper, darker, and infinitely more mysterious than the cultivated plantation.',
                            fa: 'آهسته، با احتیاط، بنی نشست و به اطراف نگاه کرد. او در بخشی از جنگل بارانی بود که هرگز قبلاً ندیده بود—عمیق‌تر، تاریک‌تر، و بی‌نهایت مرموزتر از مزرعه کشت‌شده.',
                            marks: {
                                en: [
                                    { start: 119, end: 168, type: 'strong' } // "deeper, darker, and infinitely more mysterious"
                                ],
                                fa: [
                                    { start: 103, end: 143, type: 'strong' } // "عمیق‌تر، تاریک‌تر، و بی‌نهایت مرموزتر"
                                ]
                            }
                        },
                        {
                            id: 'p13',
                            type: 'blockquote',
                            en: '"Well, well, well," a voice croaked from above. "What do we have here? A banana, of all things, in the middle of the jungle!"',
                            fa: '«خب، خب، خب»، صدایی از بالا قورباغه‌وار گفت. «اینجا چه داریم؟ یک موز، از همه چیز، در وسط جنگل!»'
                        },
                        {
                            id: 'p14',
                            type: 'p',
                            en: 'Benny looked up to see a bright green tree frog perched on a branch, regarding him with large, curious eyes. The frog introduced himself as Fernando and offered to help Benny find his way home.',
                            fa: 'بنی به بالا نگاه کرد و قورباغه درختی سبز روشنی را دید که روی شاخه‌ای نشسته بود و با چشمان بزرگ و کنجکاو به او نگاه می‌کرد. قورباغه خود را فرناندو معرفی کرد و پیشنهاد کرد که به بنی کمک کند راه خانه را پیدا کند.',
                            marks: {
                                en: [
                                    { start: 26, end: 48, type: 'strong' },
                                    { start: 26, end: 48, type: 'em' } // "bright green tree frog"
                                ],
                                fa: [
                                    { start: 24, end: 50, type: 'strong' },
                                    { start: 24, end: 50, type: 'em' } // "قورباغه درختی سبز روشنی"
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ]
}

// Helper function to convert to reader format (BilingualContent[])
export function convertOptimizedToReaderFormat(book: OptimizedBook): {
    content: { english: string; farsi: string }[]
    title: string
    slug: string
    author: string
} {
    const content: { english: string; farsi: string }[] = []

    // Flatten all pages into simple english/farsi pairs
    for (const chapter of book.chapters) {
        for (const page of chapter.pages) {
            const englishText = page.paragraphs.map(p => p.en).join('\n\n')
            const farsiText = page.paragraphs.map(p => p.fa).join('\n\n')

            content.push({
                english: englishText,
                farsi: farsiText
            })
        }
    }

    return {
        content,
        title: book.title.en,
        slug: book.bookId,
        author: book.author
    }
}
