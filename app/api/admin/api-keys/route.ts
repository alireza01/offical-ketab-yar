/**
 * API Keys Management (Admin Only)
 * 
 * NON-MVP Feature - Phase 2+
 * This endpoint is for future API key management system
 */

import { requireAdmin } from "@/lib/api/middleware"
import { logger } from "@/lib/logger"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { error, user } = await requireAdmin()
  if (error) return error

  try {

    const { name, type } = await request.json()

    // Validate input
    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      )
    }

    // Generate a secure API key
    const key = `sk_${nanoid(32)}`

    // TODO: Implement when api_keys table is created in Phase 2
    // For now, return mock response
    const apiKey = {
      id: nanoid(),
      name,
      key,
      type,
      created_by: user!.id,
      created_at: new Date().toISOString()
    }

    logger.info("API key generated (mock)", {
      context: "POST /api/admin/api-keys",
      metadata: {
        userId: user!.id,
        keyName: name
      }
    })

    return NextResponse.json({
      ...apiKey,
      message: "API Keys feature coming in Phase 2"
    })
  } catch (error) {
    logger.error("Error generating API key", error, {
      context: "POST /api/admin/api-keys"
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
