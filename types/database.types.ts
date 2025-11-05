/**
 * Supabase Database Types
 * Complete type definitions for Ketab-Yar database schema
 * 
 * @description Clean, organized, and fully typed database interface
 * @see Blueprint: Follows Agent 2 performance optimizations
 */

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
            users: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                    preferences: Json | null
                    xp: number
                    current_streak: number
                    last_read_at: string | null
                    subscription_tier: string
                    subscription_expires_at: string | null
                }
                Insert: {
                    id: string
                    email: string
                    name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                    preferences?: Json | null
                    xp?: number
                    current_streak?: number
                    last_read_at?: string | null
                    subscription_tier?: string
                    subscription_expires_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                    preferences?: Json | null
                    xp?: number
                    current_streak?: number
                    last_read_at?: string | null
                    subscription_tier?: string
                    subscription_expires_at?: string | null
                }
            }
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
                    summary: string | null
                    cover_url: string | null
                    cover_image: string | null
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
                    content_json_url_en: string | null
                    content_json_url_fa: string | null
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
                    summary?: string | null
                    cover_url?: string | null
                    cover_image?: string | null
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
                    content_json_url_en?: string | null
                    content_json_url_fa?: string | null
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
                    summary?: string | null
                    cover_url?: string | null
                    cover_image?: string | null
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
                    content_json_url_en?: string | null
                    content_json_url_fa?: string | null
                    created_at?: string
                    updated_at?: string
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
            user_library: {
                Row: {
                    user_id: string
                    book_id: string
                    status: string
                    current_page: number
                    progress_percentage: number
                    started_at: string | null
                    completed_at: string | null
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    book_id: string
                    status?: string
                    current_page?: number
                    progress_percentage?: number
                    started_at?: string | null
                    completed_at?: string | null
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    book_id?: string
                    status?: string
                    current_page?: number
                    progress_percentage?: number
                    started_at?: string | null
                    completed_at?: string | null
                    updated_at?: string
                }
            }
            reading_sessions: {
                Row: {
                    id: string
                    user_id: string
                    book_id: string
                    pages_read: number
                    duration_minutes: number
                    xp_earned: number
                    started_at: string
                    ended_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    book_id: string
                    pages_read: number
                    duration_minutes: number
                    xp_earned: number
                    started_at: string
                    ended_at: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    book_id?: string
                    pages_read?: number
                    duration_minutes?: number
                    xp_earned?: number
                    started_at?: string
                    ended_at?: string
                    created_at?: string
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
            review_sessions: {
                Row: {
                    id: string
                    user_id: string
                    session_type: string
                    words_reviewed: number
                    correct_answers: number
                    incorrect_answers: number
                    xp_earned: number
                    duration_seconds: number
                    completed_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    session_type: string
                    words_reviewed?: number
                    correct_answers?: number
                    incorrect_answers?: number
                    xp_earned?: number
                    duration_seconds?: number
                    completed_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    session_type?: string
                    words_reviewed?: number
                    correct_answers?: number
                    incorrect_answers?: number
                    xp_earned?: number
                    duration_seconds?: number
                    completed_at?: string
                    created_at?: string
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
            achievements: {
                Row: {
                    id: string
                    name: string
                    description: string
                    icon: string
                    points: number
                    requirement_type: string
                    requirement_value: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description: string
                    icon: string
                    points?: number
                    requirement_type: string
                    requirement_value: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string
                    icon?: string
                    points?: number
                    requirement_type?: string
                    requirement_value?: number
                    created_at?: string
                }
            }
            user_achievements: {
                Row: {
                    user_id: string
                    achievement_id: string
                    earned_at: string
                }
                Insert: {
                    user_id: string
                    achievement_id: string
                    earned_at?: string
                }
                Update: {
                    user_id?: string
                    achievement_id?: string
                    earned_at?: string
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

export type Tables<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Row"]

export type Inserts<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Insert"]

export type Updates<T extends keyof Database["public"]["Tables"]> =
    Database["public"]["Tables"][T]["Update"]

export type BookStatus = 'draft' | 'published' | 'archived'
export type UserLevel = 'beginner' | 'intermediate' | 'advanced'
export type ReadingStatus = 'want_to_read' | 'reading' | 'completed'
export type WordStatus = 'learning' | 'reviewing' | 'mastered'
export type SubscriptionTier = 'free' | 'premium' | 'admin'
export type ReviewSessionType = 'daily_quiz' | 'flashcard' | 'typing' | 'mixed'
