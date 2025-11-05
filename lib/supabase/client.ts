"use client"

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config"

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Export for backward compatibility
export function createBrowserClient() {
  return createClient()
}
