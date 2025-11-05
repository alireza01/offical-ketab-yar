import { createMockSupabaseClient } from '@/lib/mock-data/mock-supabase'
import { createBrowserClient as createSSRClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

// 🔥 AGENT 2 FIX: Singleton pattern to prevent infinite loops
// Create client ONCE and reuse it across all components
let browserClient: ReturnType<typeof createSSRClient> | null = null
let clientCreationCount = 0

export function createBrowserClient() {
    clientCreationCount++

    // Return existing client if already created (singleton pattern)
    if (browserClient) {
        console.log(`✅ Reusing existing Supabase client (call #${clientCreationCount})`)
        return browserClient
    }

    // In dev mode without Supabase, return comprehensive mock client with real data
    if (DEV_MODE || !SUPABASE_URL || SUPABASE_URL === 'your_supabase_url_here' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
        console.log(`🎭 DEV MODE: Creating NEW mock Supabase client (call #${clientCreationCount})`)
        browserClient = createMockSupabaseClient()
        return browserClient
    }

    // Create real Supabase client ONCE
    browserClient = createSSRClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            get(name: string) {
                if (typeof document === 'undefined') return undefined
                const value = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith(`${name}=`))
                    ?.split('=')[1]
                return value
            },
            set(name: string, value: string, options: { maxAge?: number; sameSite?: string }) {
                if (typeof document === 'undefined') return
                document.cookie = `${name}=${value}; path=/; ${options.maxAge ? `max-age=${options.maxAge};` : ''
                    } ${options.sameSite ? `samesite=${options.sameSite};` : ''}`
            },
            remove(name: string, options: { maxAge?: number; sameSite?: string }) {
                if (typeof document === 'undefined') return
                document.cookie = `${name}=; path=/; max-age=0`
            },
        },
    })

    return browserClient
}

// Alias for compatibility
export const createClient = createBrowserClient
