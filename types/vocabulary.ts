/**
 * Vocabulary Types
 * 
 * @description Types for vocabulary management and learning
 * @see Blueprint: Agent 3 - Freemium model (20 word limit for free users)
 */

/**
 * Vocabulary word from database
 * Matches the vocabulary table schema
 */
export interface VocabularyWord {
  id: string
  user_id: string
  word: string
  meaning: string
  definition?: string | null
  context?: string | null
  book_id?: string | null
  page_number?: number | null
  level: "beginner" | "intermediate" | "advanced"
  status: "learning" | "reviewing" | "mastered"
  next_review_at: string
  created_at: string
  updated_at: string
}

/**
 * Base word interface
 * Minimal word data
 */
export interface BaseWord {
  id: string
  word: string
  meaning: string
  level: "beginner" | "intermediate" | "advanced"
}

/**
 * Extended word interface
 * Used in UI components with additional data
 */
export interface Word extends BaseWord {
  definition?: string
  examples?: string[]
  context?: string
  status?: "learning" | "reviewing" | "mastered"
  userId?: string
  createdAt?: string
  nextReviewAt?: string
  book_id?: string
  book_title?: string
}

/**
 * Vocabulary statistics
 * Used in dashboard and vocabulary page
 */
export interface WordStats {
  total: number
  learning: number
  reviewing: number
  mastered: number
}

/**
 * Flashcard data
 * Used in flashcard review system
 */
export interface FlashcardData {
  id: string
  word: string
  meaning: string
  definition?: string
  examples?: string[]
  level: string
  status: string
}

/**
 * Quiz question
 * Used in vocabulary quizzes
 */
export interface QuizQuestion {
  id: string
  word: string
  correctAnswer: string
  options: string[]
  type: "multiple-choice" | "fill-blank" | "match"
}

/**
 * Quiz result
 * Tracks quiz performance
 */
export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: number
  completedAt: string
}

/**
 * Word suggestion
 * Used for recommending words to learn
 */
export interface WordSuggestion {
  word: string
  meaning: string
  level: string
  frequency: number
}
