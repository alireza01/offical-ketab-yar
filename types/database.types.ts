export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          level: 'beginner' | 'intermediate' | 'advanced'
          language_preference: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          language_preference?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          language_preference?: string
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          author: string
          author_id: string | null
          description: string | null
          cover_url: string | null
          slug: string
          language: string
          level: string
          total_pages: number
          is_premium: boolean
          free_preview_pages: number
          category_id: string | null
          rating: number | null
          status: 'draft' | 'published' | 'archived'
          featured: boolean
          view_count: number
          genres: string[] | null
          publication_year: number | null
          isbn: string | null
          publisher: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          author: string
          author_id?: string | null
          description?: string | null
          cover_url?: string | null
          slug: string
          language?: string
          level?: string
          total_pages?: number
          is_premium?: boolean
          free_preview_pages?: number
          category_id?: string | null
          rating?: number | null
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          view_count?: number
          genres?: string[] | null
          publication_year?: number | null
          isbn?: string | null
          publisher?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          author?: string
          author_id?: string | null
          description?: string | null
          cover_url?: string | null
          slug?: string
          language?: string
          level?: string
          total_pages?: number
          is_premium?: boolean
          free_preview_pages?: number
          category_id?: string | null
          rating?: number | null
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          view_count?: number
          genres?: string[] | null
          publication_year?: number | null
          isbn?: string | null
          publisher?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      book_content: {
        Row: {
          id: string
          book_id: string
          page_number: number
          content: string
          language: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          page_number: number
          content: string
          language?: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          page_number?: number
          content?: string
          language?: string
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          current_page: number
          is_completed: boolean
          reading_time: number
          last_read_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          current_page?: number
          is_completed?: boolean
          reading_time?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          current_page?: number
          is_completed?: boolean
          reading_time?: number
          last_read_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      vocabulary: {
        Row: {
          id: string
          user_id: string
          word: string
          meaning: string
          definition: string | null
          context: string | null
          book_id: string | null
          page_number: number | null
          level: string
          status: string
          next_review_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          meaning: string
          definition?: string | null
          context?: string | null
          book_id?: string | null
          page_number?: number | null
          level?: string
          status?: string
          next_review_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          meaning?: string
          definition?: string | null
          context?: string | null
          book_id?: string | null
          page_number?: number | null
          level?: string
          status?: string
          next_review_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          book_id: string
          page_number: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          page_number: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          page_number?: number
          created_at?: string
        }
      }
      highlights: {
        Row: {
          id: string
          user_id: string
          book_id: string
          page_number: number
          text: string
          color: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          page_number: number
          text: string
          color?: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          page_number?: number
          text?: string
          color?: string
          note?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          bio: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          photo_url?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          book_id: string
          rating: number
          comment: string | null
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          rating: number
          comment?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          rating?: number
          comment?: string | null
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
