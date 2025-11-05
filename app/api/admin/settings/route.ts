import { applyRateLimit } from "@/lib/rate-limit"
import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

// Settings validation schema (Agent 2 - Security)
const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100),
  siteDescription: z.string().max(500).optional(),
  allowRegistration: z.boolean(),
  maintenanceMode: z.boolean(),
})

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
      uniqueTokenPerInterval: 10,
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
    const validation = settingsSchema.safeParse({
      siteName: formData.get("siteName"),
      siteDescription: formData.get("siteDescription"),
      allowRegistration: formData.get("allowRegistration") === "true",
      maintenanceMode: formData.get("maintenanceMode") === "true",
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { siteName, siteDescription, allowRegistration, maintenanceMode } = validation.data

    const settings = {
      site_name: siteName,
      site_description: siteDescription || null,
      allow_registration: allowRegistration,
      maintenance_mode: maintenanceMode,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from("site_settings")
      .upsert(settings)

    if (error) throw error

    // Log successful update (Agent 2 - Audit)
    console.log('[Site Settings Updated]', {
      updatedBy: authCheck.userId,
      maintenanceMode,
      allowRegistration,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully"
    })
  } catch (error) {
    console.error('[Settings Update Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: "Failed to update settings" },
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

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Settings Fetch Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}