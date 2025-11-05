"use server"

import { cookies } from "next/headers"
import { createServerClient as createSSRClient } from "@supabase/ssr"
import type { CookieOptions } from "@supabase/ssr"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { SUPABASE_URL, SUPABASE_ANON_KEY, DEFAULT_COOKIE_OPTIONS } from "./config"

export async function createServerClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables")
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
