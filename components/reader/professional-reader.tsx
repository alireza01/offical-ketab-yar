'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import type { MockBook } from '@/lib/dev/mock-data'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronRight, Highlighter, MessageSquare, Moon, Settings, Sun, Type, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { HighlightsPanel } from './highlights-panel'
import { TextSelectionMenu } from './text-selection-menu'

interface ReaderProps {
  book: MockBook
}

export function ProfessionalReader({ book }: ReaderProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(1.8)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia')
  const [selectedText, setSelectedText] = useState('')
  const [showTextMenu, setShowTextMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [showHighlights, setShowHighlights] = useState(false)
  interface Highlight {
    page: number;
    text: string;
    color: string;
    id: string;
    timestamp: number;
  }
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [selectedRange, setSelectedRange] = useState<Range | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  const totalPages = book.content.length

  const goToPage = useCallback((page: number) => {
    if (page < 0 || page >= totalPages || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(page)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 250)
    }, 50)
  }, [totalPages, isTransitioning])

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()

    if (text && text.length > 0 && selection && selection.rangeCount > 0) {
      setSelectedText(text)
      const range = selection.getRangeAt(0)
      setSelectedRange(range.cloneRange())
      const rect = range.getBoundingClientRect()

      if (rect) {
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 60
        })
        setShowTextMenu(true)
      }
    } else {
      setShowTextMenu(false)
      setSelectedRange(null)
    }
  }, [])

  const addHighlight = (color: string) => {
    if (selectedText && selectedRange) {
      const highlightId = `highlight-${Date.now()}-${Math.random()}`

      // Create highlight span
      const span = document.createElement('span')
      span.className = `highlight-${color}`
      span.setAttribute('data-highlight-id', highlightId)
      // Theme-aware highlight colors with BLACK text in dark mode
      const highlightColors = {
        yellow: theme === 'dark' ? 'rgba(250, 204, 21, 0.4)' : 'rgba(254, 240, 138, 0.7)',
        orange: theme === 'dark' ? 'rgba(251, 146, 60, 0.4)' : 'rgba(254, 215, 170, 0.7)',
        gold: theme === 'dark' ? 'rgba(212, 175, 55, 0.4)' : 'rgba(253, 224, 71, 0.7)'
      }

      span.style.backgroundColor = highlightColors[color as keyof typeof highlightColors]
      span.style.color = theme === 'dark' ? '#000000' : 'inherit'
      span.style.padding = '3px 1px'
      span.style.borderRadius = '3px'
      span.style.transition = 'all 0.2s ease'
      span.style.boxShadow = theme === 'dark' ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none'

      try {
        selectedRange.surroundContents(span)
      } catch (e) {
        // If surroundContents fails, use alternative method
        console.log('Using alternative highlight method')
      }

      setHighlights([...highlights, {
        text: selectedText,
        page: currentPage,
        color,
        id: highlightId,
        timestamp: Date.now()
      }])

      setShowTextMenu(false)
      window.getSelection()?.removeAllRanges()

      toast.success('هایلایت ذخیره شد', {
        duration: 2000,
        icon: '✨'
      })
    }
  }

  const addToVocabulary = () => {
    if (selectedText) {
      toast.success(`"${selectedText}" به لیست واژگان اضافه شد`, {
        duration: 2000,
        icon: '📚'
      })
      setShowTextMenu(false)
      window.getSelection()?.removeAllRanges()
    }
  }

  const deleteHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id))
    const element = document.querySelector(`[data-highlight-id="${id}"]`)
    if (element) {
      const parent = element.parentNode
      while (element.firstChild) {
        parent?.insertBefore(element.firstChild, element)
      }
      parent?.removeChild(element)
    }
    toast.success('هایلایت حذف شد', { duration: 1500 })
  }

  const copyHighlight = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('کپی شد', { duration: 1500, icon: '📋' })
  }



  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') nextPage()
      if (e.key === 'ArrowRight') prevPage()
      if (e.key === 'Escape') {
        setShowSettings(false)
        setShowChat(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, nextPage, prevPage])

  const themeColors = {
    light: 'bg-[#faf8f3] text-[#2a2a2a]',
    sepia: 'bg-[#f4ecd8] text-[#5f4b32]',
    dark: 'bg-[#0f0e0c] text-[#f5f5f5]' // White text for better readability
  }

  const themeTextColors = {
    light: '#2a2a2a',
    sepia: '#5f4b32',
    dark: '#f5f5f5'
  }

  return (
    <div className={cn("min-h-screen transition-all duration-700 ease-in-out", themeColors[theme])}>
      {/* Top Bar - Enhanced with shadow and better spacing */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-700 shadow-lg",
        theme === 'light' && "bg-gradient-to-b from-gold-50/98 to-gold-50/95 border-gold-300/60 shadow-gold-200/20",
        theme === 'sepia' && "bg-gradient-to-b from-amber-100/98 to-amber-50/95 border-amber-400/60 shadow-amber-300/20",
        theme === 'dark' && "bg-gradient-to-b from-[#0f0e0c]/98 to-[#0f0e0c]/95 border-gold-600/40 shadow-gold-900/30"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-all duration-200"
            >
              <a href={`/books/${book.slug}`} className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                <span className="font-medium">بازگشت</span>
              </a>
            </Button>
            <div className="border-r border-gold-300 dark:border-gold-700 pr-5 h-10" />
            <div>
              <h1 className="font-bold text-lg tracking-tight">{book.title}</h1>
              <p className={cn(
                "text-sm mt-0.5",
                theme === 'dark' ? 'text-gold-300' : 'text-gold-700'
              )}>{book.authors?.name || 'نویسنده نامشخص'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={() => {
                const themes: Array<'light' | 'sepia' | 'dark'> = ['light', 'sepia', 'dark']
                const currentIndex = themes.indexOf(theme)
                const nextTheme = themes[(currentIndex + 1) % themes.length]
                setTheme(nextTheme)
              }}
              className="relative group p-2 rounded-lg hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-all duration-300"
              title="تغییر تم"
            >
              <div className="relative w-6 h-6">
                {/* Sun Icon */}
                <Sun className={cn(
                  "absolute inset-0 h-6 w-6 text-gold-600 transition-all duration-500",
                  theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                )} />

                {/* Type Icon (Sepia) */}
                <Type className={cn(
                  "absolute inset-0 h-6 w-6 text-amber-700 transition-all duration-500",
                  theme === 'sepia' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                )} />

                {/* Moon Icon */}
                <Moon className={cn(
                  "absolute inset-0 h-6 w-6 text-gold-400 transition-all duration-500",
                  theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
                )} />
              </div>

              {/* Tooltip */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {theme === 'light' ? 'روشن' : theme === 'sepia' ? 'سپیا' : 'تاریک'}
              </span>
            </button>


            {/* Highlights Panel Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHighlights(!showHighlights)}
                className={cn(
                  "relative transition-all duration-300 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl",
                  showHighlights && "bg-gold-100 dark:bg-gold-900/30"
                )}
              >
                <Highlighter className="h-5 w-5" />
                {highlights.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gold-600 hover:bg-gold-600">
                    {highlights.length}
                  </Badge>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="transition-all duration-300 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="transition-all duration-300 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced with better spacing and modern design */}
      <div className="pt-28 pb-36 min-h-screen">
        <div className="max-w-4xl mx-auto px-10">
          {/* Page Content */}
          <div
            ref={pageRef}
            className={cn(
              "prose prose-lg max-w-none transition-all duration-250 ease-in-out",
              isTransitioning && "opacity-0 translate-x-4"
            )}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              letterSpacing: `${letterSpacing}px`,
              textAlign: 'justify',
              color: themeTextColors[theme]
            }}
            onMouseUp={handleTextSelection}
          >
            <div className="min-h-[65vh] py-16">
              {book.content[currentPage]}
            </div>
          </div>

          {/* Page Number - Enhanced with better visibility */}
          <div className={cn(
            "text-center mt-10 text-sm font-medium tracking-wide",
            theme === 'dark' ? 'text-gold-400' : 'text-gold-700'
          )}>
            صفحه {(currentPage + 1).toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Enhanced with shadow and better spacing */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t transition-all duration-700 shadow-lg",
        theme === 'light' && "bg-gradient-to-t from-gold-50/98 to-gold-50/95 border-gold-300/60 shadow-gold-200/20",
        theme === 'sepia' && "bg-gradient-to-t from-amber-100/98 to-amber-50/95 border-amber-400/60 shadow-amber-300/20",
        theme === 'dark' && "bg-gradient-to-t from-[#0f0e0c]/98 to-[#0f0e0c]/95 border-gold-600/40 shadow-gold-900/30"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            {/* RTL: بعدی (Next) on RIGHT with arrow pointing RIGHT → */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
              <Button
                variant="ghost"
                size="lg"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="min-w-[110px] font-bold hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-all duration-200 rounded-xl"
              >
                بعدی
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
            </motion.div>

            <div className="flex-1">
              <Slider
                value={[currentPage]}
                max={totalPages - 1}
                step={1}
                onValueChange={(value) => {
                  const newPage = value[0]
                  if (newPage !== currentPage) {
                    goToPage(newPage)
                  }
                }}
                className="cursor-pointer"
              />
              <div className={cn(
                "flex justify-between mt-3 text-xs font-medium px-1",
                theme === 'dark' ? 'text-gold-400' : 'text-gold-700'
              )}>
                <span>پایان</span>
                <span className="text-base font-bold">{Math.round((currentPage / totalPages) * 100)}٪</span>
                <span>شروع</span>
              </div>
            </div>

            {/* RTL: قبلی (Previous) on LEFT with arrow pointing LEFT ← */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
              <Button
                variant="ghost"
                size="lg"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="min-w-[110px] font-bold hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-all duration-200 rounded-xl"
              >
                <ArrowRight className="h-5 w-5 ml-2" />
                قبلی
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Text Selection Menu with Add to Vocabulary */}
      <AnimatePresence>
        {showTextMenu && (
          <TextSelectionMenu
            position={menuPosition}
            theme={theme}
            onHighlight={addHighlight}
            onAddToVocabulary={addToVocabulary}
            onAIChat={() => {
              setShowChat(true)
              setShowTextMenu(false)
            }}
            onClose={() => setShowTextMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      {showSettings && (
        <div className={cn(
          "fixed inset-y-0 left-0 w-80 border-r shadow-2xl z-50 overflow-y-auto transition-all duration-700 animate-slide-in-left",
          theme === 'light' && "bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200",
          theme === 'sepia' && "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300",
          theme === 'dark' && "bg-gradient-to-br from-[#0f0e0c] to-[#1a1612] border-gold-700"
        )}>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">تنظیمات</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm font-medium mb-3 block">تم</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all bg-[#faf8f3]",
                    theme === 'light' ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gold-200'
                  )}
                >
                  <Sun className="h-5 w-5 mx-auto mb-1 text-gold-600" />
                  <p className="text-xs text-gold-700">روشن</p>
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all bg-[#f4ecd8]",
                    theme === 'sepia' ? 'border-gold-500 ring-2 ring-gold-200' : 'border-gold-200'
                  )}
                >
                  <Type className="h-5 w-5 mx-auto mb-1 text-[#5f4b32]" />
                  <p className="text-xs text-[#5f4b32]">سپیا</p>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all bg-[#0f0e0c]",
                    theme === 'dark' ? 'border-gold-500 ring-2 ring-gold-700' : 'border-gold-700'
                  )}
                >
                  <Moon className="h-5 w-5 mx-auto mb-1 text-gold-400" />
                  <p className="text-xs text-gold-300">تاریک</p>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                اندازه فونت: {fontSize} پیکسل
              </label>
              <Slider
                value={[fontSize]}
                min={10}
                max={40}
                step={1}
                onValueChange={(value) => setFontSize(value[0])}
                className="transition-all duration-200"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>10px</span>
                <span>40px</span>
              </div>
            </div>

            <Separator />

            {/* Line Height */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                فاصله خطوط: {lineHeight.toFixed(1)}
              </label>
              <Slider
                value={[lineHeight]}
                min={0}
                max={3}
                step={0.1}
                onValueChange={(value) => setLineHeight(value[0])}
                className="transition-all duration-200"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0 (فشرده)</span>
                <span>3 (باز)</span>
              </div>
            </div>

            <Separator />

            {/* Letter Spacing */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                فاصله حروف: {letterSpacing}px
              </label>
              <Slider
                value={[letterSpacing]}
                min={-2}
                max={5}
                step={0.5}
                onValueChange={(value) => setLetterSpacing(value[0])}
                className="transition-all duration-200"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>-2px</span>
                <span>+5px</span>
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <label className="text-sm font-medium mb-3 block">پیش‌نمایش</label>
              <div className={cn(
                "rounded-lg border-2 p-4 transition-all duration-300",
                theme === 'light' && "bg-[#faf8f3] border-gold-200",
                theme === 'sepia' && "bg-[#f4ecd8] border-amber-300",
                theme === 'dark' && "bg-[#0f0e0c] border-gold-700"
              )}>
                <p
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}px`,
                    textAlign: 'justify'
                  }}
                  className="transition-all duration-300"
                >
                  این یک متن نمونه است. This is sample text to preview your reading settings in real-time.
                </p>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className={cn(
          "fixed inset-y-0 left-0 w-96 border-r shadow-2xl z-50 flex flex-col transition-all duration-700 animate-slide-in-left",
          theme === 'light' && "bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200",
          theme === 'sepia' && "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300",
          theme === 'dark' && "bg-gradient-to-br from-[#0f0e0c] to-[#1a1612] border-gold-700"
        )}>
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold">چت هوشمند</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {selectedText && (
              <div className="p-3 bg-muted rounded-lg mb-4">
                <p className="text-xs font-medium mb-1">متن انتخابی:</p>
                <p className="text-sm">{selectedText}</p>
              </div>
            )}
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>سوال خود را بپرسید</p>
            </div>
          </div>

          <div className={cn(
            "p-4 border-t",
            theme === 'dark' ? "border-gold-700" : "border-gold-200"
          )}>
            <input
              type="text"
              placeholder="سوال بپرسید..."
              className={cn(
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all",
                theme === 'dark'
                  ? "border-gold-700 bg-[#1a1612] text-[#e8e6e3]"
                  : "border-gold-300 bg-white"
              )}
            />
          </div>
        </div>
      )}

      {/* Highlights Panel - Organized by Page */}
      <AnimatePresence>
        {showHighlights && (
          <HighlightsPanel
            highlights={highlights}
            theme={theme}
            onClose={() => setShowHighlights(false)}
            onDelete={deleteHighlight}
            onCopy={copyHighlight}
            onJumpToPage={(page) => {
              goToPage(page)
              setShowHighlights(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
