/**
 * Central Type Exports for Ketab-Yar
 * 
 * @description Single import point for all type definitions
 * @example
 * ```typescript
 * import { Book, UserGamification, VocabularyWord } from '@/types'
 * ```
 */

// ============================================
// DATABASE TYPES
// ============================================
export type {
    BookStatus, Database, Inserts, Json, ReadingStatus, ReviewSessionType, SubscriptionTier, Tables, Updates, UserLevel, WordStatus
} from './database.types'

// ============================================
// SUPABASE HELPER TYPES
// ============================================
export type {
    Achievement, Author, Book, Bookmark, Category, ReadingSession as DBReadingSession,
    ReviewSession as DBReviewSession, Highlight, Profile, Review, User, UserAchievement, Vocabulary
} from './supabase'

// ============================================
// BOOK TRACKING
// ============================================
export type {
    BookCompletion, BookWithProgress, ReadingProgress, ReadingSession, ReadingStats
} from './book-tracking'

// ============================================
// GAMIFICATION
// ============================================
export type {
    LevelInfo, StreakData, UserGamification,
    XPReward
} from './gamification'

export {
    LEVEL_THRESHOLDS, XP_REWARDS, calculateLevel,
    calculateReadingXP, formatStreakText, isStreakActive
} from './gamification'

// ============================================
// VOCABULARY
// ============================================
export type {
    BaseWord, FlashcardData,
    QuizQuestion as VocabQuizQuestion,
    QuizResult as VocabQuizResult, VocabularyWord, Word,
    WordStats, WordSuggestion
} from './vocabulary'

// ============================================
// REVIEW SYSTEM
// ============================================
export type {
    DailyQuizConfig, QuizQuestion,
    QuizResult, ReviewSession, ReviewStats,
    SpacedRepetitionData
} from './review.types'

