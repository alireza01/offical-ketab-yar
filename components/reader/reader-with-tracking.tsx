'use client'

import { incrementBookView } from '@/lib/actions/book-tracking'
import { useEffect } from 'react'
import { ProfessionalReader } from './professional-reader'

interface ReaderWithTrackingProps {
    book: any
}

export function ReaderWithTracking({ book }: ReaderWithTrackingProps) {
    useEffect(() => {
        // Track view when reader opens
        async function trackView() {
            try {
                await incrementBookView(book.id)
            } catch (error) {
                console.error('Error tracking book view:', error)
            }
        }

        trackView()
    }, [book.id])

    return <ProfessionalReader book={book} />
}
