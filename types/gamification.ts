/**
 * Gamification Types for Ketab-Yar
 * Implements XP system, streaks, and levels as per blueprint
 */

export interface UserGamification {
    xp: number
    current_streak: number
    last_read_at: string | null
    level: number
    xp_to_next_level: number
    xp_progress_percentage: number
}

export interface ReadingSession {
    id: string
    user_id: string
    book_id: string
    pages_read: number
    duration_minutes: number
    xp_earned: number
    created_at: string
}

export interface XPReward {
    amount: number
    reason: string
    timestamp: number
}

export interface StreakData {
    current: number
    longest: number
    is_active: boolean
    last_read_date: string | null
}

export interface LevelInfo {
    current: number
    title: string
    xp_required: number
    xp_current: number
    progress_percentage: number
}

// XP Calculation Constants (as per Agent 3 psychology)
export const XP_REWARDS = {
    PAGE_READ: 2, // 2 XP per page
    CHAPTER_COMPLETE: 50, // Bonus for completing chapter
    BOOK_COMPLETE: 200, // Bonus for completing book
    DAILY_STREAK: 10, // Bonus for maintaining streak
    WORD_SAVED: 5, // Bonus for saving vocabulary
    QUIZ_CORRECT: 15, // Bonus for correct quiz answer
} as const

// Level System (Duolingo-inspired)
export const LEVEL_THRESHOLDS = [
    { level: 1, xp: 0, title: 'خواننده تازه‌کار' },
    { level: 2, xp: 100, title: 'خواننده علاقه‌مند' },
    { level: 3, xp: 300, title: 'خواننده منظم' },
    { level: 4, xp: 600, title: 'خواننده پرشور' },
    { level: 5, xp: 1000, title: 'خواننده حرفه‌ای' },
    { level: 6, xp: 1500, title: 'خواننده ماهر' },
    { level: 7, xp: 2100, title: 'خواننده خبره' },
    { level: 8, xp: 2800, title: 'خواننده استاد' },
    { level: 9, xp: 3600, title: 'خواننده افسانه‌ای' },
    { level: 10, xp: 5000, title: 'خواننده اسطوره' },
] as const

/**
 * Calculate user level from XP
 */
export function calculateLevel(xp: number): LevelInfo {
    let currentLevel = 1
    let currentThreshold = LEVEL_THRESHOLDS[0]
    let nextThreshold = LEVEL_THRESHOLDS[1]

    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i].xp) {
            currentLevel = LEVEL_THRESHOLDS[i].level
            currentThreshold = LEVEL_THRESHOLDS[i]
            nextThreshold = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i]
            break
        }
    }

    const xpInCurrentLevel = xp - currentThreshold.xp
    const xpNeededForNextLevel = nextThreshold.xp - currentThreshold.xp
    const progressPercentage = xpNeededForNextLevel > 0
        ? Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100)
        : 100

    return {
        current: currentLevel,
        title: currentThreshold.title,
        xp_required: nextThreshold.xp,
        xp_current: xp,
        progress_percentage: Math.round(progressPercentage),
    }
}

/**
 * Calculate XP for reading session
 */
export function calculateReadingXP(pagesRead: number, durationMinutes: number): number {
    const baseXP = pagesRead * XP_REWARDS.PAGE_READ

    // Bonus for longer reading sessions (engagement reward)
    const durationBonus = durationMinutes >= 30 ? 20 : durationMinutes >= 15 ? 10 : 0

    return baseXP + durationBonus
}

/**
 * Check if streak is still active
 */
export function isStreakActive(lastReadDate: string | null): boolean {
    if (!lastReadDate) return false

    const last = new Date(lastReadDate)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Reset time to compare only dates
    last.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    yesterday.setHours(0, 0, 0, 0)

    return last.getTime() === today.getTime() || last.getTime() === yesterday.getTime()
}

/**
 * Format streak display text
 */
export function formatStreakText(streak: number): string {
    if (streak === 0) return 'شروع کنید!'
    if (streak === 1) return 'روز اول'
    return `${streak} روز متوالی`
}
