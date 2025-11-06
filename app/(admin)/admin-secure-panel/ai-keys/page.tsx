import { AIKeysManager } from '@/components/admin/ai-keys-manager'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gemini API Keys Management | Admin',
    description: 'Manage Gemini API keys for AI chat system',
}

export default function AIKeysPage() {
    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Gemini API Keys</h1>
                <p className="text-muted-foreground">
                    Manage multiple API keys for rotation and fallback. The system will automatically use the least-used key and fallback to others if one fails.
                </p>
            </div>

            <AIKeysManager />
        </div>
    )
}
