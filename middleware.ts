import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  const publicRoutes = [
    '/',
    '/auth/error',
    '/auth/login',
    '/auth/register',
    '/library',
    '/books',
    '/about',
  ]

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // In development without Supabase, allow access to all routes
  if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here')) {
    return NextResponse.next()
  }

  // If Supabase is configured, use session management
  if (supabaseUrl && supabaseKey) {
    return await updateSession(request)
  }

  // Fallback: allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
