'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface QuizInterfaceProps {
    userId: string
    bookId?: string
    sessionType: string
    onComplete: (results: {
        correct: number
        incorrect: number
        xpEarned: number
        duration: number
    }) => void
}

export function QuizInterface({ userId, bookId, sessionType, onComplete }: QuizInterfaceProps) {
    return (
        <div className="container max-w-2xl py-8">
            <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Vocabulary Quiz</h2>
                <div className="space-y-6">
                    <div>
                        <p className="text-lg mb-4">What does "example" mean?</p>
                        <div className="space-y-2">
                            {['Option A', 'Option B', 'Option C', 'Option D'].map((opt) => (
                                <Button key={opt} variant="outline" className="w-full justify-start">
                                    {opt}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#C9A961]">
                        Submit Answer
                    </Button>
                </div>
            </Card>
        </div>
    )
}
