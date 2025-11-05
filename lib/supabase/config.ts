const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

// Validate environment variables (skip in dev mode)
if (!DEV_MODE) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here') {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL - running in dev mode without Supabase')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY - running in dev mode without Supabase')
  }
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// PWA-optimized cookie options
export const DEFAULT_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30, // 30 days for PWA persistence
}
