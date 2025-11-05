import { applyRateLimit } from "@/lib/rate-limit"
import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

// Email settings validation schema (Agent 2 - Security)
const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.coerce.number().min(1).max(65535, "Invalid port number"),
  smtpUsername: z.string().email("Invalid email address"),
  smtpPassword: z.string().optional(),
})

// Email settings interface
interface EmailSettings {
  id?: string
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password?: string | null
  updated_at?: string
}

// Helper function to verify admin access (Agent 2 - Security)
async function verifyAdminAccess(supabase: any) {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { authorized: false, error: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { authorized: false, error: 'Forbidden - Admin access required' }
  }

  return { authorized: true, userId: session.user.id }
}

export async function POST(request: Request) {
  try {
    // Rate limiting (Agent 2)
    const rateLimitResult = await applyRateLimit(request, {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    const supabase = await createServerClient()

    // Verify admin access (Agent 2 - Security)
    const authCheck = await verifyAdminAccess(supabase)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      )
    }

    const formData = await request.formData()

    // Validate input (Agent 2 - Security)
    const validation = emailSettingsSchema.safeParse({
      smtpHost: formData.get("smtpHost"),
      smtpPort: formData.get("smtpPort"),
      smtpUsername: formData.get("smtpUsername"),
      smtpPassword: formData.get("smtpPassword"),
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { smtpHost, smtpPort, smtpUsername, smtpPassword } = validation.data

    const settings: Partial<EmailSettings> = {
      smtp_host: smtpHost,
      smtp_port: smtpPort,
      smtp_username: smtpUsername,
      smtp_password: smtpPassword || null,
      updated_at: new Date().toISOString()
    }

    // Only update password if a new one is provided
    if (!settings.smtp_password) {
      delete settings.smtp_password
    }

    // TODO: Implement when email_settings table is created in Supabase
    // const { error } = await supabase.from('email_settings').upsert(settings)
    // if (error) throw error

    // Log successful update (Agent 2 - Audit)
    console.log('[Email Settings Updated]', {
      updatedBy: authCheck.userId,
      smtpHost,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Email settings saved successfully (feature in development)",
      settings: {
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_username: smtpUsername,
      }
    })
  } catch (error) {
    console.error('[Email Settings Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: "Failed to update email settings" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Verify admin access (Agent 2 - Security)
    const authCheck = await verifyAdminAccess(supabase)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: authCheck.error === 'Unauthorized' ? 401 : 403 }
      )
    }

    // TODO: Implement when email_settings table is created
    // const { data, error } = await supabase.from('email_settings').select('*').single()
    // if (error) throw error
    // return NextResponse.json(data)

    // For now, return empty settings (table doesn't exist yet)
    const data = {
      smtp_host: "",
      smtp_port: 587,
      smtp_username: ""
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Email Settings Fetch Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: "Failed to fetch email settings" },
      { status: 500 }
    )
  }
}
