/**
 * TEMPORARY MOCK DATA FOR DEVELOPMENT
 * 
 * This file contains mock data used during development and testing.
 * TODO: Replace with real Supabase queries when database is fully populated.
 * 
 * Used by:
 * - app/books/[slug]/page.tsx
 * - app/books/read/[slug]/page.tsx
 * - components/books/book-detail-client.tsx
 * - components/books/book-grid.tsx
 * - components/home/featured-books.tsx
 * - components/home/trending-books.tsx
 * - components/reader/professional-reader.tsx
 */

export interface MockBook {
  id: string
  slug: string
  title: string
  subtitle?: string
  author: string
  authorId: string
  coverImage: string
  genre: string[]
  rating: number
  reviewCount: number
  pageCount: number
  publicationYear: number
  language: string[]
  summary: string
  isbn: string
  publisher: string
  freePreviewPages: number
  status: 'published' | 'draft'
  content: string[]
}

export interface MockAuthor {
  id: string
  name: string
  bio: string
  photoUrl: string
  bookCount: number
}

export interface MockReview {
  id: string
  bookId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  helpfulCount: number
  createdAt: string
}

export const mockAuthors: MockAuthor[] = [
  {
    id: '1',
    name: 'F. Scott Fitzgerald',
    bio: 'Francis Scott Key Fitzgerald was an American novelist and short story writer.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bookCount: 4
  },
  {
    id: '2',
    name: 'Jane Austen',
    bio: 'Jane Austen was an English novelist known primarily for her six major novels.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bookCount: 6
  },
  {
    id: '3',
    name: 'George Orwell',
    bio: 'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bookCount: 8
  },
  {
    id: '4',
    name: 'Harper Lee',
    bio: 'Nelle Harper Lee was an American novelist best known for To Kill a Mockingbird.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bookCount: 2
  }
]

function generateMockContent(pageCount: number): string[] {
  const pages: string[] = []
  const sampleTexts = [
    'In my younger and more vulnerable years my father gave me some advice...',
    'It is a truth universally acknowledged, that a single man in possession of a good fortune...',
    'It was a bright cold day in April, and the clocks were striking thirteen...',
    'When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow...',
    'Mr. Jones, of the Manor Farm, had locked the hen-houses for the night...',
  ]
  
  for (let i = 0; i < pageCount; i++) {
    const textIndex = i % sampleTexts.length
    pages.push(`Page ${i + 1}\n\n${sampleTexts[textIndex]}\n\nSample content continues...`)
  }
  
  return pages
}

export const mockBooks: MockBook[] = [
  {
    id: '1',
    slug: 'the-great-gatsby',
    title: 'The Great Gatsby',
    subtitle: 'A Novel of the Jazz Age',
    author: 'F. Scott Fitzgerald',
    authorId: '1',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    genre: ['Classic', 'Fiction', 'Romance'],
    rating: 4.5,
    reviewCount: 1234,
    pageCount: 180,
    publicationYear: 1925,
    language: ['English', 'Persian'],
    summary: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald.',
    isbn: '978-0-7432-7356-5',
    publisher: 'Scribner',
    freePreviewPages: 20,
    status: 'published',
    content: generateMockContent(180)
  },
  {
    id: '2',
    slug: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    authorId: '2',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    genre: ['Classic', 'Romance', 'Fiction'],
    rating: 4.7,
    reviewCount: 2156,
    pageCount: 432,
    publicationYear: 1813,
    language: ['English', 'Persian'],
    summary: 'Pride and Prejudice is an 1813 novel of manners written by Jane Austen.',
    isbn: '978-0-14-143951-8',
    publisher: 'Penguin Classics',
    freePreviewPages: 30,
    status: 'published',
    content: generateMockContent(432)
  },
  {
    id: '3',
    slug: '1984',
    title: '1984',
    subtitle: 'A Dystopian Social Science Fiction Novel',
    author: 'George Orwell',
    authorId: '3',
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    genre: ['Science Fiction', 'Dystopian', 'Classic'],
    rating: 4.8,
    reviewCount: 3421,
    pageCount: 328,
    publicationYear: 1949,
    language: ['English', 'Persian'],
    summary: 'Nineteen Eighty-Four is a dystopian social science fiction novel by George Orwell.',
    isbn: '978-0-452-28423-4',
    publisher: 'Signet Classic',
    freePreviewPages: 25,
    status: 'published',
    content: generateMockContent(328)
  },
  {
    id: '4',
    slug: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    authorId: '4',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    genre: ['Classic', 'Fiction', 'Historical'],
    rating: 4.6,
    reviewCount: 2876,
    pageCount: 324,
    publicationYear: 1960,
    language: ['English', 'Persian'],
    summary: 'To Kill a Mockingbird is a novel by the American author Harper Lee.',
    isbn: '978-0-06-112008-4',
    publisher: 'Harper Perennial',
    freePreviewPages: 20,
    status: 'published',
    content: generateMockContent(324)
  },
  {
    id: '5',
    slug: 'animal-farm',
    title: 'Animal Farm',
    subtitle: 'A Fairy Story',
    author: 'George Orwell',
    authorId: '3',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    genre: ['Classic', 'Fiction', 'Political'],
    rating: 4.4,
    reviewCount: 1987,
    pageCount: 112,
    publicationYear: 1945,
    language: ['English', 'Persian'],
    summary: 'Animal Farm is a beast fable by George Orwell.',
    isbn: '978-0-452-28424-1',
    publisher: 'Signet Classic',
    freePreviewPages: 15,
    status: 'published',
    content: generateMockContent(112)
  },
  {
    id: '6',
    slug: 'sense-and-sensibility',
    title: 'Sense and Sensibility',
    author: 'Jane Austen',
    authorId: '2',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    genre: ['Classic', 'Romance', 'Fiction'],
    rating: 4.3,
    reviewCount: 1543,
    pageCount: 409,
    publicationYear: 1811,
    language: ['English', 'Persian'],
    summary: 'Sense and Sensibility is a novel by Jane Austen, published in 1811.',
    isbn: '978-0-14-143966-2',
    publisher: 'Penguin Classics',
    freePreviewPages: 30,
    status: 'published',
    content: generateMockContent(409)
  }
]

export const mockReviews: MockReview[] = [
  {
    id: '1',
    bookId: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'An absolute masterpiece! Fitzgerald\'s prose is beautiful.',
    helpfulCount: 45,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    bookId: '1',
    userId: 'user2',
    userName: 'Michael Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 4,
    comment: 'Great book, though it took me a while to get into it.',
    helpfulCount: 23,
    createdAt: '2024-02-20'
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
  return mockReviews.filter(review => review.bookId === bookId)
}

export function getRelatedBooks(bookId: string, limit: number = 4): MockBook[] {
  const book = getBookById(bookId)
  if (!book) return []
  
  return mockBooks
    .filter(b => b.id !== bookId && b.genre.some(g => book.genre.includes(g)))
    .slice(0, limit)
}

export function getBooksByGenre(genre: string): MockBook[] {
  return mockBooks.filter(book => book.genre.includes(genre))
}

export function getBooksByAuthor(authorId: string): MockBook[] {
  return mockBooks.filter(book => book.authorId === authorId)
}
