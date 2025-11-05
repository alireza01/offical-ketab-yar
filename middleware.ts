import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 🔥 CRITICAL FIX: Check DEV_MODE first to prevent server crashes
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // In DEV_MODE or without Supabase, skip all auth checks
  if (DEV_MODE || !supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
    console.log('🎭 Middleware: DEV_MODE active, skipping auth')
    return NextResponse.next()
  }

  // Skip middleware for public routes
  const publicRoutes = [
    '/',
    '/auth/error',
    '/auth/login',
    '/auth/register',
    '/library', // Public library - all books with search/filter
    '/books', // Book detail pages
    '/about',
  ]

  // Protected routes that require authentication
  const protectedRoutes = [
    '/profile',
    '/dashboard',
    '/my-books', // Personal books - requires login
    '/vocabulary',
    '/review',
    '/settings',
    '/subscription',
  ]

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If Supabase is configured, use session management
  const response = await updateSession(request)

  // Check if user is authenticated for protected routes
  if (isProtectedRoute) {
    const supabase = await (await import('@/lib/supabase/server')).createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
