"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createBrowserClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { BookOpen, Search, Trash2, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VocabularyWord {
    id: string
    word: string
    definition: string
    context: string | null
    book_id: string | null
    created_at: string
    mastery_level: number
    books?: {
        title: string
        slug: string
    }
}

export function VocabularyDashboard() {
    const [words, setWords] = useState<VocabularyWord[]>([])
    const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createBrowserClient()

    useEffect(() => {
        loadWords()
    }, [])

    useEffect(() => {
        if (searchQuery) {
            const filtered = words.filter(word =>
                word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                word.definition.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredWords(filtered)
        } else {
            setFilteredWords(words)
        }
    }, [searchQuery, words])

    const loadWords = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('vocabulary')
            .select('*, books(title, slug)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) {
            setWords(data)
            setFilteredWords(data)
        }

        setIsLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('آیا مطمئن هستید که می‌خواهید این کلمه را حذف کنید؟')) return

        await supabase.from('vocabulary').delete().eq('id', id)
        loadWords()
    }

    const handleSpeak = (word: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word)
            utterance.lang = 'en-US'
            speechSynthesis.speak(utterance)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">لیست واژگان</h1>
                <p className="text-muted-foreground mt-1">
                    {words.length} کلمه ذخیره شده
                </p>
            </div>

            {/* Search */}
            <Card className="border-[#D4AF37]/20">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="جستجوی کلمه..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Words List */}
            {filteredWords.length === 0 ? (
                <Card className="border-[#D4AF37]/20">
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">
                            {searchQuery ? 'کلمه‌ای یافت نشد' : 'هنوز کلمه‌ای ذخیره نکرده‌اید'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredWords.map((word, index) => (
                        <motion.div
                            key={word.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                {word.word}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSpeak(word.word)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Volume2 className="w-4 h-4" />
                                                </Button>
                                            </CardTitle>
                                            {word.books && (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    <span>{word.books.title}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(word.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-2">{word.definition}</p>
                                    {word.context && (
                                        <p className="text-xs text-muted-foreground italic border-r-2 border-[#D4AF37] pr-2">
                                            "{word.context}"
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                                        <span>
                                            {new Date(word.created_at).toLocaleDateString('fa-IR')}
                                        </span>
                                        <span>سطح تسلط: {word.mastery_level}/5</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
'use client'

export { VocabularyDashboard } from './vocabulary-dashboard'

