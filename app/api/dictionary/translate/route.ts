import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route: Translate English word to Persian using Gemini
 * POST /api/dictionary/translate
 */
export async function POST(request: NextRequest) {
    try {
        const { word, context } = await request.json()

        if (!word) {
            return NextResponse.json(
                { error: 'Word is required' },
                { status: 400 }
            )
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            )
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

        const prompt = context
            ? `Translate the English word "${word}" to Persian. The word appears in this context: "${context}". Provide ONLY the Persian translation (معنی فارسی), nothing else. If the word has multiple meanings, provide the most relevant one based on context.`
            : `Translate the English word "${word}" to Persian. Provide ONLY the Persian translation (معنی فارسی), nothing else. If the word has multiple meanings, provide the most common one.`

        const result = await model.generateContent(prompt)
        const translation = result.response.text().trim()

        return NextResponse.json({ translation })
    } catch (error) {
        console.error('Translation error:', error)
        return NextResponse.json(
            { error: 'Failed to translate word' },
            { status: 500 }
        )
    }
}
