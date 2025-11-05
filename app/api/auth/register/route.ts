/**
 * User Registration API
 * 
 * MVP Feature - Phase 1
 * Handle user registration with email/password
 */

import { rateLimit } from '@/lib/api/middleware'
import { registerSchema, validateRequest } from '@/lib/api/schemas'
import { logger } from '@/lib/logger'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Rate limiting (prevent spam registrations)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(`register-${ip}`, 5, 60000) // 5 per minute
    if (!success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Validate request
    const validation = await validateRequest(request, registerSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data
    const supabase = await createServerClient()

    // Check if registration is allowed (for Phase 2 when site_settings exists)
    // For MVP, registration is always allowed
    const allowRegistration = true

    if (!allowRegistration) {
      return NextResponse.json(
        { error: 'Registration is currently disabled' },
        { status: 403 }
      )
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
        data: {
          name: name || email.split('@')[0]
        }
      },
    })

    if (error) {
      logger.error('Registration failed', error, {
        context: 'POST /api/auth/register',
        metadata: { email }
      })
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Create user record in users table (as per blueprint)
    if (data.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          name: name || email.split('@')[0],
          subscription_tier: 'free',
          xp: 0,
          current_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (userError) {
        logger.error('Failed to create user record', userError, {
          context: 'POST /api/auth/register',
          metadata: { userId: data.user.id }
        })
      }
    }

    logger.info('User registered successfully', {
      context: 'POST /api/auth/register',
      metadata: {
        email,
        userId: data.user?.id
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Check your email to confirm your account',
        requiresEmailConfirmation: true
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Registration error', error, {
      context: 'POST /api/auth/register'
    })
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
} 
