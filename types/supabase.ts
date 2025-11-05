/**
 * Supabase Helper Types
 * 
 * @description Convenient type aliases for database tables
 * @example
 * ```typescript
 * import { Book, User, Vocabulary } from '@/types'
 * 
 * const book: Book = await getBook(id)
 * ```
 */

import { Database as DatabaseType } from "./database.types"

export type { DatabaseType as Database }

export type Tables<T extends keyof DatabaseType["public"]["Tables"]> =
  DatabaseType["public"]["Tables"][T]["Row"]

export type Inserts<T extends keyof DatabaseType["public"]["Tables"]> =
  DatabaseType["public"]["Tables"][T]["Insert"]

export type Updates<T extends keyof DatabaseType["public"]["Tables"]> =
  DatabaseType["public"]["Tables"][T]["Update"]

// ============================================
// TABLE TYPE ALIASES
// ============================================

/** Book table row type */
export type Book = Tables<"books">

/** User table row type */
export type User = Tables<"users">

/** Profile table row type */
export type Profile = Tables<"profiles">

/** Author table row type */
export type Author = Tables<"authors">

/** Category table row type */
export type Category = Tables<"categories">

/** Vocabulary table row type */
export type Vocabulary = Tables<"vocabulary">

/** Bookmark table row type */
export type Bookmark = Tables<"bookmarks">

/** Highlight table row type */
export type Highlight = Tables<"highlights">

/** Review table row type */
export type Review = Tables<"reviews">

/** Reading session table row type */
export type ReadingSession = Tables<"reading_sessions">

/** Review session table row type */
export type ReviewSession = Tables<"review_sessions">

/** Achievement table row type */
export type Achievement = Tables<"achievements">

/** User achievement table row type */
export type UserAchievement = Tables<"user_achievements">

/** User library table row type */
export type UserLibrary = Tables<"user_library">
