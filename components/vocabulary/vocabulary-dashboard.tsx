'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { createBrowserClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VocabularyWord {
  id: string
  word: string
  definition: string
  context: string | null
  book_id: string | null
  mastery_level: number
  created_at: string
}

export function VocabularyDashboard() {
  const [words, setWords] = useState<VocabularyWord[]>([])
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserClient()

  useEffect(() => {
    loadVocabulary()
  }, [])

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredWords(words)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredWords(
        words.filter(
          (word) =>
            word.word.toLowerCase().includes(query) ||
            word.definition.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, words])

  const loadVocabulary = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data && !error) {
      setWords(data)
      setFilteredWords(data)
    }
    setIsLoading(false)
  }

  const deleteWord = async (id: string) => {
    await supabase.from('vocabulary').delete().eq('id', id)
    setWords(words.filter((w) => w.id !== id))
  }

  if (isLoading) {
    return <VocabularyDashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">واژگان من</h1>
          <p className="text-muted-foreground">
            {words.length} کلمه ذخیره شده
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی کلمات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">هیچ کلمه‌ای یافت نشد</h3>
            <p className="text-muted-foreground text-center">
              شروع به خواندن کتاب‌ها کنید و واژگان خود را بسازید!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredWords.map((word) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{word.word}</h3>
                        <p className="text-muted-foreground mt-1">{word.definition}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteWord(word.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {word.context && (
                      <p className="text-sm text-muted-foreground italic mb-2">
                        "{word.context}"
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">تسلط:</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4AF37]"
                          style={{ width: `${(word.mastery_level / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {word.mastery_level}/5
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function VocabularyDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
