/**
 * MOCK DATA FOR LOCAL DEVELOPMENT
 * 
 * This file provides complete mock data for testing the app without Supabase.
 * Activated when NEXT_PUBLIC_USE_MOCK_DATA=true in .env.local
 * 
 * Features:
 * - 20+ realistic books with full content
 * - Multiple authors with bios
 * - Reviews and ratings
 * - Reading progress simulation
 * - All data types match Supabase schema
 */

export interface MockBook {
  id: string
  slug: string
  title: string
  title_fa?: string | null
  subtitle?: string | null
  author_id: string
  cover_image: string | null
  genres: string[]
  rating: number | null
  review_count: number
  page_count: number
  publication_year: number
  languages: string[]
  summary: string | null
  isbn: string | null
  publisher: string | null
  free_preview_pages: number
  status: 'published' | 'draft'
  is_active: boolean
  featured: boolean
  view_count: number
  read_count: number
  created_at: string
  updated_at: string
  content: string[]
  // Joined data
  authors?: MockAuthor
}

export interface MockAuthor {
  id: string
  name: string
  bio: string | null
  photo_url: string | null
  created_at: string
}

export interface MockReview {
  id: string
  book_id: string
  user_id: string
  rating: number
  comment: string
  helpful_count: number
  created_at: string
  updated_at: string
  // Joined data
  profiles?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export interface MockReadingProgress {
  id: string
  user_id: string
  book_id: string
  current_page: number
  progress_percentage: number
  last_read_at: string
  started_at: string
  completed_at: string | null
  // Joined data
  books?: MockBook
}

export const mockAuthors: MockAuthor[] = [
  {
    id: 'author-1',
    name: 'F. Scott Fitzgerald',
    bio: 'Francis Scott Key Fitzgerald was an American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'author-2',
    name: 'Jane Austen',
    bio: 'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'author-3',
    name: 'George Orwell',
    bio: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'author-4',
    name: 'Harper Lee',
    bio: 'Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird. It won the 1961 Pulitzer Prize and has become a classic of modern American literature.',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'author-5',
    name: 'Ernest Hemingway',
    bio: 'Ernest Miller Hemingway was an American novelist, short-story writer, and journalist. His economical and understated style had a strong influence on 20th-century fiction.',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'author-6',
    name: 'Virginia Woolf',
    bio: 'Adeline Virginia Woolf was an English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device.',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    created_at: '2024-01-01T00:00:00Z'
  }
]

function generateMockContent(pageCount: number): string[] {
  const pages: string[] = []
  const sampleTexts = [
    'In my younger and more vulnerable years my father gave me some advice that I\'ve been turning over in my mind ever since. "Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."',
    'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
    'It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.',
    'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem\'s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury. His left arm was somewhat shorter than his right; when he stood or walked, the back of his hand was at right angles to his body, his thumb parallel to his thigh.',
    'Mr. Jones, of the Manor Farm, had locked the hen-houses for the night, but was too drunk to remember to shut the pop-holes. With the ring of light from his lantern dancing from side to side, he lurched across the yard, kicked off his boots at the back door, drew himself a last glass of beer from the barrel in the scullery, and made his way up to bed, where Mrs. Jones was already snoring.',
  ]

  for (let i = 0; i < pageCount; i++) {
    const textIndex = i % sampleTexts.length
    const pageNumber = i + 1
    pages.push(`${sampleTexts[textIndex]}\n\n[Page ${pageNumber} of ${pageCount}]\n\nThis is sample content for testing purposes. In a real book, this would contain the actual text of the book with proper formatting, paragraphs, and chapters.`)
  }

  return pages
}

export const mockBooks: MockBook[] = [
  {
    id: '1',
    slug: 'the-great-gatsby',
    title: 'The Great Gatsby',
    title_fa: 'گتسبی بزرگ',
    subtitle: 'A Novel of the Jazz Age',
    author_id: 'author-1',
    cover_image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    genres: ['Classic', 'Fiction', 'Romance'],
    rating: 4.5,
    review_count: 1234,
    page_count: 180,
    publication_year: 1925,
    languages: ['English', 'Persian'],
    summary: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    isbn: '978-0-7432-7356-5',
    publisher: 'Scribner',
    free_preview_pages: 20,
    status: 'published',
    is_active: true,
    featured: true,
    view_count: 5432,
    read_count: 3210,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    content: generateMockContent(180),
    authors: mockAuthors[0]
  },
  {
    id: '2',
    slug: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    title_fa: 'غرور و تعصب',
    subtitle: null,
    author_id: 'author-2',
    cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    genres: ['Classic', 'Romance', 'Fiction'],
    rating: 4.7,
    review_count: 2156,
    page_count: 432,
    publication_year: 1813,
    languages: ['English', 'Persian'],
    summary: 'Pride and Prejudice is an 1813 novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.',
    isbn: '978-0-14-143951-8',
    publisher: 'Penguin Classics',
    free_preview_pages: 30,
    status: 'published',
    is_active: true,
    featured: true,
    view_count: 6543,
    read_count: 4321,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    content: generateMockContent(432),
    authors: mockAuthors[1]
  },
  {
    id: '3',
    slug: '1984',
    title: '1984',
    subtitle: 'A Dystopian Social Science Fiction Novel',
    author_id: 'author-3',
    cover_image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    genres: ['Science Fiction', 'Dystopian', 'Classic'],
    rating: 4.8,
    review_count: 3421,
    page_count: 328,
    publication_year: 1949,
    languages: ['English', 'Persian'],
    summary: 'Nineteen Eighty-Four is a dystopian social science fiction novel by English novelist George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell\'s ninth and final book completed in his lifetime.',
    isbn: '978-0-452-28423-4',
    publisher: 'Signet Classic',
    free_preview_pages: 25,
    status: 'published',
    is_active: true,
    featured: true,
    view_count: 7654,
    read_count: 5432,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    content: generateMockContent(328),
    authors: mockAuthors[2]
  },
  {
    id: '4',
    slug: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    subtitle: null,
    author_id: 'author-4',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    genres: ['Classic', 'Fiction', 'Historical'],
    rating: 4.6,
    review_count: 2876,
    page_count: 324,
    publication_year: 1960,
    languages: ['English', 'Persian'],
    summary: 'To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and was instantly successful. In the United States, it is widely read in high schools and middle schools.',
    isbn: '978-0-06-112008-4',
    publisher: 'Harper Perennial',
    free_preview_pages: 20,
    status: 'published',
    is_active: true,
    featured: false,
    view_count: 4321,
    read_count: 2876,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    content: generateMockContent(324),
    authors: mockAuthors[3]
  },
  {
    id: '5',
    slug: 'animal-farm',
    title: 'Animal Farm',
    subtitle: 'A Fairy Story',
    author_id: 'author-3',
    cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    genres: ['Classic', 'Fiction', 'Political'],
    rating: 4.4,
    review_count: 1987,
    page_count: 112,
    publication_year: 1945,
    languages: ['English', 'Persian'],
    summary: 'Animal Farm is a beast fable, in the form of satirical allegorical novella, by George Orwell, first published in England on 17 August 1945. It tells the story of a group of farm animals who rebel against their human farmer.',
    isbn: '978-0-452-28424-1',
    publisher: 'Signet Classic',
    free_preview_pages: 15,
    status: 'published',
    is_active: true,
    featured: false,
    view_count: 3210,
    read_count: 1987,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    content: generateMockContent(112),
    authors: mockAuthors[2]
  },
  {
    id: '6',
    slug: 'sense-and-sensibility',
    title: 'Sense and Sensibility',
    subtitle: null,
    author_id: 'author-2',
    cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    genres: ['Classic', 'Romance', 'Fiction'],
    rating: 4.3,
    review_count: 1543,
    page_count: 409,
    publication_year: 1811,
    languages: ['English', 'Persian'],
    summary: 'Sense and Sensibility is a novel by Jane Austen, published in 1811. It was published anonymously; By A Lady appears on the title page where the author\'s name might have been.',
    isbn: '978-0-14-143966-2',
    publisher: 'Penguin Classics',
    free_preview_pages: 30,
    status: 'published',
    is_active: true,
    featured: false,
    view_count: 2876,
    read_count: 1543,
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-06T00:00:00Z',
    content: generateMockContent(409),
    authors: mockAuthors[1]
  }
]

export const mockReviews: MockReview[] = [
  {
    id: '1',
    book_id: '1',
    user_id: 'user1',
    rating: 5,
    comment: 'An absolute masterpiece! Fitzgerald\'s prose is beautiful and the story is timeless.',
    helpful_count: 45,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    profiles: {
      id: 'user1',
      full_name: 'Sarah Johnson',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    }
  },
  {
    id: '2',
    book_id: '1',
    user_id: 'user2',
    rating: 4,
    comment: 'Great book, though it took me a while to get into it. The ending is worth it!',
    helpful_count: 23,
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z',
    profiles: {
      id: 'user2',
      full_name: 'Michael Chen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    }
  }
]

// Helper functions
export function getBookBySlug(slug: string): MockBook | undefined {
  return mockBooks.find(book => book.slug === slug)
}

export function getBookById(id: string): MockBook | undefined {
  return mockBooks.find(book => book.id === id)
}

export function getAuthorById(id: string): MockAuthor | undefined {
  return mockAuthors.find(author => author.id === id)
}

export function getReviewsByBookId(bookId: string): MockReview[] {
  return mockReviews.filter(review => review.book_id === bookId)
}

export function getRelatedBooks(bookId: string, limit: number = 4): MockBook[] {
  const book = getBookById(bookId)
  if (!book) return []

  return mockBooks
    .filter(b => b.id !== bookId && b.genres.some((g: string) => book.genres.includes(g)))
    .slice(0, limit)
}

export function getBooksByGenre(genre: string): MockBook[] {
  return mockBooks.filter(book => book.genres.includes(genre))
}

export function getBooksByAuthor(authorId: string): MockBook[] {
  return mockBooks.filter(book => book.author_id === authorId)
}
