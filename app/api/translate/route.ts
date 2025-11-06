import { NextRequest, NextResponse } from 'next/server'

/**
 * Google Cloud Translation API
 * Translates text to Persian (Farsi)
 * Free tier: 500,000 characters/month
 */
export async function POST(request: NextRequest) {
    try {
        const { text, targetLanguage = 'fa' } = await request.json()

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            )
        }

        const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Google Translate API key not configured' },
                { status: 500 }
            )
        }

        // Call Google Cloud Translation API
        const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLanguage,
                    format: 'text'
                })
            }
        )

        if (!response.ok) {
            throw new Error('Translation API request failed')
        }

        const data = await response.json()
        const translatedText = data.data.translations[0].translatedText

        return NextResponse.json({ translatedText })
    } catch (error) {
        console.error('Translation error:', error)
        return NextResponse.json(
            { error: 'Failed to translate text' },
            { status: 500 }
        )
    }
}
