"use client"

import { createBrowserClient } from "@supabase/ssr"
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config"

export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables")
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
