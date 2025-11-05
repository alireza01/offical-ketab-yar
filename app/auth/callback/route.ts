import { logger } from "@/lib/logger"
import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const redirectTo = requestUrl.searchParams.get("redirect") || "/dashboard"

  if (code) {
    try {
      const supabase = await createServerClient()

      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        logger.error('Failed to exchange code for session', error, {
          context: 'AuthCallback',
        })
        return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
      }

      // Check if user profile exists, create if not (Agent 0: Defensive Programming)
      if (data.user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (!existingUser) {
          // Initialize user profile with gamification (Agent 3: Psychology)
          await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
            xp: 10, // Welcome bonus!
            current_streak: 0,
            subscription_tier: 'free',
          })

          logger.info('New user profile created', {
            context: 'AuthCallback',
            metadata: { userId: data.user.id },
          })
        }
      }

      logger.info('User authenticated successfully', {
        context: 'AuthCallback',
        metadata: { userId: data.user?.id },
      })
    } catch (error) {
      logger.error('Unexpected error in auth callback', error, {
        context: 'AuthCallback',
      })
      return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
