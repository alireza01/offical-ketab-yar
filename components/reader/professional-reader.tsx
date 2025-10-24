'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import type { MockBook } from '@/lib/dev/mock-data'
import { cn } from '@/lib/utils'
import { Bookmark, ChevronLeft, ChevronRight, MessageSquare, Moon, Settings, Sun, Type, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

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
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia')
  const [selectedText, setSelectedText] = useState('')
  const [showTextMenu, setShowTextMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [bookmarks, setBookmarks] = useState<number[]>([])
  interface Highlight {
    page: number;
    text: string;
    color: string;
  }
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const pageRef = useRef<HTMLDivElement>(null)
  
  const totalPages = book.content.length

  const goToPage = useCallback((page: number) => {
    if (page < 0 || page >= totalPages || isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsTransitioning(false)
    }, 300)
  }, [totalPages, isTransitioning])

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    
    if (text && text.length > 0) {
      setSelectedText(text)
      const range = selection?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()
      
      if (rect) {
        setMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 60
        })
        setShowTextMenu(true)
      }
    } else {
      setShowTextMenu(false)
    }
  }, [])

  const addHighlight = (color: string) => {
    if (selectedText) {
      setHighlights([...highlights, {
        text: selectedText,
        page: currentPage,
        color
      }])
      setShowTextMenu(false)
    }
  }

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(p => p !== currentPage))
    } else {
      setBookmarks([...bookmarks, currentPage])
    }
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
    light: 'bg-[#faf8f3] text-[#3a3a3a]',
    sepia: 'bg-[#f4ecd8] text-[#5f4b32]',
    dark: 'bg-[#1a1612] text-[#e8e6e3]'
  }

  return (
    <div className={cn("min-h-screen transition-all duration-700 ease-in-out", themeColors[theme])}>
      {/* Top Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-all duration-700",
        theme === 'light' && "bg-gradient-to-b from-gold-50/95 to-gold-50/80 border-gold-200/50",
        theme === 'sepia' && "bg-gradient-to-b from-amber-100/95 to-amber-50/80 border-amber-300/50",
        theme === 'dark' && "bg-gradient-to-b from-gray-900/95 to-gray-900/80 border-gold-800/30"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href={`/books/${book.slug}`}>
                <ChevronRight className="h-4 w-4 ml-2" />
                بازگشت
              </a>
            </Button>
            <div>
              <h1 className="font-semibold text-lg">{book.title}</h1>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className={cn(
                "transition-all duration-300",
                bookmarks.includes(currentPage) ? 'text-gold-600 scale-110' : ''
              )}
            >
              <Bookmark className={cn(
                "h-5 w-5 transition-all duration-300",
                bookmarks.includes(currentPage) && "fill-gold-600"
              )} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)} className="transition-all duration-300 hover:scale-110">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="transition-all duration-300 hover:scale-110">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-8">
          {/* Page Content */}
          <div
            ref={pageRef}
            className={cn(
              "prose prose-lg max-w-none transition-all duration-500",
              isTransitioning && "opacity-0 scale-95"
            )}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              textAlign: 'justify'
            }}
            onMouseUp={handleTextSelection}
          >
            <div className="min-h-[70vh] py-12">
              {book.content[currentPage]}
            </div>
          </div>

          {/* Page Number */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            صفحه {(currentPage + 1).toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg border-t transition-all duration-700",
        theme === 'light' && "bg-gradient-to-t from-gold-50/95 to-gold-50/80 border-gold-200/50",
        theme === 'sepia' && "bg-gradient-to-t from-amber-100/95 to-amber-50/80 border-amber-300/50",
        theme === 'dark' && "bg-gradient-to-t from-gray-900/95 to-gray-900/80 border-gold-800/30"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="min-w-[100px]"
            >
              قبلی
              <ChevronRight className="h-5 w-5 mr-2" />
            </Button>

            <div className="flex-1">
              <Slider
                value={[currentPage]}
                max={totalPages - 1}
                step={1}
                onValueChange={(value) => goToPage(value[0])}
                className="cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1">
                <span>شروع</span>
                <span>{Math.round((currentPage / totalPages) * 100)}٪</span>
                <span>پایان</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="lg"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="min-w-[100px]"
            >
              <ChevronLeft className="h-5 w-5 ml-2" />
              بعدی
            </Button>
          </div>
        </div>
      </div>

      {/* Text Selection Menu */}
      {showTextMenu && (
        <div
          className="fixed z-[100] bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gold-300 dark:border-gold-700 rounded-xl shadow-2xl p-2 flex gap-1"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
            transform: 'translate(-50%, 0)'
          }}
        >
          <Button size="sm" variant="ghost" onClick={() => addHighlight('yellow')} title="هایلایت زرد" className="hover:bg-gold-100">
            <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded border border-yellow-500" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addHighlight('orange')} title="هایلایت نارنجی" className="hover:bg-gold-100">
            <div className="w-5 h-5 bg-gradient-to-br from-orange-300 to-orange-400 rounded border border-orange-500" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addHighlight('gold')} title="هایلایت طلایی" className="hover:bg-gold-100">
            <div className="w-5 h-5 bg-gradient-to-br from-gold-300 to-gold-400 rounded border border-gold-500" />
          </Button>
          <div className="w-px bg-gold-300 mx-1" />
          <Button size="sm" variant="ghost" onClick={() => {
            // TODO: Implement AI chat with selected text context
            // This will open AI chat with the selected text as context
            setShowTextMenu(false)
          }} className="hover:bg-gold-100">
            <MessageSquare className="h-4 w-4 text-gold-600" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowTextMenu(false)} className="hover:bg-gold-100">
            <X className="h-4 w-4 text-gold-600" />
          </Button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className={cn(
          "fixed inset-y-0 left-0 w-80 border-r shadow-2xl z-50 overflow-y-auto transition-all duration-700 animate-slide-in-left",
          theme === 'light' && "bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200",
          theme === 'sepia' && "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300",
          theme === 'dark' && "bg-gradient-to-br from-gray-900 to-gray-800 border-gold-800"
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
                    "p-4 rounded-lg border-2 transition-all bg-[#1a1612]",
                    theme === 'dark' ? 'border-gold-500 ring-2 ring-gold-800' : 'border-gold-700'
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
                min={16}
                max={32}
                step={2}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>

            {/* Line Height */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                فاصله خطوط: {lineHeight}
              </label>
              <Slider
                value={[lineHeight]}
                min={1.4}
                max={2.2}
                step={0.1}
                onValueChange={(value) => setLineHeight(value[0])}
              />
            </div>

            {/* Bookmarks */}
            <div>
              <h3 className="text-sm font-medium mb-3">نشانک‌ها ({bookmarks.length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {bookmarks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">بدون نشانک</p>
                ) : (
                  bookmarks.map(page => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className="w-full text-right p-2 rounded hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-colors text-sm border border-gold-200 dark:border-gold-800"
                    >
                      صفحه {(page + 1).toLocaleString('fa-IR')}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-sm font-medium mb-3">هایلایت‌ها ({highlights.length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {highlights.length === 0 ? (
                  <p className="text-sm text-muted-foreground">بدون هایلایت</p>
                ) : (
                  highlights.map((h, i) => (
                    <div key={i} className="p-2 rounded border-2 border-gold-200 dark:border-gold-800 bg-gold-50 dark:bg-gold-900/20 text-sm">
                      <p className="line-clamp-2">{h.text}</p>
                      <p className="text-xs text-gold-600 dark:text-gold-400 mt-1">
                        صفحه {(h.page + 1).toLocaleString('fa-IR')}
                      </p>
                    </div>
                  ))
                )}
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
          theme === 'dark' && "bg-gradient-to-br from-gray-900 to-gray-800 border-gold-800"
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
          
          <div className="p-4 border-t border-gold-200 dark:border-gold-800">
            <input
              type="text"
              placeholder="سوال بپرسید..."
              className="w-full px-4 py-3 border-2 border-gold-300 dark:border-gold-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  )
}
