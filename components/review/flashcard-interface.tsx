'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FlashcardInterfaceProps {
  userId: string
  bookId?: string
  onComplete: (results: {
    correct: number
    incorrect: number
    xpEarned: number
    duration: number
  }) => void
}

export function FlashcardInterface({ userId, bookId, onComplete }: FlashcardInterfaceProps) {
  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-8">Flashcard Practice</h2>
        <div className="aspect-[3/2] bg-muted rounded-lg flex items-center justify-center mb-8">
          <p className="text-2xl">Word goes here</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline">Show Answer</Button>
          <Button className="bg-[#D4AF37] hover:bg-[#C9A961]">Next Card</Button>
        </div>
      </Card>
    </div>
  )
}
