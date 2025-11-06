'use client'

import { FlashcardPractice } from '@/components/vocabulary/flashcard-practice'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PracticeContent() {
    const searchParams = useSearchParams()
    const bookId = searchParams.get('bookId')
    const mode = searchParams.get('mode') || 'book'

    return (
        <FlashcardPractice
            bookId={bookId || undefined}
            mode={mode as 'all' | 'book'}
        />
    )
}

export default function PracticePage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600" />
                </div>
            </div>
        }>
            <PracticeContent />
        </Suspense>
    )
}
