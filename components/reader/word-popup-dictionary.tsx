'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SimplifiedDefinition } from '@/lib/dictionary/free-dictionary-api'
import { AnimatePresence, motion } from 'framer-motion'
import { BookmarkPlus, Loader2, Volume2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WordPopupDictionaryProps {
    word: string
    position: { x: number; y: number }
    context?: string
    onClose: () => void
    onSaveWord: (wordData: {
        word: string
        definition: string
        translation: string
        context?: string
    }) => void
}

export function WordPopupDictionary({
    word,
    position,
    context,
    onClose,
    onSaveWord
}: WordPopupDictionaryProps) {
    const [loading, setLoading] = useState(true)
    const [englishData, setEnglishData] = useState<SimplifiedDefinition | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadWordData()
    }, [word])

    const loadWordData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Only fetch from Free Dictionary API (no Gemini translation)
            const { fetchWordDefinition } = await import('@/lib/dictionary/free-dictionary-api')
            const english = await fetchWordDefinition(word)

            if (!english) {
                setError('Word not found in dictionary')
            } else {
                setEnglishData(english)
                // No Persian translation here - user can translate in flashcard practice
            }
        } catch (err) {
            setError('Failed to load word data')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const playPronunciation = () => {
        if (englishData?.audioUrl) {
            const audio = new Audio(englishData.audioUrl)
            audio.play()
        }
    }

    const handleSaveWord = () => {
        if (!englishData) return

        const definition = englishData?.definitions[0]?.meaning || 'No definition available'

        onSaveWord({
            word,
            definition,
            translation: '', // No translation - will be done in flashcard practice
            context
        })

        // Show success animation
        onClose()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.2 }}
                className="fixed z-50 w-96 max-w-[90vw] bg-background border-2 border-gold/30 rounded-xl shadow-2xl overflow-hidden"
                style={{
                    left: Math.min(position.x, window.innerWidth - 400),
                    top: Math.min(position.y + 20, window.innerHeight - 500)
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-gold/10 to-gold/5 p-4 border-b border-gold/20">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gold flex items-center gap-2">
                                {word}
                                {englishData?.audioUrl && (
                                    <button
                                        onClick={playPronunciation}
                                        className="p-1 hover:bg-gold/20 rounded-full transition-colors"
                                    >
                                        <Volume2 className="w-5 h-5" />
                                    </button>
                                )}
                            </h3>
                            {englishData?.pronunciation && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {englishData.pronunciation}
                                </p>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="hover:bg-gold/20"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-gold" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* English Definitions */}
                            {englishData?.definitions && englishData.definitions.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-muted-foreground">
                                        English Definitions:
                                    </p>
                                    {englishData.definitions.map((def, index) => (
                                        <div key={index} className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {def.partOfSpeech}
                                                </Badge>
                                                <span className="text-sm">{def.meaning}</span>
                                            </div>
                                            {def.example && (
                                                <p className="text-xs text-muted-foreground italic pl-4">
                                                    Example: "{def.example}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Context */}
                            {context && (
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Context:</p>
                                    <p className="text-sm italic">"{context}"</p>
                                </div>
                            )}

                            {/* Synonyms */}
                            {englishData?.synonyms && englishData.synonyms.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Synonyms:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {englishData.synonyms.map((syn, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {syn}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Antonyms */}
                            {englishData?.antonyms && englishData.antonyms.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2">Antonyms:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {englishData.antonyms.map((ant, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {ant}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && !error && (
                    <div className="p-4 border-t border-gold/20 bg-muted/30">
                        <Button
                            onClick={handleSaveWord}
                            className="w-full bg-gold hover:bg-gold/90 text-black"
                        >
                            <BookmarkPlus className="w-4 h-4 mr-2" />
                            Save to Vocabulary
                        </Button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
