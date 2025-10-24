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

export interface BookCompletion {
    id: string
    user_id: string
    book_id: string
    completed_at: string
    final_progress: number
}

export interface ReadingStats {
    booksCompleted: number
    booksReading: number
    totalPagesRead: number
    readingStreak: number
}

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

export interface ReadingSession {
    book_id: string
    start_page: number
    end_page: number
    duration_minutes: number
    started_at: string
    ended_at: string
}
