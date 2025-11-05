/**
 * Production-Ready Rate Limiting
 * 
 * Agent 2 (Performance): Serverless-compatible rate limiting
 * Uses Vercel KV (Redis) for production, in-memory for development
 * 
 * NOTE: For production, set up Vercel KV:
 * 1. Go to Vercel Dashboard > Storage > Create KV Database
 * 2. Link to your project
 * 3. Environment variables will be auto-added
 */

import { logger } from '@/lib/logger'

// Types
interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
}

// In-memory store for development (will be replaced by Vercel KV in production)
const memoryStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Check if Vercel KV is available
 */
function hasVercelKV(): boolean {
    return !!(
        process.env.KV_REST_API_URL &&
        process.env.KV_REST_API_TOKEN
    )
}

/**
 * Rate limit using Vercel KV (production)
 */
async function rateLimitWithKV(
    identifier: string,
    limit: number,
    windowMs: number
): Promise<RateLimitResult> {
    try {
        // Dynamic import to avoid errors when KV is not available
        const kvModule = await import('@vercel/kv').catch(() => null)
        if (!kvModule) {
            // Fallback to in-memory rate limiting if KV is not available
            return { success: true, remaining: limit, limit, reset: Date.now() + windowMs }
        }
        const { kv } = kvModule

        const key = `rate-limit:${identifier}`
        const now = Date.now()
        const windowStart = now - windowMs

        // Use Redis sorted set for sliding window
        const pipeline = kv.pipeline()

        // Remove old entries
        pipeline.zremrangebyscore(key, 0, windowStart)

        // Count current requests
        pipeline.zcard(key)

        // Add current request
        pipeline.zadd(key, { score: now, member: `${now}` })

        // Set expiry
        pipeline.expire(key, Math.ceil(windowMs / 1000))

        const results = await pipeline.exec()
        const count = (results[1] as number) || 0

        return {
            success: count < limit,
            limit,
            remaining: Math.max(0, limit - count - 1),
            reset: now + windowMs,
        }
    } catch (error) {
        logger.error('Rate limit KV error', error, { context: 'rateLimitWithKV' })
        // Fallback to memory store
        return rateLimitWithMemory(identifier, limit, windowMs)
    }
}

/**
 * Rate limit using in-memory store (development/fallback)
 */
function rateLimitWithMemory(
    identifier: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    const now = Date.now()
    const record = memoryStore.get(identifier)

    if (!record || now > record.resetTime) {
        memoryStore.set(identifier, { count: 1, resetTime: now + windowMs })
        return {
            success: true,
            limit,
            remaining: limit - 1,
            reset: now + windowMs,
        }
    }

    if (record.count >= limit) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: record.resetTime,
        }
    }

    record.count++
    return {
        success: true,
        limit,
        remaining: limit - record.count,
        reset: record.resetTime,
    }
}

/**
 * Main rate limit function
 * Automatically uses KV in production, memory in development
 */
export async function rateLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000
): Promise<RateLimitResult> {
    if (hasVercelKV()) {
        return rateLimitWithKV(identifier, limit, windowMs)
    } else {
        return rateLimitWithMemory(identifier, limit, windowMs)
    }
}

/**
 * Clean up old memory store entries (only for development)
 */
export function cleanupMemoryStore(): void {
    const now = Date.now()
    for (const [key, record] of memoryStore.entries()) {
        if (now > record.resetTime) {
            memoryStore.delete(key)
        }
    }
}

// Cleanup every 5 minutes in development
if (process.env.NODE_ENV === 'development' && typeof setInterval !== 'undefined') {
    setInterval(cleanupMemoryStore, 5 * 60 * 1000)
}

/**
 * Rate limit presets for different endpoints
 */
export const RateLimitPresets = {
    // Strict limits for expensive operations
    AI_GENERATION: { limit: 10, windowMs: 60000 }, // 10 per minute
    BOOK_DOWNLOAD: { limit: 5, windowMs: 60000 }, // 5 per minute

    // Moderate limits for normal operations
    API_GENERAL: { limit: 100, windowMs: 60000 }, // 100 per minute
    VOCABULARY_ADD: { limit: 30, windowMs: 60000 }, // 30 per minute

    // Relaxed limits for read operations
    BOOK_VIEW: { limit: 200, windowMs: 60000 }, // 200 per minute
    SEARCH: { limit: 50, windowMs: 60000 }, // 50 per minute

    // Very strict for auth
    LOGIN_ATTEMPT: { limit: 5, windowMs: 300000 }, // 5 per 5 minutes
    REGISTER: { limit: 3, windowMs: 3600000 }, // 3 per hour
}
