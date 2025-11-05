// Spaced Repetition Algorithm (SM-2 Algorithm)
// Based on SuperMemo 2 algorithm for optimal learning

export interface SM2Result {
    interval: number // Days until next review
    repetitions: number
    easeFactor: number
}

/**
 * Calculate next review interval using SM-2 algorithm
 * @param quality - User's performance rating (0-5)
 *   0: Complete blackout
 *   1: Incorrect, but familiar
 *   2: Incorrect, but easy to recall
 *   3: Correct with difficulty
 *   4: Correct with hesitation
 *   5: Perfect recall
 * @param repetitions - Number of consecutive correct answers
 * @param previousInterval - Previous interval in days
 * @param previousEaseFactor - Previous ease factor (1.3 - 2.5)
 */
export function calculateSM2(
    quality: number,
    repetitions: number,
    previousInterval: number,
    previousEaseFactor: number
): SM2Result {
    let easeFactor = previousEaseFactor
    let interval = previousInterval
    let newRepetitions = repetitions

    // Update ease factor
    easeFactor = Math.max(
        1.3,
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )

    // If quality < 3, reset repetitions and set interval to 1 day
    if (quality < 3) {
        newRepetitions = 0
        interval = 1
    } else {
        newRepetitions += 1

        // Calculate new interval
        if (newRepetitions === 1) {
            interval = 1
        } else if (newRepetitions === 2) {
            interval = 6
        } else {
            interval = Math.round(previousInterval * easeFactor)
        }
    }

    return {
        interval,
        repetitions: newRepetitions,
        easeFactor,
    }
}

/**
 * Convert quiz performance to SM-2 quality rating
 */
export function performanceToQuality(
    isCorrect: boolean,
    timeTakenSeconds: number,
    averageTimeSeconds: number
): number {
    if (!isCorrect) {
        return timeTakenSeconds > averageTimeSeconds * 2 ? 0 : 1
    }

    // Correct answer - rate based on speed
    const speedRatio = timeTakenSeconds / averageTimeSeconds

    if (speedRatio < 0.5) return 5 // Very fast
    if (speedRatio < 0.8) return 4 // Fast
    if (speedRatio < 1.2) return 3 // Normal
    return 2 // Slow but correct
}

/**
 * Get words due for review
 */
export function getWordsDueForReview(
    words: Array<{
        next_review_date: string
        ease_factor: number
        interval_days: number
    }>
): typeof words {
    const now = new Date()
    return words.filter(word => new Date(word.next_review_date) <= now)
}

/**
 * Calculate optimal daily review count
 */
export function calculateOptimalReviewCount(
    totalWords: number,
    userLevel: 'beginner' | 'intermediate' | 'advanced'
): number {
    const baseCount = {
        beginner: 10,
        intermediate: 15,
        advanced: 20,
    }[userLevel]

    // Scale based on total vocabulary size
    const scaleFactor = Math.min(1 + totalWords / 100, 2)
    return Math.round(baseCount * scaleFactor)
}

/**
 * Generate quiz questions with optimal difficulty distribution
 */
export function generateQuizDistribution(
    totalQuestions: number,
    userAccuracy: number
): { easy: number; medium: number; hard: number } {
    // Adaptive difficulty based on user performance
    if (userAccuracy < 0.5) {
        // Struggling - more easy questions
        return {
            easy: Math.round(totalQuestions * 0.6),
            medium: Math.round(totalQuestions * 0.3),
            hard: Math.round(totalQuestions * 0.1),
        }
    } else if (userAccuracy < 0.75) {
        // Average - balanced
        return {
            easy: Math.round(totalQuestions * 0.3),
            medium: Math.round(totalQuestions * 0.5),
            hard: Math.round(totalQuestions * 0.2),
        }
    } else {
        // Excellent - more challenging
        return {
            easy: Math.round(totalQuestions * 0.2),
            medium: Math.round(totalQuestions * 0.3),
            hard: Math.round(totalQuestions * 0.5),
        }
    }
}
