'use client'

import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, BookOpen, Crown, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface VocabularyLimitModalProps {
    show: boolean
    currentCount: number
    limit: number
    onClose: () => void
}

export function VocabularyLimitModal({
    show,
    currentCount,
    limit,
    onClose,
}: VocabularyLimitModalProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onClose()
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative max-w-md w-full mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-orange-500 shadow-2xl overflow-hidden"
                    >
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-10">
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative p-8">
                            {/* Warning Icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                                className="flex justify-center mb-6"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50" />
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
                                        <AlertTriangle className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Title */}
                            <h2 className="text-2xl font-bold text-center mb-3 text-white">
                                حافظه واژگان پر شد! 📚
                            </h2>

                            <p className="text-center text-gray-300 mb-6">
                                شما به حداکثر {limit} واژه رایگان رسیده‌اید ({currentCount}/{limit})
                            </p>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(currentCount / limit) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                    />
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    {currentCount} از {limit} واژه استفاده شده
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#C9A961]/20 rounded-xl p-4 mb-6 border border-[#D4AF37]/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                                    <span className="font-semibold text-white">با پریمیوم:</span>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                                        <span>ذخیره نامحدود واژگان</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                                        <span>سیستم تکرار فاصله‌دار هوشمند</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                                        <span>فلش‌کارت پیشرفته و کوئیز</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C9A961] hover:from-[#C9A961] hover:to-[#B8956A] text-white shadow-lg shadow-[#D4AF37]/30 h-12 text-base font-semibold"
                                >
                                    <Link href="/subscription">
                                        <Crown className="w-5 h-5 ml-2" />
                                        ارتقا به پریمیوم
                                    </Link>
                                </Button>

                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="w-full border-2 border-gray-600 text-gray-300 hover:bg-gray-800 h-12"
                                >
                                    فعلاً نه
                                </Button>
                            </div>

                            {/* Motivational Message */}
                            <p className="text-center text-xs text-gray-400 mt-4">
                                💡 شما در حال یادگیری عالی هستید! با پریمیوم، یادگیری خود را انفجاری کنید.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Hook for managing vocabulary limit
export function useVocabularyLimit(maxFreeWords: number = 20) {
    const [showLimitModal, setShowLimitModal] = React.useState(false)
    const [currentCount, setCurrentCount] = React.useState(0)

    const checkLimit = (count: number) => {
        setCurrentCount(count)
        if (count >= maxFreeWords) {
            setShowLimitModal(true)
            return false // Cannot add more
        }
        return true // Can add more
    }

    const closeLimitModal = () => {
        setShowLimitModal(false)
    }

    return {
        showLimitModal,
        currentCount,
        checkLimit,
        closeLimitModal,
        isAtLimit: currentCount >= maxFreeWords,
    }
}

// Add React import
import React from 'react'
