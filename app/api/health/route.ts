/**
 * Health Check API
 * Simple endpoint to verify API is running
 */

import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0-mvp',
        environment: process.env.NODE_ENV
    })
}
