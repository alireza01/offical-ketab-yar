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

    // TODO: Implement when email_settings table is created
    // For now, return success
    return NextResponse.json({ 
      message: "Email settings feature coming soon",
      settings 
    })
  } catch (error) {
    console.error("Error updating email settings:", error)
    return NextResponse.json(
      { error: "Failed to update email settings" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // For now, return empty settings (table doesn't exist yet)
    // TODO: Implement when email_settings table is created
    const data = {
      smtp_host: "",
      smtp_port: 587,
      smtp_username: ""
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching email settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch email settings" },
      { status: 500 }
    )
  }
}
