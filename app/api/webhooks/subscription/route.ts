/**
 * Stripe Subscription Webhook
 * 
 * NON-MVP Feature - Phase 2+ (Stripe Integration)
 * Handle Stripe subscription events
 * 
 * This is a stub for Phase 2 when Stripe payment is implemented
 */

import { logger } from "@/lib/logger"
import { createServerClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return new NextResponse("No signature", { status: 400 })
    }

    const body = await req.text()
    const supabase = await createServerClient()

    // TODO: Verify Stripe signature in Phase 2
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    const event = JSON.parse(body)

    logger.info("Stripe webhook received", {
      context: "POST /api/webhooks/subscription",
      metadata: { eventType: event.type }
    })

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object

        // Update user's subscription_tier in users table (as per blueprint)
        if (subscription.metadata?.userId) {
          const { error } = await supabase
            .from("users")
            .update({
              subscription_tier: subscription.status === 'active' ? 'premium' : 'free',
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("id", subscription.metadata.userId)

          if (error) {
            logger.error("Failed to update user subscription", error, {
              context: "POST /api/webhooks/subscription",
              metadata: { userId: subscription.metadata.userId }
            })
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        // Downgrade user to free tier
        if (subscription.metadata?.userId) {
          const { error } = await supabase
            .from("users")
            .update({
              subscription_tier: 'free',
              subscription_expires_at: null,
              updated_at: new Date().toISOString()
            })
            .eq("id", subscription.metadata.userId)

          if (error) {
            logger.error("Failed to downgrade user subscription", error, {
              context: "POST /api/webhooks/subscription",
              metadata: { userId: subscription.metadata.userId }
            })
          }
        }
        break
      }

      default:
        logger.info("Unhandled webhook event", {
          context: "POST /api/webhooks/subscription",
          metadata: { eventType: event.type }
        })
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    logger.error("Webhook processing error", error, {
      context: "POST /api/webhooks/subscription"
    })
    return new NextResponse("Webhook error", { status: 400 })
  }
} 
