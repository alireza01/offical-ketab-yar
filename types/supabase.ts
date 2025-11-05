import { Database as DatabaseType } from "./database.types"

export type { DatabaseType as Database }

export type Tables<T extends keyof DatabaseType["public"]["Tables"]> =
  DatabaseType["public"]["Tables"][T]["Row"]

export type Inserts<T extends keyof DatabaseType["public"]["Tables"]> =
  DatabaseType["public"]["Tables"][T]["Insert"]

export type Updates<T extends keyof DatabaseType["public"]["Tables"]> =
  DatabaseType["public"]["Tables"][T]["Update"]

export type Book = Tables<"books">
export type Profile = Tables<"profiles">
export type BookContent = Tables<"book_content">
export type UserProgress = Tables<"user_progress">
export type Vocabulary = Tables<"vocabulary">
export type Bookmark = Tables<"bookmarks">
export type Highlight = Tables<"highlights">
export type Category = Tables<"categories">
