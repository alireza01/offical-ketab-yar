/**
 * API Middleware Utilities
 * Reusable middleware for API routes
 */

import { logger } from '@/lib/logger'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Admin authentication middleware
 * Checks if user is authenticated and has admin privileges
 */
export async function requireAdmin() {
    try {
        const supabase = await createServerClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return {
                error: NextResponse.json(
                    { error: 'Unauthorized - Please login' },
                    { status: 401 }
                ),
                user: null,
                supabase: null
            }
        }

        // Check admin status using users table (as per blueprint)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('subscription_tier, email')
            .eq('id', user.id)
            .single()

        if (userError) {
            logger.error('Failed to fetch user data', userError, { context: 'requireAdmin' })
            return {
                error: NextResponse.json(
                    { error: 'Failed to verify admin status' },
                    { status: 500 }
                ),
                user: null,
                supabase: null
            }
        }

        // Admin check: subscription_tier is 'admin' or email ends with @ketabyar.com
        const isAdmin = userData?.subscription_tier === 'admin' ||
            userData?.email?.endsWith('@ketabyar.com')

        if (!isAdmin) {
            return {
                error: NextResponse.json(
                    { error: 'Forbidden - Admin access required' },
                    { status: 403 }
                ),
                user: null,
                supabase: null
            }
        }

        return {
            error: null,
            user,
            supabase
        }
    } catch (error) {
        logger.error('Admin middleware error', error, { context: 'requireAdmin' })
        return {
            error: NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            ),
            user: null,
            supabase: null
        }
    }
}

/**
 * User authentication middleware
 * Checks if user is authenticated
 */
export async function requireAuth() {
    try {
        const supabase = await createServerClient()

        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return {
                error: NextResponse.json(
                    { error: 'Unauthorized - Please login' },
                    { status: 401 }
                ),
                user: null,
                supabase: null
            }
        }

        return {
            error: null,
            user,
            supabase
        }
    } catch (error) {
        logger.error('Auth middleware error', error, { context: 'requireAuth' })
        return {
            error: NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
            ),
            user: null,
            supabase: null
        }
    }
}

/**
 * Rate limiting - MOVED to lib/api/rate-limit.ts
 * Import from there for production-ready rate limiting
 */
export { rateLimit } from './rate-limit'

