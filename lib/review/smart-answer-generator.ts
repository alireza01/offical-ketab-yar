// Smart Answer Generator - High Quality Quiz Options
// Generates challenging wrong answers that aren't obviously wrong

import type { Database } from '@/types/database.types'

type VocabularyWord = Database['public']['Tables']['vocabulary']['Row']

interface SmartQuizOptions {
    correct: string
    options: string[]
    difficulty: 'easy' | 'medium' | 'hard'
}

/**
 * Generate smart wrong answers that are challenging but fair
 * Uses multiple strategies to create high-quality distractors
 */
export function generateSmartOptions(
    correctWord: VocabularyWord,
    allUserWords: VocabularyWord[],
    preferredDifficulty: 'easy' | 'medium' | 'hard' = 'medium'
): SmartQuizOptions {
    const wrongAnswers: string[] = []

    // Strategy 1: Words from same book (contextually similar)
    const sameBookWords = allUserWords.filter(
        w => w.book_id === correctWord.book_id &&
            w.id !== correctWord.id &&
            w.meaning !== correctWord.meaning
    )

    if (sameBookWords.length > 0) {
        const randomSameBook = sameBookWords[Math.floor(Math.random() * sameBookWords.length)]
        wrongAnswers.push(randomSameBook.meaning)
    }

    // Strategy 2: Words with same difficulty level
    const sameLevelWords = allUserWords.filter(
        w => w.level === correctWord.level &&
            w.id !== correctWord.id &&
            w.meaning !== correctWord.meaning &&
            !wrongAnswers.includes(w.meaning)
    )

    if (sameLevelWords.length > 0) {
        const randomSameLevel = sameLevelWords[Math.floor(Math.random() * sameLevelWords.length)]
        wrongAnswers.push(randomSameLevel.meaning)
    }

    // Strategy 3: Words saved around same time (similar learning phase)
    const similarTimeWords = allUserWords.filter(w => {
        if (w.id === correctWord.id || wrongAnswers.includes(w.meaning)) return false

        const timeDiff = Math.abs(
            new Date(w.created_at).getTime() -
            new Date(correctWord.created_at).getTime()
        )
        // Within 2 weeks
        return timeDiff < 14 * 24 * 60 * 60 * 1000
    })

    if (similarTimeWords.length > 0 && wrongAnswers.length < 3) {
        const randomSimilarTime = similarTimeWords[Math.floor(Math.random() * similarTimeWords.length)]
        wrongAnswers.push(randomSimilarTime.meaning)
    }

    // Strategy 4: Fill remaining with random words (avoid too obvious differences)
    const remainingWords = allUserWords.filter(
        w => w.id !== correctWord.id &&
            !wrongAnswers.includes(w.meaning) &&
            w.meaning !== correctWord.meaning
    )

    while (wrongAnswers.length < 3 && remainingWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingWords.length)
        const randomWord = remainingWords[randomIndex]
        wrongAnswers.push(randomWord.meaning)
        remainingWords.splice(randomIndex, 1)
    }

    // If still not enough options, use fallback
    while (wrongAnswers.length < 3) {
        wrongAnswers.push(`گزینه ${wrongAnswers.length + 1}`)
    }

    // Shuffle all options
    const allOptions = [correctWord.meaning, ...wrongAnswers]
    const shuffled = allOptions.sort(() => Math.random() - 0.5)

    return {
        correct: correctWord.meaning,
        options: shuffled,
        difficulty: preferredDifficulty
    }
}

/**
 * Calculate optimal difficulty based on user performance
 */
export function calculateOptimalDifficulty(
    recentAccuracy: number,
    currentStreak: number
): 'easy' | 'medium' | 'hard' {
    // Adaptive difficulty
    if (recentAccuracy < 50 || currentStreak < 3) {
        return 'easy'
    } else if (recentAccuracy < 75 || currentStreak < 7) {
        return 'medium'
    } else {
        return 'hard'
    }
}

/**
 * Score answer quality (how good the wrong answers are)
 */
export function scoreAnswerQuality(
    correctAnswer: string,
    wrongAnswers: string[]
): number {
    let score = 0

    // Check length similarity (good distractors have similar length)
    const correctLength = correctAnswer.length
    wrongAnswers.forEach(wrong => {
        const lengthDiff = Math.abs(wrong.length - correctLength)
        if (lengthDiff < 10) score += 25 // Similar length = good
    })

    // Check uniqueness (all different)
    const unique = new Set(wrongAnswers).size === wrongAnswers.length
    if (unique) score += 25

    return Math.min(score, 100)
}
