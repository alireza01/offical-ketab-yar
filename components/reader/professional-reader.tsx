'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/custom-toast'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useReadingPreferences } from '@/hooks/use-reading-preferences'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronRight, Highlighter, MessageSquare, Moon, Settings, Sun, Type, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AIChatPanel } from './ai-chat-panel'
import { HighlightsPanelImproved } from './highlights-panel-improved'
import { TextSelectionMenu } from './text-selection-menu'

// Lazy load physics component for better performance
const PhysicsPageTurn = dynamic(
  () => import('./physics/PhysicsPageTurn').then((mod) => mod.PhysicsPageTurn),
  {
    loading: () => null,
    ssr: false,
  }
)

// Lazy load dictionary popup
const WordPopupDictionary = dynamic(
  () => import('./word-popup-dictionary').then((mod) => mod.WordPopupDictionary),
  {
    loading: () => null,
    ssr: false,
  }
)

interface BilingualContent {
  english: string
  farsi: string
}

interface ReaderProps {
  book: {
    content: BilingualContent[]
    title: string
    slug: string
    author?: string
  }
}

export function ProfessionalReader({ book }: ReaderProps) {
  // All hooks must be called before any conditional returns (Rules of Hooks)
  const { preferences, updatePreference } = useReadingPreferences()
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [fontSize, setFontSize] = useState(20)
  const [lineHeight, setLineHeight] = useState(1.8)
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('sepia')
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'farsi'>('english')
  const [showSubtitles, setShowSubtitles] = useState(true)
  const [selectedText, setSelectedText] = useState('')
  const [showTextMenu, setShowTextMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [showHighlights, setShowHighlights] = useState(false)
  const [showDictionary, setShowDictionary] = useState(false)
  const [dictionaryWord, setDictionaryWord] = useState('')
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
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalPages = book.content.length

  // Get current page text based on selected language
  const getCurrentPageText = () => {
    const pageContent = book.content[currentPage]
    if (!pageContent) return ''
    return currentLanguage === 'english' ? pageContent.english : pageContent.farsi
  }

  // Get subtitle text (opposite language)
  const getSubtitleText = () => {
    const pageContent = book.content[currentPage]
    if (!pageContent) return ''
    return currentLanguage === 'english' ? pageContent.farsi : pageContent.english
  }

  // ============================================
  // PERSISTENCE: Load saved data on mount
  // ============================================
  useEffect(() => {
    // Load highlights from localStorage
    const loadHighlights = () => {
      try {
        const key = `highlights_${book.slug}`
        const stored = localStorage.getItem(key)
        if (stored) {
          const parsed = JSON.parse(stored)
          setHighlights(parsed)
          console.log(`✅ Loaded ${parsed.length} highlights from localStorage`)
        }
      } catch (error) {
        console.error('Error loading highlights:', error)
      }
    }

    // Load reader state (page, theme, font settings)
    const loadState = () => {
      try {
        const key = `reader_state_${book.slug}`
        const stored = localStorage.getItem(key)
        if (stored) {
          const state = JSON.parse(stored)
          if (state.currentPage !== undefined) {
            setCurrentPage(state.currentPage)
            console.log(`📖 Restored to page ${state.currentPage}`)
          }
          if (state.theme) setTheme(state.theme)
          if (state.fontSize) setFontSize(state.fontSize)
          if (state.lineHeight) setLineHeight(state.lineHeight)
          if (state.showSubtitles !== undefined) setShowSubtitles(state.showSubtitles)
          console.log(`✅ Loaded reader state from localStorage`)
        }
      } catch (error) {
        console.error('Error loading reader state:', error)
      }
    }

    loadHighlights()
    loadState()
  }, [book.slug])

  const restoreHighlightsToDOM = useCallback(() => {
    // Get highlights for current page
    const pageHighlights = highlights.filter(h => h.page === currentPage)
    if (pageHighlights.length === 0) return

    console.log(`🎨 Restoring ${pageHighlights.length} highlights to page ${currentPage}`)

    // For each highlight, find the text and wrap it
    pageHighlights.forEach(highlight => {
      try {
        const pageContent = pageRef.current
        if (!pageContent) return

        // Find all text nodes
        const walker = document.createTreeWalker(
          pageContent,
          NodeFilter.SHOW_TEXT,
          null
        )

        const textNodes: Text[] = []
        let node
        while ((node = walker.nextNode())) {
          textNodes.push(node as Text)
        }

        // Search for the highlight text in text nodes
        for (const textNode of textNodes) {
          const text = textNode.textContent || ''
          const index = text.indexOf(highlight.text)

          if (index !== -1) {
            // Found the text! Wrap it in a highlight span
            const range = document.createRange()
            range.setStart(textNode, index)
            range.setEnd(textNode, index + highlight.text.length)

            // Create highlight span with saved styling
            const span = document.createElement('span')
            span.className = `highlight-${highlight.color}`
            span.setAttribute('data-highlight-id', highlight.id)

            // Apply the same styling as when created
            const baseColors = {
              yellow: { r: 251, g: 209, b: 32 },
              orange: { r: 252, g: 156, b: 74 },
              gold: { r: 202, g: 172, b: 105 }
            }
            const base = baseColors[highlight.color as keyof typeof baseColors]
            const r = base.r
            const g = base.g
            const b = base.b
            const opacity = 0.5 // Use fixed opacity for restored highlights

            const gradient = `linear-gradient(180deg, 
              rgba(${r}, ${g}, ${b}, ${opacity + 0.15}) 0%, 
              rgba(${r}, ${g}, ${b}, ${opacity}) 50%, 
              rgba(${r}, ${g}, ${b}, ${opacity + 0.15}) 100%
            )`

            span.style.background = gradient
            span.style.backgroundSize = '100% 100%'
            span.style.backgroundPosition = 'center'
            span.style.backgroundRepeat = 'no-repeat'
            span.style.color = 'inherit'
            span.style.padding = '2px 0px' // Minimal padding to prevent layout shift
            span.style.borderRadius = '2px'
            span.style.boxShadow = `0 0 4px rgba(${r}, ${g}, ${b}, 0.3)`
            span.style.display = 'inline' // Ensure inline display
            span.style.lineHeight = 'inherit' // Don't change line height

            // Wrap the text
            range.surroundContents(span)
            console.log(`✅ Restored highlight: "${highlight.text.substring(0, 30)}..."`)
            break // Found and applied, move to next highlight
          }
        }
      } catch (error) {
        console.error('Error restoring highlight:', error)
      }
    })
  }, [highlights, currentPage])

  // Restore highlights to DOM when page changes or highlights load
  useEffect(() => {
    // Restore immediately to prevent visual jump
    // Use requestAnimationFrame to wait for DOM to be ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        restoreHighlightsToDOM()
      })
    })
  }, [currentPage, highlights.length, restoreHighlightsToDOM])

  // Save highlights to localStorage whenever they change
  useEffect(() => {
    if (highlights.length > 0) {
      try {
        const key = `highlights_${book.slug}`
        localStorage.setItem(key, JSON.stringify(highlights))
        console.log(`💾 Saved ${highlights.length} highlights to localStorage`)
      } catch (error) {
        console.error('Error saving highlights:', error)
      }
    }
  }, [highlights, book.slug])

  // Save reader state whenever it changes
  useEffect(() => {
    try {
      const key = `reader_state_${book.slug}`
      const state = {
        currentPage,
        theme,
        fontSize,
        lineHeight,
        showSubtitles,
        lastReadAt: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error('Error saving reader state:', error)
    }
  }, [currentPage, theme, fontSize, lineHeight, showSubtitles, book.slug])

  // Determine which animation to use
  const usePhysicsAnimation =
    preferences.physicsPageTurn &&
    !prefersReducedMotion &&
    preferences.pageAnimation

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const goToPage = useCallback((page: number) => {
    if (page < 0 || page >= totalPages || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(page)
      setTimeout(() => {
        setIsTransitioning(false)
        // Restore highlights after page renders
        setTimeout(() => restoreHighlightsToDOM(), 100)
      }, 250)
    }, 50)
  }, [totalPages, isTransitioning, restoreHighlightsToDOM])

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

      // Base colors for each highlighter (EXACT colors - no randomization)
      const baseColors = {
        yellow: { r: 251, g: 209, b: 32 },
        orange: { r: 252, g: 156, b: 74 },
        gold: { r: 202, g: 172, b: 105 }
      }

      const base = baseColors[color as keyof typeof baseColors]

      // Use exact colors (no color randomization)
      const r = base.r
      const g = base.g
      const b = base.b

      // CONSISTENT opacity - same for all highlights
      const opacity = 0.5 // Fixed opacity for consistency

      // STRONG edge saturation (like real highlighter - edges get MORE ink)
      const edgeOpacity = Math.min(0.85, opacity + 0.25) // Much more saturated edges
      const edgeR = Math.min(255, Math.round(r * 1.15)) // Edges 15% more intense
      const edgeG = Math.min(255, Math.round(g * 1.15))
      const edgeB = Math.min(255, Math.round(b * 1.15))

      // Create realistic gradient with STRONG edge effect
      const centerColor = `rgba(${r}, ${g}, ${b}, ${opacity})`
      const edgeColor = `rgba(${edgeR}, ${edgeG}, ${edgeB}, ${edgeOpacity})`
      const strongEdgeColor = `rgba(${edgeR}, ${edgeG}, ${edgeB}, ${Math.min(0.9, edgeOpacity + 0.1)})`

      // Random distortion values for organic imperfection
      const topDistortion = 2 + Math.random() * 8 // 2-10%
      const bottomDistortion = 2 + Math.random() * 8
      const middleShift = 40 + Math.random() * 20 // 40-60% (not perfectly centered)

      // COMPLEX gradient with visible distortion and edge saturation
      const gradient = `linear-gradient(180deg, 
        ${strongEdgeColor} 0%, 
        ${edgeColor} ${topDistortion}%, 
        ${centerColor} ${middleShift}%, 
        ${edgeColor} ${100 - bottomDistortion}%, 
        ${strongEdgeColor} 100%
      )`

      // Apply styles with STRONG organic imperfections
      span.style.background = gradient
      span.style.color = 'inherit'

      // Minimal padding to prevent layout shift (vertical only)
      const topPadding = 1 + Math.random() * 1.5
      const bottomPadding = 1 + Math.random() * 1.5
      span.style.padding = `${topPadding}px 0px ${bottomPadding}px 0px`

      // Keep inline display to prevent text jumping
      span.style.display = 'inline'
      span.style.lineHeight = 'inherit'

      // Random border radius (0.5-4px - very visible variation)
      const borderRadius = 0.5 + Math.random() * 3.5
      span.style.borderRadius = `${borderRadius}px`

      // STRONG glow effect (3-8px blur - very visible)
      const glowIntensity = 3 + Math.random() * 5
      const glowOpacity = 0.2 + Math.random() * 0.3
      span.style.boxShadow = `
        0 0 ${glowIntensity}px rgba(${r}, ${g}, ${b}, ${glowOpacity}),
        inset 0 1px 0 rgba(255, 255, 255, ${0.1 + Math.random() * 0.2}),
        inset 0 -1px 0 rgba(0, 0, 0, ${0.05 + Math.random() * 0.1})
      `

      // Random slight skew for distortion (like pen pressure variation)
      const skewAmount = (Math.random() - 0.5) * 2 // -1 to 1 degree

      // REALISTIC HIGHLIGHTING ANIMATION - Like dragging a real highlighter pen!
      // Animate ONLY the background (highlight color), text stays visible
      const animationDuration = 0.3 + Math.random() * 0.15 // 0.3-0.45s (varies per highlight)

      // Detect text direction: RTL (Persian/Arabic) or LTR (English)
      const isPersian = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(selectedText)
      const isRTL = isPersian

      // Use background-size animation to create pen stroke effect
      span.style.backgroundSize = '0% 100%' // Start with no background visible
      span.style.backgroundPosition = isRTL ? 'right center' : 'left center' // RTL: right to left, LTR: left to right
      span.style.backgroundRepeat = 'no-repeat'
      span.style.transform = `skewX(${skewAmount}deg)`
      span.style.transition = `background-size ${animationDuration}s cubic-bezier(0.25, 0.1, 0.25, 1), transform ${animationDuration}s ease-out`

      try {
        selectedRange.surroundContents(span)

        // Trigger the "pen stroke" animation after DOM insertion
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Expand background from 0% to 100% width (pen stroke effect)
            span.style.backgroundSize = '100% 100%'
            span.style.transform = 'skewX(0deg)'
          })
        })

        // Play highlighter sound effect with MORE variation
        const audio = new Audio('/sounds/highlight.mp3')
        audio.volume = 0.25 + Math.random() * 0.15 // 0.25-0.4 volume
        audio.playbackRate = 0.9 + Math.random() * 0.2 // 0.9-1.1 speed (more variation)
        audio.play().catch(() => { }) // Ignore if sound fails

      } catch {
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

      toast.success('هایلایت ذخیره شد')
    }
  }

  const showDictionaryPopup = () => {
    if (selectedText) {
      setDictionaryWord(selectedText)
      setShowDictionary(true)
      setShowTextMenu(false)
    }
  }

  const addToVocabulary = async () => {
    if (selectedText) {
      try {
        // Fetch definition from Free Dictionary API
        const { fetchWordDefinition } = await import('@/lib/dictionary/free-dictionary-api')
        const definition = await fetchWordDefinition(selectedText)

        if (definition) {
          // Show definition in toast
          const firstDef = definition.definitions[0]
          toast.success(
            `"${selectedText}" به واژگان اضافه شد`,
            `${firstDef?.partOfSpeech}: ${firstDef?.meaning.slice(0, 60)}...`
          )
        } else {
          toast.success(`"${selectedText}" به لیست واژگان اضافه شد`)
        }
      } catch (error) {
        console.error('Error fetching definition:', error)
        toast.success(`"${selectedText}" به لیست واژگان اضافه شد`)
      }

      setShowTextMenu(false)
      window.getSelection()?.removeAllRanges()
    }
  }

  const copySelectedText = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
      toast.success('متن کپی شد')
      setShowTextMenu(false)
      window.getSelection()?.removeAllRanges()
    }
  }

  const handleSaveWordFromDictionary = (wordData: {
    word: string
    definition: string
    translation: string
    context?: string
  }) => {
    // Save to vocabulary
    toast.success(
      `"${wordData.word}" به واژگان اضافه شد`,
      wordData.definition.slice(0, 60) + '...'
    )
    setShowDictionary(false)
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
    toast.success('هایلایت حذف شد')
  }

  const copyHighlight = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('کپی شد')
  }



  // Auto-hide controls on desktop
  useEffect(() => {
    if (isMobile) return // Don't auto-hide on mobile

    const handleMouseMove = () => {
      setShowControls(true)

      // Clear existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      // Hide controls after 3 seconds of inactivity
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isMobile])

  // Show controls on mobile tap
  const handleMobileTap = () => {
    if (isMobile) {
      setShowControls(!showControls)
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

  // Safety check: Ensure book has content (AFTER all hooks)
  if (!book || !book.content || book.content.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">⚠️ Reader Error</h1>
          <p className="text-muted-foreground">Book content is empty or invalid.</p>
          <pre className="text-left bg-muted p-4 rounded-lg overflow-auto max-w-2xl text-xs">
            {JSON.stringify(book, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

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
    <div
      className={cn("relative min-h-screen transition-all duration-700 ease-in-out", themeColors[theme])}
      onClick={handleMobileTap}
    >
      {/* Top Bar - AUTO-HIDE with smooth animation */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showControls ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b transition-all duration-700 shadow-lg",
          theme === 'light' && "bg-gradient-to-b from-gold-50/98 to-gold-50/95 border-gold-300/60 shadow-gold-200/20",
          theme === 'sepia' && "bg-gradient-to-b from-amber-100/98 to-amber-50/95 border-amber-400/60 shadow-amber-300/20",
          theme === 'dark' && "bg-gradient-to-b from-[#0f0e0c]/98 to-[#0f0e0c]/95 border-gold-600/40 shadow-gold-900/30"
        )}
      >
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
              <div className="flex items-center gap-2 mt-0.5">
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gold-300' : 'text-gold-700'
                )}>{book.author || 'نویسنده نامشخص'}</p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs text-muted-foreground">فصل ۱</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle - THE MAGIC BUTTON */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentLanguage(currentLanguage === 'english' ? 'farsi' : 'english')
                  toast.success(
                    currentLanguage === 'english' ? 'زبان به فارسی تغییر کرد' : 'Language switched to English'
                  )
                }}
                className={cn(
                  "relative transition-all duration-300 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl px-4 font-semibold",
                  "border-2 border-gold-400 dark:border-gold-600"
                )}
                title={currentLanguage === 'english' ? 'Switch to Farsi' : 'تغییر به انگلیسی'}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">
                    {currentLanguage === 'english' ? 'EN' : 'FA'}
                  </span>
                  <span className="text-xs opacity-70">
                    {currentLanguage === 'english' ? '→ FA' : '→ EN'}
                  </span>
                </span>
              </Button>
            </motion.div>

            {/* Subtitle Toggle Button - NEW! */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSubtitles(!showSubtitles)
                  toast.success(
                    showSubtitles ? 'زیرنویس پنهان شد' : 'زیرنویس نمایش داده شد'
                  )
                }}
                className={cn(
                  "relative transition-all duration-300 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl px-3",
                  showSubtitles && "bg-gold-100 dark:bg-gold-900/30 border-2 border-gold-400 dark:border-gold-600"
                )}
                title={showSubtitles ? 'پنهان کردن زیرنویس' : 'نمایش زیرنویس'}
              >
                <span className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M6 10h4" />
                    <path d="M6 14h4" />
                    <path d="M14 10h4" />
                    <path d="M14 14h4" />
                  </svg>
                  <span className="text-xs font-medium">
                    {showSubtitles ? 'ON' : 'OFF'}
                  </span>
                </span>
              </Button>
            </motion.div>

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

            {/* AI Chat Toggle - REPLACED ICON */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className={cn(
                  "relative transition-all duration-300 hover:bg-gold-100 dark:hover:bg-gold-900/30 rounded-xl",
                  showChat && "bg-gold-100 dark:bg-gold-900/30"
                )}
                title="چت با هوش مصنوعی"
              >
                <MessageSquare className="h-5 w-5" />
                {selectedText && (
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
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
      </motion.div>

      {/* Main Content - Full screen with padding for controls + SCROLLABLE */}
      <div className="pt-28 pb-48 min-h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto px-10">
          {usePhysicsAnimation ? (
            <PhysicsPageTurn
              pageKey={currentPage}
              onPageTurn={(direction) => {
                if (direction === 'next') {
                  nextPage()
                } else {
                  prevPage()
                }
              }}
              theme={theme}
              canGoNext={currentPage < totalPages - 1}
              canGoPrev={currentPage > 0}
            >
              <div
                ref={pageRef}
                className="prose prose-lg max-w-none"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  textAlign: 'justify',
                  color: themeTextColors[theme],
                }}
                onMouseUp={handleTextSelection}
              >
                <motion.div
                  key={`${currentPage}-${currentLanguage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[65vh] py-16"
                  dir={currentLanguage === 'farsi' ? 'rtl' : 'ltr'}
                >
                  {/* Main Text with Subtitles */}
                  <div className="leading-relaxed">
                    {getCurrentPageText().split('\n\n').map((paragraph, idx) => (
                      <div key={idx} className="mb-6">
                        {/* Main text */}
                        <p className="mb-2">{paragraph}</p>

                        {/* Subtitle (opposite language) with smooth animation */}
                        <AnimatePresence>
                          {showSubtitles && (
                            <motion.p
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 0.65, height: 'auto', marginTop: 8 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className={cn(
                                "text-muted-foreground overflow-hidden",
                                theme === 'dark' && 'text-gold-400/70'
                              )}
                              style={{
                                fontSize: `${fontSize * 0.8}px`,
                                lineHeight: lineHeight * 0.9,
                                fontStyle: 'italic',
                              }}
                              dir={currentLanguage === 'farsi' ? 'ltr' : 'rtl'}
                            >
                              {getSubtitleText().split('\n\n')[idx]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </PhysicsPageTurn>
          ) : (
            <div
              ref={pageRef}
              className={cn(
                'prose prose-lg max-w-none transition-all duration-250 ease-in-out',
                isTransitioning && 'opacity-0 translate-x-4'
              )}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                textAlign: 'justify',
                color: themeTextColors[theme],
              }}
              onMouseUp={handleTextSelection}
            >
              <motion.div
                key={`${currentPage}-${currentLanguage}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="min-h-[65vh] py-16"
                dir={currentLanguage === 'farsi' ? 'rtl' : 'ltr'}
              >
                {/* Main Text with Subtitles */}
                <div className="leading-relaxed">
                  {getCurrentPageText().split('\n\n').map((paragraph, idx) => (
                    <div key={idx} className="mb-6">
                      {/* Main text */}
                      <p className="mb-2">{paragraph}</p>

                      {/* Subtitle (opposite language) with smooth animation */}
                      <AnimatePresence>
                        {showSubtitles && (
                          <motion.p
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 0.65, height: 'auto', marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={cn(
                              "text-muted-foreground overflow-hidden",
                              theme === 'dark' && 'text-gold-400/70'
                            )}
                            style={{
                              fontSize: `${fontSize * 0.8}px`,
                              lineHeight: lineHeight * 0.9,
                              fontStyle: 'italic',
                            }}
                            dir={currentLanguage === 'farsi' ? 'ltr' : 'rtl'}
                          >
                            {getSubtitleText().split('\n\n')[idx]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Page Number & Language Indicator - FIXED VISIBILITY */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div
              className={cn(
                'text-center text-sm font-medium tracking-wide',
                theme === 'light' && 'text-gray-700',
                theme === 'sepia' && 'text-amber-900',
                theme === 'dark' && 'text-gold-300'
              )}
            >
              صفحه {(currentPage + 1).toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
            </div>
            <span className={cn(
              "text-xs",
              theme === 'light' && 'text-gray-500',
              theme === 'sepia' && 'text-amber-700',
              theme === 'dark' && 'text-gold-500'
            )}>•</span>
            <Badge variant="outline" className="text-xs">
              {currentLanguage === 'english' ? 'English' : 'فارسی'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - AUTO-HIDE with smooth animation */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showControls ? 0 : 200 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-xl border-t transition-all duration-700 shadow-lg",
          theme === 'light' && "bg-gradient-to-t from-gold-50/98 to-gold-50/95 border-gold-300/60 shadow-gold-200/20",
          theme === 'sepia' && "bg-gradient-to-t from-amber-100/98 to-amber-50/95 border-amber-400/60 shadow-amber-300/20",
          theme === 'dark' && "bg-gradient-to-t from-[#0f0e0c]/98 to-[#0f0e0c]/95 border-gold-600/40 shadow-gold-900/30"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            {/* RTL: قبلی (Previous) on RIGHT with arrow pointing RIGHT → */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
              <Button
                variant="ghost"
                size="lg"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="min-w-[110px] font-bold hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-all duration-200 rounded-xl"
              >
                قبلی
                <ArrowRight className="h-5 w-5 mr-2" />
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
                theme === 'light' && 'text-gray-700',
                theme === 'sepia' && 'text-amber-900',
                theme === 'dark' && 'text-gold-300'
              )}>
                <span>پایان</span>
                <span className="text-base font-bold">{Math.round((currentPage / totalPages) * 100)}٪</span>
                <span>شروع</span>
              </div>
            </div>

            {/* RTL: بعدی (Next) on LEFT with arrow pointing LEFT ← */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
              <Button
                variant="ghost"
                size="lg"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="min-w-[110px] font-bold hover:bg-gold-100 dark:hover:bg-gold-900/30 transition-all duration-200 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                بعدی
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Text Selection Menu with Dictionary & Copy */}
      <AnimatePresence>
        {showTextMenu && (
          <TextSelectionMenu
            position={menuPosition}
            theme={theme}
            selectedText={selectedText}
            onHighlight={addHighlight}
            onShowDictionary={showDictionaryPopup}
            onAddToVocabulary={addToVocabulary}
            onCopy={copySelectedText}
            onAIChat={() => {
              setShowChat(true)
              setShowTextMenu(false)
              // Keep selectedText for AI context, but clear visual selection
              window.getSelection()?.removeAllRanges()
            }}
            onClose={() => {
              setShowTextMenu(false)
              setSelectedText('')
              window.getSelection()?.removeAllRanges()
            }}
          />
        )}
      </AnimatePresence>

      {/* Dictionary Popup */}
      <AnimatePresence>
        {showDictionary && (
          <WordPopupDictionary
            word={dictionaryWord}
            context={getCurrentPageText().slice(0, 200)}
            theme={theme}
            onClose={() => setShowDictionary(false)}
            onSaveWord={handleSaveWordFromDictionary}
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

            {/* Line Height - FIXED RANGE 1-3 */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                فاصله خطوط: {lineHeight.toFixed(1)}
              </label>
              <Slider
                value={[lineHeight]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setLineHeight(value[0])}
                className="transition-all duration-200"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>1 (فشرده)</span>
                <span>3 (باز)</span>
              </div>
            </div>

            <Separator />

            {/* Subtitle Toggle */}
            <div>
              <label className="text-sm font-medium mb-3 block">زیرنویس دوزبانه</label>
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all text-right",
                  showSubtitles
                    ? 'border-gold-500 bg-gold-500/10'
                    : 'border-gold-200 hover:border-gold-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">نمایش زبان دوم</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      نمایش ترجمه زیر هر پاراگراف
                    </p>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full transition-all",
                    showSubtitles ? 'bg-gold-500' : 'bg-gray-300'
                  )}>
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-md transition-all mt-0.5",
                      showSubtitles ? 'mr-6' : 'mr-1'
                    )} />
                  </div>
                </div>
              </button>
            </div>

            {/* Physics Page Turn Toggle */}
            <div>
              <label className="text-sm font-medium mb-3 block">انیمیشن ورق زدن</label>
              <div className="space-y-2">
                <button
                  onClick={() => updatePreference('physicsPageTurn', !preferences.physicsPageTurn)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all text-right",
                    preferences.physicsPageTurn
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-gold-200 hover:border-gold-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">انیمیشن واقع‌گرایانه</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ورق زدن با فیزیک واقعی (ممکن است روی دستگاه‌های ضعیف کند باشد)
                      </p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full transition-all",
                      preferences.physicsPageTurn ? 'bg-gold-500' : 'bg-gray-300'
                    )}>
                      <div className={cn(
                        "w-5 h-5 rounded-full bg-white shadow-md transition-all mt-0.5",
                        preferences.physicsPageTurn ? 'mr-6' : 'mr-1'
                      )} />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <Separator />

            {/* Live Preview */}
            <div>
              <label className="text-sm font-medium mb-3 block">پیش‌نمایش</label>
              <div className={cn(
                "rounded-lg border-2 p-4 transition-all duration-300",
                theme === 'light' && "bg-[#faf8f3] border-gold-200",
                theme === 'sepia' && "bg-[#f4ecd8] border-amber-300",
                theme === 'dark' && "bg-[#0f0e0c] border-gold-700"
              )}>
                <div>
                  <p
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: lineHeight,
                      textAlign: 'justify'
                    }}
                    className="transition-all duration-300 mb-2"
                  >
                    این یک متن نمونه است برای پیش‌نمایش تنظیمات.
                  </p>
                  {showSubtitles && (
                    <p
                      className="text-muted-foreground transition-all duration-300"
                      style={{
                        fontSize: `${fontSize * 0.85}px`,
                        opacity: 0.6,
                        lineHeight: lineHeight * 0.95,
                      }}
                    >
                      This is sample text to preview your settings.
                    </p>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Floating AI Button - REMOVED (now in header) */}

      {/* AI Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <AIChatPanel
            bookTitle={book.title}
            bookAuthor={book.author}
            currentPage={currentPage + 1}
            currentPageText={getCurrentPageText()}
            previousPages={book.content
              .slice(Math.max(0, currentPage - 5), currentPage)
              .map(page => currentLanguage === 'english' ? page.english : page.farsi)}
            selectedText={selectedText}
            theme={theme}
            onClose={() => {
              setShowChat(false)
              setSelectedText('')
              setShowTextMenu(false)
              window.getSelection()?.removeAllRanges()
            }}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>

      {/* Highlights Panel - Organized by Page */}
      <AnimatePresence>
        {showHighlights && (
          <HighlightsPanelImproved
            highlights={highlights}
            currentPage={currentPage}
            theme={theme}
            onClose={() => setShowHighlights(false)}
            onDelete={deleteHighlight}
            onCopy={copyHighlight}
            onJumpToPage={(page) => {
              goToPage(page)
              // Don't close panel - keep it open so user can see undo button
            }}
          />
        )}
      </AnimatePresence>
    </div >
  )
}
