'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BookmarkPlus, MessageSquare, X } from 'lucide-react'

interface TextSelectionMenuProps {
    position: { x: number; y: number }
    theme: 'light' | 'sepia' | 'dark'
    onHighlight: (color: string) => void
    onAddToVocabulary?: () => void // Optional - only for single words
    onAIChat: () => void
    onClose: () => void
}

export function TextSelectionMenu({
    position,
    theme,
    onHighlight,
    onAddToVocabulary,
    onAIChat,
    onClose
}: TextSelectionMenuProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
                "fixed z-[100] rounded-xl shadow-2xl p-2 flex gap-1.5 backdrop-blur-xl border-2",
                theme === 'dark'
                    ? "bg-gradient-to-br from-[#1a1612]/98 to-[#0f0e0c]/98 border-gold-600 shadow-gold-900/50"
                    : "bg-gradient-to-br from-gold-50/98 to-amber-50/98 border-gold-400 shadow-gold-300/50"
            )}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, 0)'
            }}
        >
            {/* Highlight Colors */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onHighlight('yellow')}
                    title="هایلایت زرد"
                    className="hover:bg-gold-100 dark:hover:bg-gold-900/50 transition-all duration-200 p-2 rounded-lg"
                >
                    <div className="w-7 h-7 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-md border-2 border-yellow-500 shadow-md" />
                </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onHighlight('orange')}
                    title="هایلایت نارنجی"
                    className="hover:bg-gold-100 dark:hover:bg-gold-900/50 transition-all duration-200 p-2 rounded-lg"
                >
                    <div className="w-7 h-7 bg-gradient-to-br from-orange-300 to-orange-400 rounded-md border-2 border-orange-500 shadow-md" />
                </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onHighlight('gold')}
                    title="هایلایت طلایی"
                    className="hover:bg-gold-100 dark:hover:bg-gold-900/50 transition-all duration-200 p-2 rounded-lg"
                >
                    <div className="w-7 h-7 bg-gradient-to-br from-gold-400 to-gold-500 rounded-md border-2 border-gold-600 shadow-md" />
                </Button>
            </motion.div>

            {/* Only show vocabulary button for single words */}
            {onAddToVocabulary && (
                <>
                    <div className={cn(
                        "w-px mx-1 my-1",
                        theme === 'dark' ? 'bg-gold-700' : 'bg-gold-300'
                    )} />

                    {/* Add to Vocabulary */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onAddToVocabulary}
                            className="hover:bg-gold-100 dark:hover:bg-gold-900/50 transition-all duration-200 p-2 rounded-lg"
                            title="افزودن به واژگان"
                        >
                            <BookmarkPlus className={cn(
                                "h-5 w-5",
                                theme === 'dark' ? 'text-gold-400' : 'text-gold-600'
                            )} />
                        </Button>
                    </motion.div>
                </>
            )}

            {/* AI Chat */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onAIChat}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 p-2 rounded-lg relative"
                    title="پرسیدن از AI درباره این متن"
                >
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <motion.div
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </Button>
            </motion.div>

            <div className={cn(
                "w-px mx-1 my-1",
                theme === 'dark' ? 'bg-gold-700' : 'bg-gold-300'
            )} />

            {/* Close */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="hover:bg-gold-100 dark:hover:bg-gold-900/50 transition-all duration-200 p-2 rounded-lg"
                    title="بستن"
                >
                    <X className={cn(
                        "h-5 w-5",
                        theme === 'dark' ? 'text-gold-400' : 'text-gold-600'
                    )} />
                </Button>
            </motion.div>
        </motion.div>
    )
}
