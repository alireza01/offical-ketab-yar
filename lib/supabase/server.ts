"use server"

import { createMockSupabaseClient } from "@/lib/mock-data/mock-supabase"
import type { CookieOptions } from "@supabase/ssr"
import { createServerClient as createSSRClient } from "@supabase/ssr"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"
import { DEFAULT_COOKIE_OPTIONS, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config"

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'

export async function createServerClient() {
  // In dev mode without Supabase, return comprehensive mock client with real data
  if (DEV_MODE || !SUPABASE_URL || SUPABASE_URL === 'https://placeholder.supabase.co' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'placeholder-key') {
    console.log('🎭 DEV MODE (Server): Using mock Supabase with sample data')
    return createMockSupabaseClient()
  }

  const cookieStore = await cookies()

  return createSSRClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              ...DEFAULT_COOKIE_OPTIONS,
              ...options as Omit<ResponseCookie, "value">,
              name,
              value,
            })
          } catch (error) {
            // Cookie setting failed - this is expected in some environments
            if (process.env.NODE_ENV === 'development') {
              console.warn("Failed to set cookie:", error)
            }
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              ...DEFAULT_COOKIE_OPTIONS,
              ...options as Omit<ResponseCookie, "value">,
              name,
              value: "",
              maxAge: 0,
            })
          } catch (error) {
            // Cookie removal failed - this is expected in some environments
            if (process.env.NODE_ENV === 'development') {
              console.warn("Failed to remove cookie:", error)
            }
          }
        },
      },
    }
  )
}
