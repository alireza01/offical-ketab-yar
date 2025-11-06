import { getAPIKeyManager } from "@/lib/gemini/api-key-manager"
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = 'edge'
export const maxDuration = 30

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

interface ChatRequest {
    messages: ChatMessage[]
    bookContext: {
        title: string
        author?: string
        currentPage: number
        currentPageText: string
        previousPages?: string[]
        selectedText?: string
    }
}

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
]

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json()
        const { messages, bookContext } = body

        // Build context-aware system prompt
        const systemPrompt = `You are an intelligent reading assistant for the book "${bookContext.title}"${bookContext.author ? ` by ${bookContext.author}` : ''}.

Current Context:
- Page: ${bookContext.currentPage}
- Current page content: "${bookContext.currentPageText.slice(0, 500)}..."
${bookContext.selectedText ? `- User selected text: "${bookContext.selectedText}"` : ''}
${bookContext.previousPages?.length ? `- Previous context available: ${bookContext.previousPages.length} pages` : ''}

Your role:
- Answer questions about the book content
- Explain concepts, vocabulary, and themes
- Provide context and analysis
- Help with comprehension
- Be concise but helpful (2-3 paragraphs max)
- Respond in the same language as the user's question
- If asked in Persian (فارسی), respond in Persian
- If asked in English, respond in English
- REMEMBER the entire conversation history - reference previous questions and answers when relevant

Remember: You're helping a reader understand THIS specific book and page. You can see all previous messages in this conversation.`

        // Build full conversation with history
        const conversationHistory = messages.map(msg =>
            `${msg.role === 'user' ? 'Reader' : 'Assistant'}: ${msg.content}`
        ).join('\n\n')

        // Build complete prompt with FULL conversation context
        const fullPrompt = `${systemPrompt}

=== CONVERSATION HISTORY ===
${conversationHistory}

=== INSTRUCTIONS ===
Based on the entire conversation above, provide a helpful response to the reader's latest question. Reference previous parts of the conversation when relevant.`

        // Get API key manager
        const keyManager = getAPIKeyManager()

        let generatedContent: string = ''
        let usedKeyId: string | undefined = undefined

        // Try to get a working API key
        const keyResult = await keyManager.getWorkingKey(async (apiKey) => {
            try {
                const genAI = new GoogleGenerativeAI(apiKey)
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.0-flash-exp",
                    safetySettings,
                })

                const response = await model.generateContent(fullPrompt)
                const text = response.response.text()

                if (text && text.length > 0) {
                    generatedContent = text
                    return true
                }
                return false
            } catch (error) {
                console.error('API key failed:', error)
                return false
            }
        })

        if (!keyResult || !generatedContent) {
            return NextResponse.json(
                { error: 'All API keys failed. Please try again later.' },
                { status: 503 }
            )
        }

        usedKeyId = keyResult.keyId

        // Mark key as used (async, don't wait)
        if (usedKeyId) {
            keyManager.markKeyUsed(usedKeyId).catch(console.error)
        }

        return NextResponse.json({
            success: true,
            message: generatedContent,
            usage: {
                model: "gemini-2.0-flash-exp",
                contextPages: (bookContext.previousPages?.length || 0) + 1,
                conversationLength: messages.length,
                keyId: usedKeyId ? usedKeyId.slice(0, 8) : 'fallback'
            }
        })

    } catch (error) {
        console.error('AI Chat API Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
