'use client'

import { SimplifiedDefinition } from '@/lib/dictionary/free-dictionary-api'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowLeftRight,
    BookmarkPlus,
    BookOpen,
    FileText,
    Flag,
    Loader2,
    Quote,
    Sparkles,
    Volume2,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface WordPopupDictionaryProps {
    word: string
    context?: string
    theme: 'light' | 'sepia' | 'dark'
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
    context,
    theme,
    onClose,
    onSaveWord
}: WordPopupDictionaryProps) {
    const [loading, setLoading] = useState(true)
    const [englishData, setEnglishData] = useState<SimplifiedDefinition | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [playingAudio, setPlayingAudio] = useState<string | null>(null)

    useEffect(() => {
        loadWordData()
    }, [word])

    const loadWordData = async () => {
        setLoading(true)
        setError(null)

        try {
            const { fetchWordDefinition } = await import('@/lib/dictionary/free-dictionary-api')
            const english = await fetchWordDefinition(word)

            if (!english) {
                setError('کلمه در دیکشنری یافت نشد')
            } else {
                setEnglishData(english)
            }
        } catch (err) {
            setError('خطا در بارگذاری اطلاعات')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const playPronunciation = (audioUrl: string, accent: string) => {
        setPlayingAudio(accent)
        const audio = new Audio(audioUrl)
        audio.onended = () => setPlayingAudio(null)
        audio.onerror = () => setPlayingAudio(null)
        audio.play()
    }

    const handleSaveWord = () => {
        if (!englishData) return

        const definition = englishData?.definitions[0]?.meaning || 'No definition available'

        onSaveWord({
            word,
            definition,
            translation: '',
            context
        })

        onClose()
    }

    // Theme-aware colors
    const themeStyles = {
        light: {
            bg: 'bg-gradient-to-b from-[#faf8f3] to-[#f5f3ee]',
            text: 'text-[#2a2a2a]',
            textMuted: 'text-[#6b6b6b]',
            border: 'border-gold-300',
            cardBg: 'bg-gold-50/50',
            cardBorder: 'border-gold-200',
            iconColor: 'text-gold-600',
            accentBg: 'bg-gold-100',
            buttonBg: 'bg-gold-600 hover:bg-gold-700',
            buttonText: 'text-white',
            audioBg: 'bg-blue-100 hover:bg-blue-200',
            audioText: 'text-blue-700',
            exampleBg: 'bg-amber-50',
            exampleBorder: 'border-amber-200'
        },
        sepia: {
            bg: 'bg-gradient-to-b from-[#f4ecd8] to-[#ebe3d0]',
            text: 'text-[#5f4b32]',
            textMuted: 'text-[#8b7355]',
            border: 'border-amber-400',
            cardBg: 'bg-amber-100/50',
            cardBorder: 'border-amber-300',
            iconColor: 'text-amber-700',
            accentBg: 'bg-amber-200',
            buttonBg: 'bg-amber-700 hover:bg-amber-800',
            buttonText: 'text-white',
            audioBg: 'bg-blue-100 hover:bg-blue-200',
            audioText: 'text-blue-800',
            exampleBg: 'bg-amber-100',
            exampleBorder: 'border-amber-300'
        },
        dark: {
            bg: 'bg-gradient-to-b from-[#1a1612] to-[#0f0e0c]',
            text: 'text-[#f5f5f5]',
            textMuted: 'text-[#a8a8a8]',
            border: 'border-gold-600',
            cardBg: 'bg-gold-900/20',
            cardBorder: 'border-gold-700',
            iconColor: 'text-gold-400',
            accentBg: 'bg-gold-800/30',
            buttonBg: 'bg-gold-600 hover:bg-gold-700',
            buttonText: 'text-black',
            audioBg: 'bg-blue-900/40 hover:bg-blue-800/50',
            audioText: 'text-blue-300',
            exampleBg: 'bg-gold-900/30',
            exampleBorder: 'border-gold-700'
        }
    }

    const styles = themeStyles[theme]

    // Get US and UK phonetics
    const usPhonetic = englishData?.phonetics.find(p => p.accent === 'US')
    const ukPhonetic = englishData?.phonetics.find(p => p.accent === 'UK')
    const otherPhonetics = englishData?.phonetics.filter(p => p.accent !== 'US' && p.accent !== 'UK') || []

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            />

            {/* Bottom Sheet */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className={cn(
                    "fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl shadow-2xl overflow-hidden",
                    "max-h-[90vh]",
                    "md:left-1/2 md:-translate-x-1/2 md:max-w-3xl md:bottom-8 md:rounded-3xl",
                    styles.bg,
                    styles.text,
                    `border-t-4 ${styles.border}`
                )}
            >
                {/* Drag Handle (mobile) */}
                <div className="md:hidden flex justify-center pt-3 pb-2">
                    <div className={cn("w-12 h-1.5 rounded-full", styles.accentBg)} />
                </div>

                {/* Header */}
                <div className="px-6 pt-4 pb-3 flex items-start justify-between border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className={cn("w-7 h-7", styles.iconColor)} />
                            <h3
                                className={cn("text-3xl font-bold tracking-tight", styles.text)}
                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                dir="ltr"
                            >
                                {word}
                            </h3>
                        </div>

                        {/* Phonetics with Audio - ALWAYS SHOW */}
                        {!loading && englishData && englishData.phonetics && englishData.phonetics.length > 0 && (
                            <div className="space-y-2 mt-3">
                                <div className="flex items-center gap-2">
                                    <Volume2 className={cn("w-4 h-4", styles.iconColor)} />
                                    <span className={cn("text-xs font-semibold", styles.textMuted)}>تلفظ</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {/* US Pronunciation */}
                                    {usPhonetic && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => usPhonetic.audio && playPronunciation(usPhonetic.audio, 'US')}
                                            disabled={!usPhonetic.audio}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border-2",
                                                styles.audioBg,
                                                styles.cardBorder,
                                                !usPhonetic.audio && "opacity-70"
                                            )}
                                        >
                                            <Flag className={cn("w-4 h-4", styles.audioText)} />
                                            <div className="flex flex-col items-start">
                                                <span className={cn("text-xs font-bold", styles.audioText)}>🇺🇸 US</span>
                                                <span className={cn("text-sm font-medium", styles.audioText)} dir="ltr">
                                                    {usPhonetic.text}
                                                </span>
                                            </div>
                                            {usPhonetic.audio && (
                                                <Volume2 className={cn(
                                                    "w-4 h-4 ml-1",
                                                    styles.audioText,
                                                    playingAudio === 'US' && "animate-pulse"
                                                )} />
                                            )}
                                        </motion.button>
                                    )}

                                    {/* UK Pronunciation */}
                                    {ukPhonetic && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => ukPhonetic.audio && playPronunciation(ukPhonetic.audio, 'UK')}
                                            disabled={!ukPhonetic.audio}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border-2",
                                                styles.audioBg,
                                                styles.cardBorder,
                                                !ukPhonetic.audio && "opacity-70"
                                            )}
                                        >
                                            <Flag className={cn("w-4 h-4", styles.audioText)} />
                                            <div className="flex flex-col items-start">
                                                <span className={cn("text-xs font-bold", styles.audioText)}>🇬🇧 UK</span>
                                                <span className={cn("text-sm font-medium", styles.audioText)} dir="ltr">
                                                    {ukPhonetic.text}
                                                </span>
                                            </div>
                                            {ukPhonetic.audio && (
                                                <Volume2 className={cn(
                                                    "w-4 h-4 ml-1",
                                                    styles.audioText,
                                                    playingAudio === 'UK' && "animate-pulse"
                                                )} />
                                            )}
                                        </motion.button>
                                    )}

                                    {/* Other Phonetics */}
                                    {otherPhonetics.map((phonetic, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => phonetic.audio && playPronunciation(phonetic.audio, `Other-${idx}`)}
                                            disabled={!phonetic.audio}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border-2",
                                                styles.audioBg,
                                                styles.cardBorder,
                                                !phonetic.audio && "opacity-70"
                                            )}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className={cn("text-xs font-bold", styles.audioText)}>
                                                    {phonetic.accent === 'AU' ? '🇦🇺 AU' : '🌐'}
                                                </span>
                                                <span className={cn("text-sm font-medium", styles.audioText)} dir="ltr">
                                                    {phonetic.text}
                                                </span>
                                            </div>
                                            {phonetic.audio && (
                                                <Volume2 className={cn(
                                                    "w-4 h-4 ml-1",
                                                    styles.audioText,
                                                    playingAudio === `Other-${idx}` && "animate-pulse"
                                                )} />
                                            )}
                                        </motion.button>
                                    ))}

                                    {/* If no US/UK found, show all phonetics */}
                                    {!usPhonetic && !ukPhonetic && otherPhonetics.length === 0 && englishData.phonetics.map((phonetic, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => phonetic.audio && playPronunciation(phonetic.audio, `Phonetic-${idx}`)}
                                            disabled={!phonetic.audio}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border-2",
                                                styles.audioBg,
                                                styles.cardBorder,
                                                !phonetic.audio && "opacity-70"
                                            )}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className={cn("text-sm font-medium", styles.audioText)} dir="ltr">
                                                    {phonetic.text}
                                                </span>
                                            </div>
                                            {phonetic.audio && (
                                                <Volume2 className={cn(
                                                    "w-4 h-4 ml-1",
                                                    styles.audioText,
                                                    playingAudio === `Phonetic-${idx}` && "animate-pulse"
                                                )} />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className={cn(
                            "p-2.5 rounded-xl transition-all flex-shrink-0",
                            styles.cardBg,
                            "hover:shadow-md"
                        )}
                    >
                        <X className={cn("w-5 h-5", styles.iconColor)} />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className={cn("w-12 h-12 animate-spin mb-4", styles.iconColor)} />
                            <p className={cn("text-sm", styles.textMuted)}>در حال بارگذاری...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <BookOpen className={cn("w-16 h-16 mx-auto mb-4 opacity-30", styles.iconColor)} />
                            <p className={cn("text-lg", styles.textMuted)}>{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-5 mt-5">
                            {/* Definitions */}
                            {englishData?.definitions && englishData.definitions.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className={cn("w-5 h-5", styles.iconColor)} />
                                        <h4 className={cn("text-base font-bold", styles.text)}>معانی</h4>
                                    </div>
                                    <div className="space-y-3">
                                        {englishData.definitions.map((def, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={cn(
                                                    "p-4 rounded-xl border-2",
                                                    styles.cardBg,
                                                    styles.cardBorder
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className={cn(
                                                        "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold",
                                                        styles.buttonBg,
                                                        styles.buttonText
                                                    )}>
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-lg text-xs font-semibold",
                                                                styles.accentBg,
                                                                styles.iconColor
                                                            )}>
                                                                {def.partOfSpeech}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className={cn("text-xs font-semibold mb-1.5", styles.textMuted)}>
                                                                معنی ساده
                                                            </p>
                                                            <p
                                                                className={cn("text-base leading-relaxed", styles.text)}
                                                                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                                                dir="ltr"
                                                            >
                                                                {def.meaning}
                                                            </p>
                                                        </div>
                                                        {def.example && (
                                                            <div className={cn(
                                                                "p-3 rounded-lg border-2",
                                                                styles.exampleBg,
                                                                styles.exampleBorder
                                                            )}>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Quote className={cn("w-4 h-4", styles.iconColor)} />
                                                                    <span className={cn("text-xs font-semibold", styles.textMuted)}>
                                                                        مثال
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className={cn("text-sm italic leading-relaxed", styles.textMuted)}
                                                                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                                                    dir="ltr"
                                                                >
                                                                    "{def.example}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Context from Book */}
                            {context && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className={cn("w-5 h-5", styles.iconColor)} />
                                        <h4 className={cn("text-base font-bold", styles.text)}>متن اصلی کتاب</h4>
                                    </div>
                                    <div className={cn("p-4 rounded-xl border-2", styles.cardBg, styles.cardBorder)}>
                                        <p
                                            className={cn("text-sm leading-relaxed", styles.textMuted)}
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                            dir="ltr"
                                        >
                                            "{context}"
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Synonyms & Antonyms */}
                            {((englishData?.synonyms && englishData.synonyms.length > 0) ||
                                (englishData?.antonyms && englishData.antonyms.length > 0)) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {/* Synonyms */}
                                        {englishData?.synonyms && englishData.synonyms.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <ArrowLeftRight className={cn("w-5 h-5", styles.iconColor)} />
                                                    <h4 className={cn("text-sm font-bold", styles.text)}>مترادف‌ها</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {englishData.synonyms.map((syn, index) => (
                                                        <motion.span
                                                            key={index}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.5 + index * 0.05 }}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-sm border-2",
                                                                styles.cardBg,
                                                                styles.cardBorder,
                                                                styles.text
                                                            )}
                                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                                            dir="ltr"
                                                        >
                                                            {syn}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Antonyms */}
                                        {englishData?.antonyms && englishData.antonyms.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <ArrowLeftRight className={cn("w-5 h-5 rotate-90", styles.iconColor)} />
                                                    <h4 className={cn("text-sm font-bold", styles.text)}>متضادها</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {englishData.antonyms.map((ant, index) => (
                                                        <motion.span
                                                            key={index}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.5 + index * 0.05 }}
                                                            className={cn(
                                                                "px-3 py-1.5 rounded-lg text-sm border-2",
                                                                styles.cardBg,
                                                                styles.cardBorder,
                                                                styles.text
                                                            )}
                                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                                            dir="ltr"
                                                        >
                                                            {ant}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && !error && (
                    <div className={cn("px-6 py-4 border-t-2", styles.border)}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveWord}
                            className={cn(
                                "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all",
                                styles.buttonBg,
                                styles.buttonText
                            )}
                        >
                            <BookmarkPlus className="w-5 h-5" />
                            ذخیره در واژگان
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
