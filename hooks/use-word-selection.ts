'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface WordSelectionData {
    word: string
    position: { x: number; y: number }
    context?: string
}

export function useWordSelection(bookId?: string) {
    const [selectedWord, setSelectedWord] = useState<WordSelectionData | null>(null)

    const handleTextSelection = useCallback((event: React.MouseEvent) => {
        const selection = window.getSelection()
        const text = selection?.toString().trim()

        if (!text || text.split(' ').length > 3) {
            // Only allow single words or short phrases (max 3 words)
            return
        }

        // Get selection position
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()

        if (rect) {
            // Extract context (sentence containing the word)
            const fullText = (event.target as HTMLElement).textContent || ''
            const selectedIndex = fullText.indexOf(text)

            let context = ''
            if (selectedIndex !== -1) {
                // Get surrounding sentence
                const before = fullText.substring(Math.max(0, selectedIndex - 50), selectedIndex)
                const after = fullText.substring(selectedIndex + text.length, selectedIndex + text.length + 50)
                context = `${before}${text}${after}`.trim()
            }

            setSelectedWord({
                word: text,
                position: { x: rect.left, y: rect.bottom },
                context
            })
        }
    }, [])

    const clearSelection = useCallback(() => {
        setSelectedWord(null)
        window.getSelection()?.removeAllRanges()
    }, [])

    const saveWord = useCallback(async (wordData: {
        word: string
        definition: string
        translation: string
        context?: string
    }) => {
        try {
            const response = await fetch('/api/vocabulary/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...wordData,
                    bookId
                })
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 403) {
                    // Free tier limit reached
                    toast.error(data.message, {
                        description: 'Upgrade to Premium for unlimited vocabulary',
                        action: {
                            label: 'Upgrade',
                            onClick: () => window.location.href = '/subscription'
                        }
                    })
                } else if (response.status === 409) {
                    toast.info('Word already in your vocabulary')
                } else {
                    toast.error(data.error || 'Failed to save word')
                }
                return false
            }

            // Success animation
            toast.success(`"${wordData.word}" saved to vocabulary!`, {
                description: wordData.translation
            })

            clearSelection()
            return true
        } catch (error) {
            console.error('Error saving word:', error)
            toast.error('Failed to save word')
            return false
        }
    }, [bookId, clearSelection])

    return {
        selectedWord,
        handleTextSelection,
        clearSelection,
        saveWord
    }
}
