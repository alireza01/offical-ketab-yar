/**
 * Server-side Gemini AI Client
 * 
 * SECURITY: This file should ONLY be used in API routes or Server Actions
 * Never import this in client components - use API routes instead
 * 
 * Agent 2 (Performance): API key is server-side only, never exposed to client
 */

'use server'

import { logger } from "@/lib/logger"
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY || ""

if (!apiKey && process.env.NODE_ENV === 'production') {
    throw new Error('GEMINI_API_KEY is required in production')
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

function getGeminiModel(modelName = "gemini-2.0-flash-exp") {
    if (!apiKey) {
        logger.warn('Gemini API key not configured', { context: 'getGeminiModel' })
        return null
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({
        model: modelName,
        safetySettings,
    })
}

export async function generateContent(prompt: string, modelName = "gemini-2.0-flash-exp") {
    const model = getGeminiModel(modelName)

    if (!model) {
        return {
            success: false,
            error: "Gemini API key not configured",
        }
    }

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()

        return {
            success: true,
            content: text,
        }
    } catch (error) {
        logger.error("Error generating content with Gemini", error, { context: 'generateContent' })
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

export async function generateJsonContent(prompt: string, modelName = "gemini-2.0-flash-exp") {
    const model = getGeminiModel(modelName)

    if (!model) {
        return {
            success: false,
            error: "API key not configured",
        }
    }

    try {
        const formattedPrompt = `${prompt}\n\nRespond ONLY with valid JSON.`
        const result = await model.generateContent(formattedPrompt)
        const response = result.response
        const text = response.text()

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return {
                success: true,
                data: JSON.parse(jsonMatch[0]),
            }
        }

        throw new Error("Failed to parse JSON from response")
    } catch (error) {
        logger.error("Error generating JSON content with Gemini", error, { context: 'generateJsonContent' })
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

export async function translateText(text: string, targetLang = "fa"): Promise<string> {
    const prompt = `Translate the following English text to ${targetLang === "fa" ? "Persian (Farsi)" : "English"}. Only provide the translation, no explanations:\n\n${text}`

    const result = await generateContent(prompt)

    if (result.success && result.content) {
        return result.content.trim()
    }

    throw new Error(result.error || "Translation failed")
}

export async function getWordDefinition(word: string, userLevel = "intermediate") {
    const prompt = `Provide a definition for the English word "${word}" suitable for a ${userLevel} level English learner. Include:
1. Simple meaning in Persian
2. Explanation in Persian
3. 2-3 example sentences in English
4. Difficulty level (beginner/intermediate/advanced)

Respond in JSON format:
{
  "meaning": "معنی به فارسی",
  "explanation": "توضیحات به فارسی",
  "examples": ["example 1", "example 2"],
  "level": "intermediate"
}`

    const result = await generateJsonContent(prompt)

    if (result.success && result.data) {
        return result.data
    }

    throw new Error(result.error || "Failed to get word definition")
}

export async function analyzeText(text: string) {
    const prompt = `Analyze the following English text and extract key vocabulary words with their difficulty levels. Return as JSON array:
[
  {"word": "example", "level": "beginner"},
  {"word": "analyze", "level": "intermediate"}
]

Text: ${text}`

    const result = await generateJsonContent(prompt)

    if (result.success && result.data) {
        return Array.isArray(result.data) ? result.data : []
    }

    return []
}
