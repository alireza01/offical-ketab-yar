// API route for activating free trial
// Agent 4: Free trial activation

import { activateFreeTrial } from '@/lib/subscription/subscription-manager'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Activate free trial
        const success = await activateFreeTrial(user.id)

        if (!success) {
            return NextResponse.json(
                { error: 'Unable to activate trial. You may have already used your free trial.' },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error activating trial:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
