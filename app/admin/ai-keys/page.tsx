import { AIKeysManager } from '@/components/admin/ai-keys-manager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Keys Management | Admin | کتاب‌یار',
    description: 'Manage Gemini API keys for AI chat system',
}

export const dynamic = 'force-dynamic'

export default function AdminAIKeysPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Keys Management</h1>
                <p className="text-muted-foreground">
                    Manage Google Gemini API keys for the AI chat system
                </p>
            </div>

            <AIKeysManager />
        </div>
    )
}
