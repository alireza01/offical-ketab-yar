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

export interface BaseWord {
  id: string
  word: string
  meaning: string
  level: "beginner" | "intermediate" | "advanced"
}

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

export interface WordStats {
  total: number
  learning: number
  reviewing: number
  mastered: number
}

export interface FlashcardData {
  id: string
  word: string
  meaning: string
  definition?: string
  examples?: string[]
  level: string
  status: string
}

export interface QuizQuestion {
  id: string
  word: string
  correctAnswer: string
  options: string[]
  type: "multiple-choice" | "fill-blank" | "match"
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeSpent: number
  completedAt: string
}

export interface WordSuggestion {
  word: string
  meaning: string
  level: string
  frequency: number
}
