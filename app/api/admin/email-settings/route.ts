/**
 * Email Settings API (Admin Only)
 * 
 * NON-MVP Feature - Phase 2+
 * Manage SMTP email settings
 */

import { requireAdmin } from "@/lib/api/middleware"
import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"

// Email settings interface (since it's not in database schema yet)
interface EmailSettings {
  id?: string
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password?: string | null
  updated_at?: string
}

export async function POST(request: Request) {
  const { error, user } = await requireAdmin()
  if (error) return error

  try {
    const formData = await request.formData()

    const settings: Partial<EmailSettings> = {
      smtp_host: formData.get("smtpHost") as string,
      smtp_port: parseInt(formData.get("smtpPort") as string),
      smtp_username: formData.get("smtpUsername") as string,
      smtp_password: formData.get("smtpPassword") as string || null,
      updated_at: new Date().toISOString()
    }

    // Only update password if a new one is provided
    if (!settings.smtp_password) {
      delete settings.smtp_password
    }

    // TODO: Implement when email_settings table is created in Phase 2
    logger.info("Email settings updated (mock)", {
      context: "POST /api/admin/email-settings",
      metadata: {
        userId: user!.id
      }
    })

    return NextResponse.json({
      message: "Email settings feature coming in Phase 2",
      settings
    })
  } catch (error) {
    logger.error("Error updating email settings", error, {
      context: "POST /api/admin/email-settings"
    })
    return NextResponse.json(
      { error: "Failed to update email settings" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    // TODO: Implement when email_settings table is created in Phase 2
    const data = {
      smtp_host: "",
      smtp_port: 587,
      smtp_username: ""
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error("Error fetching email settings", error, {
      context: "GET /api/admin/email-settings"
    })
    return NextResponse.json(
      { error: "Failed to fetch email settings" },
      { status: 500 }
    )
  }
}
