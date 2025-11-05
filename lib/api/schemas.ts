/**
 * API Request/Response Schemas
 * Zod validation schemas for all API endpoints
 */

import { z } from 'zod'

// ============================================================================
// READING PROGRESS SCHEMAS
// ============================================================================

export const updateProgressSchema = z.object({
    bookId: z.string().uuid('Invalid book ID'),
    currentPage: z.number().int().min(0, 'Page must be non-negative'),
    totalPages: z.number().int().min(1, 'Total pages must be at least 1'),
    progressPercentage: z.number().min(0).max(100, 'Progress must be 0-100'),
})

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>

// ============================================================================
// XP SCHEMAS
// ============================================================================

export const awardXpSchema = z.object({
    bookId: z.string().uuid('Invalid book ID'),
    xpAmount: z.number().int().min(1).max(1000, 'XP must be 1-1000'),
    reason: z.enum(['page_read', 'chapter_complete', 'book_complete', 'streak_bonus']),
})

export type AwardXpInput = z.infer<typeof awardXpSchema>

// ============================================================================
// STREAK SCHEMAS
// ============================================================================

export const updateStreakSchema = z.object({
    lastReadDate: z.string().datetime('Invalid date format'),
})

export type UpdateStreakInput = z.infer<typeof updateStreakSchema>

// ============================================================================
// VOCABULARY SCHEMAS
// ============================================================================

export const createVocabularySchema = z.object({
    word: z.string().min(1, 'Word is required').max(100, 'Word too long'),
    definition: z.string().optional(),
    bookId: z.string().uuid('Invalid book ID').optional(),
    context: z.string().max(500, 'Context too long').optional(),
})

export type CreateVocabularyInput = z.infer<typeof createVocabularySchema>

export const updateVocabularySchema = z.object({
    id: z.string().uuid('Invalid vocabulary ID'),
    definition: z.string().optional(),
    masteryLevel: z.number().int().min(0).max(5).optional(),
})

export type UpdateVocabularyInput = z.infer<typeof updateVocabularySchema>

// ============================================================================
// BOOK SCHEMAS
// ============================================================================

export const createBookSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long')
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    authorId: z.string().uuid('Invalid author ID').optional(),
    publicationYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
    summary: z.string().max(2000, 'Summary too long').optional(),
    genres: z.array(z.string()).optional(),
    freePreviewPages: z.number().int().min(0).max(100).default(20),
    totalPages: z.number().int().min(1).optional(),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

export type CreateBookInput = z.infer<typeof createBookSchema>

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain number'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

export const siteSettingsSchema = z.object({
    siteName: z.string().min(1).max(100).optional(),
    siteDescription: z.string().max(500).optional(),
    allowRegistration: z.boolean().optional(),
    maintenanceMode: z.boolean().optional(),
})

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate request body against schema
 * Returns parsed data or throws error
 */
export async function validateRequest<T>(
    request: Request,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
    try {
        const body = await request.json()
        const data = schema.parse(body)
        return { success: true, data }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.errors[0]
            return {
                success: false,
                error: `${firstError.path.join('.')}: ${firstError.message}`
            }
        }
        return { success: false, error: 'Invalid request body' }
    }
}
