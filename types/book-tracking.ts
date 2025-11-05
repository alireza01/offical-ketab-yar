/**
 * Book Tracking Types
 * 
 * @description Types for tracking user reading progress and sessions
 * @see Blueprint: Agent 2 - Client-side tracking for zero server load
 */

/**
 * Reading progress for a specific book
 * Tracks current page, percentage, and timestamps
 */
export interface ReadingProgress {
    id: string
    user_id: string
    book_id: string
    current_page: number
    total_pages: number
    progress_percentage: number
    last_read_at: string
    created_at: string
    updated_at: string
}

/**
 * Book completion record
 * Created when user finishes a book
 */
export interface BookCompletion {
    id: string
    user_id: string
    book_id: string
    completed_at: string
    final_progress: number
}

/**
 * Aggregated reading statistics
 * Used in dashboard display
 */
export interface ReadingStats {
    booksCompleted: number
    booksReading: number
    totalPagesRead: number
    readingStreak: number
}

/**
 * Book with user's progress attached
 * Used in library and dashboard views
 */
export interface BookWithProgress {
    id: string
    slug: string
    title: string
    author: string
    cover_image?: string
    total_pages: number
    progress?: ReadingProgress
    completed?: boolean
}

/**
 * Reading session data
 * Tracks individual reading sessions for XP calculation
 */
export interface ReadingSession {
    book_id: string
    start_page: number
    end_page: number
    duration_minutes: number
    started_at: string
    ended_at: string
}
