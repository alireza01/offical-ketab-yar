/**
 * Type guards and helpers for Supabase client
 * Fixes "possibly null" errors throughout the app
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export function ensureSupabaseClient<T extends SupabaseClient>(
    client: T | null
): T {
    if (!client) {
        throw new Error('Supabase client is not initialized')
    }
    return client
}

export function isSupabaseClient<T extends SupabaseClient>(
    client: T | null
): client is T {
    return client !== null
}

// Helper to safely use Supabase client
export async function withSupabase<T>(
    client: SupabaseClient | null,
    callback: (client: SupabaseClient) => Promise<T>
): Promise<T> {
    if (!client) {
        throw new Error('Supabase client is not initialized')
    }
    return callback(client)
}
