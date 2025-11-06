/**
 * Free Dictionary API Integration
 * API: https://dictionaryapi.dev/
 * No API key required, completely free
 */

export interface DictionaryDefinition {
    word: string
    phonetic?: string
    phonetics: Array<{
        text?: string
        audio?: string
    }>
    meanings: Array<{
        partOfSpeech: string
        definitions: Array<{
            definition: string
            example?: string
            synonyms?: string[]
            antonyms?: string[]
        }>
    }>
    sourceUrls?: string[]
}

export interface SimplifiedDefinition {
    word: string
    pronunciation?: string
    audioUrl?: string
    definitions: Array<{
        partOfSpeech: string // noun, verb, adjective, etc.
        meaning: string
        example?: string
    }>
    synonyms: string[]
    antonyms: string[]
}

/**
 * Fetch word definition from Free Dictionary API
 */
export async function fetchWordDefinition(
    word: string
): Promise<SimplifiedDefinition | null> {
    try {
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`
        )

        if (!response.ok) {
            console.warn(`Dictionary API returned ${response.status} for word: ${word}`)
            return null
        }

        const data: DictionaryDefinition[] = await response.json()

        if (!data || data.length === 0) {
            return null
        }

        const firstEntry = data[0]

        // Extract audio URL (prefer US pronunciation)
        const audioUrl = firstEntry.phonetics.find(p => p.audio)?.audio

        // Collect all definitions
        const definitions = firstEntry.meanings.flatMap(meaning =>
            meaning.definitions.slice(0, 3).map(def => ({
                partOfSpeech: meaning.partOfSpeech,
                meaning: def.definition,
                example: def.example
            }))
        )

        // Collect synonyms and antonyms
        const synonyms = Array.from(
            new Set(
                firstEntry.meanings.flatMap(m =>
                    m.definitions.flatMap(d => d.synonyms || [])
                )
            )
        ).slice(0, 5)

        const antonyms = Array.from(
            new Set(
                firstEntry.meanings.flatMap(m =>
                    m.definitions.flatMap(d => d.antonyms || [])
                )
            )
        ).slice(0, 5)

        return {
            word: firstEntry.word,
            pronunciation: firstEntry.phonetic,
            audioUrl,
            definitions,
            synonyms,
            antonyms
        }
    } catch (error) {
        console.error('Error fetching word definition:', error)
        return null
    }
}

/**
 * Get Persian translation using Google Gemini
 */
export async function getWordTranslation(
    word: string,
    context?: string
): Promise<string | null> {
    try {
        const response = await fetch('/api/dictionary/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word, context })
        })

        if (!response.ok) return null

        const data = await response.json()
        return data.translation
    } catch (error) {
        console.error('Error translating word:', error)
        return null
    }
}

/**
 * Get complete word data (English definition + Persian translation)
 */
export async function getCompleteWordData(
    word: string,
    context?: string
): Promise<{
    english: SimplifiedDefinition | null
    persian: string | null
}> {
    const [english, persian] = await Promise.all([
        fetchWordDefinition(word),
        getWordTranslation(word, context)
    ])

    return { english, persian }
}
