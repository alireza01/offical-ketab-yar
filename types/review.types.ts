/**
 * Review System Types
 * 
 * @description Types for vocabulary review and spaced repetition
 * @see Blueprint: Agent 3 - Daily quiz system for engagement
 */

/**
 * Review session record
 * Tracks a complete review session
 */
export interface ReviewSession {
    id: string
    user_id: string
    session_type: 'daily_quiz' | 'flashcard' | 'typing' | 'mixed'
    words_reviewed: number
    correct_answers: number
    incorrect_answers: number
    xp_earned: number
    duration_seconds: number
    completed_at: string
    created_at: string
}

/**
 * Quiz question
 * Individual question in a review session
 */
export interface QuizQuestion {
    id: string
    word_id: string
    word: string
    correct_answer: string
    options: string[]
    question_type: 'multiple_choice' | 'typing' | 'audio'
    difficulty: 'easy' | 'medium' | 'hard'
    context?: string
    book_title?: string
}

/**
 * Quiz result
 * User's answer to a quiz question
 */
export interface QuizResult {
    id: string
    session_id: string
    word_id: string
    user_answer: string
    correct_answer: string
    is_correct: boolean
    time_taken_seconds: number
    created_at: string
}

/**
 * Review statistics
 * Aggregated review performance data
 */
export interface ReviewStats {
    total_sessions: number
    total_words_reviewed: number
    total_correct: number
    total_incorrect: number
    accuracy_percentage: number
    current_streak: number
    longest_streak: number
    total_xp_earned: number
    average_session_duration: number
    last_review_date: string | null
}

/**
 * Spaced repetition data
 * SM-2 algorithm data for optimal review scheduling
 * 
 * @see https://en.wikipedia.org/wiki/SuperMemo#SM-2_algorithm
 */
export interface SpacedRepetitionData {
    word_id: string
    /** Ease factor (1.3 to 2.5) - higher = easier word */
    ease_factor: number
    /** Days until next review */
    interval_days: number
    /** Number of successful reviews */
    repetitions: number
    /** Next scheduled review date */
    next_review_date: string
    /** Last review timestamp */
    last_reviewed_at: string
}

/**
 * Daily quiz configuration
 * Settings for daily quiz generation
 */
export interface DailyQuizConfig {
    /** Number of questions per session */
    questions_per_session: number
    /** Time limit in seconds (null = no limit) */
    time_limit_seconds: number | null
    /** Difficulty distribution */
    difficulty_mix: {
        easy: number
        medium: number
        hard: number
    }
    /** XP reward per correct answer */
    xp_per_correct: number
    /** Bonus XP for maintaining streak */
    streak_bonus_xp: number
}
