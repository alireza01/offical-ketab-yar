import { applyRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema (Agent 2 - Security)
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: Request) {
  try {
    // Rate limiting (Agent 2 - Security)
    const rateLimitResult = await applyRateLimit(request, {
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 3, // 3 registration attempts per minute
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          }
        }
      );
    }

    const body = await request.json();

    // Validate input (Agent 2 - Security)
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const supabase = await createClient();

    // Check if registration is allowed
    const { data: settings } = await supabase
      .from('site_settings')
      .select('allow_registration')
      .single();

    if (!settings?.allow_registration) {
      return NextResponse.json(
        { message: 'Registration is currently disabled' },
        { status: 403 }
      );
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
      },
    });

    if (error) {
      // Log error for monitoring (Agent 2)
      console.error('[Registration Error]', {
        email,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Log successful registration (Agent 2 - Audit)
    console.log('[Registration Success]', {
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Check your email to confirm your account'
      },
      { status: 200 }
    );
  } catch (error) {
    // Log unexpected errors (Agent 2)
    console.error('[Registration Unexpected Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 
