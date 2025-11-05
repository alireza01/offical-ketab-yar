import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 🔥 CRITICAL FIX: Skip in dev mode or with invalid credentials
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  if (DEV_MODE || !SUPABASE_URL || SUPABASE_URL === 'https://placeholder.supabase.co' || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'placeholder-key') {
    console.log('🎭 updateSession: Skipping in DEV_MODE')
    return response
  }

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
