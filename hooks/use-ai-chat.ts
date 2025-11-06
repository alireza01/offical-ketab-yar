"use client"

import { useCallback, useState } from 'react'
import { toast } from 'sonner'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

interface BookContext {
    title: string
    author?: string
    currentPage: number
    currentPageText: string
    previousPages?: string[]
    selectedText?: string
}

interface UseAIChatOptions {
    bookContext: BookContext
    onError?: (error: string) => void
}

export function useAIChat({ bookContext, onError }: UseAIChatOptions) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return

        // Add user message
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMessage])
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    bookContext
                })
            })

            if (!response.ok) {
                throw new Error('Failed to get AI response')
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'AI response failed')
            }

            // Add AI response
            const aiMessage: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: data.message,
                timestamp: Date.now()
            }

            setMessages(prev => [...prev, aiMessage])

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'خطا در ارتباط با هوش مصنوعی'
            setError(errorMessage)
            onError?.(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }, [messages, bookContext, isLoading, onError])

    const clearChat = useCallback(() => {
        setMessages([])
        setError(null)
    }, [])

    const retryLastMessage = useCallback(() => {
        const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')
        if (lastUserMessage) {
            // Remove last AI message if exists
            setMessages(prev => {
                const lastIndex = prev.length - 1
                if (prev[lastIndex]?.role === 'assistant') {
                    return prev.slice(0, -1)
                }
                return prev
            })
            sendMessage(lastUserMessage.content)
        }
    }, [messages, sendMessage])

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        retryLastMessage
    }
}
