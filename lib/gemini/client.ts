/**
 * DEPRECATED: This file exposes API keys to the client
 * 
 * DO NOT USE THIS FILE IN NEW CODE
 * Use lib/gemini/server.ts instead (server-side only)
 * 
 * This file is kept for backward compatibility only
 * All AI features should go through API routes
 */

export function getGeminiModel() {
  console.warn('DEPRECATED: Use server-side Gemini client instead')
  return null
}

export async function generateContent() {
  return {
    success: false,
    error: "Client-side Gemini is deprecated. Use API routes instead.",
  }
}

export async function generateJsonContent() {
  return {
    success: false,
    error: "Client-side Gemini is deprecated. Use API routes instead.",
  }
}

export async function translateText(): Promise<string> {
  throw new Error("Client-side Gemini is deprecated. Use API routes instead.")
}

export async function getWordDefinition() {
  throw new Error("Client-side Gemini is deprecated. Use API routes instead.")
}

export async function analyzeText() {
  return []
}
