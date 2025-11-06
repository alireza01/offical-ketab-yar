import { updateSession } from "@/lib/supabase/middleware"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Next.js 16+ Middleware with Proxy Export Pattern
 * 
 * This middleware handles:
 * 1. Authentication & Session Management (Supabase)
 * 2. Route Protection (Private vs Public)
 * 3. Development Mode Flexibility
 * 
 * Architecture:
 * - Public Zone (SSG): /, /books/[slug], /about, /auth/* - No auth required
 * - Private Zone (CSR): /dashboard, /profile, /vocabulary, /library/* - Auth required
 */

// Define route patterns
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/help',
  '/blog',
  '/books', // Book detail pages (SSG)
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/callback',
  '/offline',
  '/api/auth', // Auth API routes
]

const ADMIN_ROUTES = [
  '/admin',
  '/Studio',
]

/**
 * Main middleware function using Next.js 16 proxy pattern
 */
export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  // 1. Skip middleware for static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('/api/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next()
  }

  // 2. Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // 3. Check if route is admin
  const isAdminRoute = ADMIN_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // 4. Check Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'your_supabase_url_here'

  // 5. Development mode: Allow all routes if Supabase not configured
  if (process.env.NODE_ENV === 'development' && !isSupabaseConfigured) {
    console.log(`[Middleware] Dev mode without Supabase - allowing: ${pathname}`)
    return NextResponse.next()
  }

  // 6. Public routes: Always allow
  if (isPublicRoute) {
    // Still update session for public routes (for user state)
    if (isSupabaseConfigured) {
      return await updateSession(request)
    }
    return NextResponse.next()
  }

  // 7. Protected routes: Require authentication
  if (isSupabaseConfigured) {
    const response = await updateSession(request)

    // Check if user is authenticated
    const supabaseResponse = response.headers.get('x-middleware-supabase-user')
    const isAuthenticated = supabaseResponse !== null

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', origin)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin routes: Additional check for admin role
    if (isAdminRoute) {
      // TODO: Add admin role check here when user roles are implemented
      // For now, just check authentication
    }

    return response
  }

  // 8. Fallback: Allow access (shouldn't reach here in production)
  return NextResponse.next()
}

/**
 * Backward compatibility export
 * Allows older Next.js versions to use this middleware
 */
export const middleware = proxy

/**
 * Middleware configuration
 * Defines which routes should run through middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (public files)
     * - Static assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
}
