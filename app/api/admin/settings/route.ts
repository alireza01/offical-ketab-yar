/**
 * Site Settings API (Admin Only)
 * 
 * NON-MVP Feature - Phase 2+
 * Manage global site settings
 */

import { requireAdmin } from "@/lib/api/middleware"
import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { error, user } = await requireAdmin()
  if (error) return error

  try {
    const formData = await request.formData()

    const settings = {
      site_name: formData.get("siteName"),
      site_description: formData.get("siteDescription"),
      allow_registration: formData.get("allowRegistration") === "true",
      maintenance_mode: formData.get("maintenanceMode") === "true",
      updated_at: new Date().toISOString()
    }

    // TODO: Implement when site_settings table is created in Phase 2
    logger.info("Site settings updated (mock)", {
      context: "POST /api/admin/settings",
      metadata: {
        userId: user!.id
      }
    })

    return NextResponse.json({
      message: "Settings feature coming in Phase 2",
      settings
    })
  } catch (error) {
    logger.error("Error updating settings", error, {
      context: "POST /api/admin/settings"
    })
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    // TODO: Implement when site_settings table is created in Phase 2
    const data = {
      site_name: "کتاب‌یار",
      site_description: "پلتفرم هوشمند مطالعه با AI",
      allow_registration: true,
      maintenance_mode: false
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error("Error fetching settings", error, {
      context: "GET /api/admin/settings"
    })
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}
