"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check, Crown, Lock, Sparkles } from "lucide-react"
import { Badge } from "./badge"
import { Button } from "./button"

interface PremiumPaywallProps {
    trigger: "vocabulary-limit" | "premium-book" | "advanced-feature" | "book_locked"
    isOpen?: boolean
    currentCount?: number
    limit?: number
    bookTitle?: string
    featureName?: string
    onUpgrade?: () => void
    onClose?: () => void
    className?: string
}

const triggerMessages = {
    "vocabulary-limit": {
        title: "Vocabulary Memory Full!",
        description: "You've reached the free limit of 20 saved words.",
        cta: "Upgrade to save unlimited words and supercharge your learning.",
    },
    "premium-book": {
        title: "Premium Content",
        description: "This book is available for Premium members only.",
        cta: "Unlock thousands of bestsellers with Premium.",
    },
    "book_locked": {
        title: "Premium Content",
        description: "This book is available for Premium members only.",
        cta: "Unlock thousands of bestsellers with Premium.",
    },
    "advanced-feature": {
        title: "Premium Feature",
        description: "This feature is available for Premium members.",
        cta: "Upgrade to unlock all advanced features.",
    },
}

const premiumFeatures = [
    "Unlimited vocabulary storage",
    "Access to all premium books",
    "Advanced AI chat assistant",
    "Offline reading mode",
    "Ad-free experience",
    "Priority support",
]

export function PremiumPaywall({
    trigger,
    isOpen = true,
    currentCount,
    limit,
    bookTitle,
    featureName: _featureName,
    onUpgrade,
    onClose,
    className,
}: PremiumPaywallProps) {
    const message = triggerMessages[trigger]

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",
                className
            )}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-lg w-full bg-gradient-to-br from-gold-50 via-white to-gold-50 dark:from-gold-950 dark:via-gray-900 dark:to-gold-950 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Crown */}
                <div className="relative bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 p-8 text-center">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mb-4"
                    >
                        <Crown className="w-16 h-16 text-white drop-shadow-lg" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">{message.title}</h2>
                    <p className="text-gold-100">{message.description}</p>

                    {/* Progress indicator for vocabulary limit */}
                    {trigger === "vocabulary-limit" && currentCount && limit && (
                        <div className="mt-4 bg-white/20 rounded-full p-1">
                            <div className="flex items-center justify-between text-sm text-white px-3 py-1">
                                <span>{currentCount} / {limit} words</span>
                                <Badge variant="gold" className="bg-white/30">
                                    Free Limit
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Book title for premium book */}
                    {trigger === "premium-book" && bookTitle && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-white">
                            <Lock className="w-4 h-4" />
                            <span className="font-semibold">{bookTitle}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gold-900 dark:text-gold-100 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gold-600" />
                            Premium Benefits
                        </h3>
                        <ul className="space-y-3">
                            {premiumFeatures.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span>{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gold-100 dark:bg-gold-900/30 rounded-xl p-4 mb-6">
                        <p className="text-center text-gold-900 dark:text-gold-100 font-semibold">
                            {message.cta}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        {onUpgrade && (
                            <Button
                                variant="premium"
                                size="lg"
                                onClick={onUpgrade}
                                className="w-full"
                            >
                                <Crown className="w-5 h-5 mr-2" />
                                Upgrade to Premium
                            </Button>
                        )}
                        {onClose && (
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={onClose}
                                className="w-full"
                            >
                                Maybe Later
                            </Button>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Cancel anytime • 7-day money-back guarantee
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

interface UpgradePromptProps {
    message: string
    onUpgrade?: () => void
    compact?: boolean
    className?: string
}

export function UpgradePrompt({
    message,
    onUpgrade,
    compact = false,
    className,
}: UpgradePromptProps) {
    if (compact) {
        return (
            <div className={cn(
                "flex items-center justify-between gap-4 bg-gradient-to-r from-gold-100 to-gold-200 dark:from-gold-900 dark:to-gold-800 p-4 rounded-lg border border-gold-300 dark:border-gold-700",
                className
            )}>
                <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                    <p className="text-sm font-medium text-gold-900 dark:text-gold-100">
                        {message}
                    </p>
                </div>
                {onUpgrade && (
                    <Button variant="gold" size="sm" onClick={onUpgrade}>
                        Upgrade
                    </Button>
                )}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-950 dark:to-gold-900 p-6 rounded-xl border-2 border-gold-300 dark:border-gold-700 shadow-lg",
                className
            )}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gold-900 dark:text-gold-100 mb-2">
                        Upgrade to Premium
                    </h3>
                    <p className="text-gold-700 dark:text-gold-300 mb-4">{message}</p>
                    {onUpgrade && (
                        <Button variant="premium" onClick={onUpgrade}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Unlock Premium
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
