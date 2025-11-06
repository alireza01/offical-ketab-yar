"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Award, Crown, Star, Trophy, Zap } from "lucide-react"

interface AchievementBadgeProps {
    title: string
    description?: string
    icon?: "award" | "trophy" | "star" | "crown" | "zap"
    variant?: "bronze" | "silver" | "gold" | "platinum"
    unlocked?: boolean
    size?: "sm" | "md" | "lg"
    showAnimation?: boolean
    className?: string
}

const icons = {
    award: Award,
    trophy: Trophy,
    star: Star,
    crown: Crown,
    zap: Zap,
}

const variantStyles = {
    bronze: "from-amber-700 to-amber-900 text-amber-100",
    silver: "from-gray-400 to-gray-600 text-gray-100",
    gold: "from-gold-400 via-gold-500 to-gold-600 text-white",
    platinum: "from-purple-400 via-purple-500 to-purple-600 text-white",
}

export function AchievementBadge({
    title,
    description,
    icon = "award",
    variant = "gold",
    unlocked = true,
    size = "md",
    showAnimation = false,
    className,
}: AchievementBadgeProps) {
    const Icon = icons[icon]

    const sizes = {
        sm: { container: "p-3", icon: "w-6 h-6", title: "text-sm", desc: "text-xs" },
        md: { container: "p-4", icon: "w-8 h-8", title: "text-base", desc: "text-sm" },
        lg: { container: "p-6", icon: "w-12 h-12", title: "text-lg", desc: "text-base" },
    }

    return (
        <motion.div
            initial={showAnimation ? { scale: 0, rotate: -180, opacity: 0 } : false}
            animate={showAnimation ? { scale: 1, rotate: 0, opacity: 1 } : false}
            transition={{ type: "spring", duration: 0.8 }}
            className={cn(
                "relative rounded-xl shadow-lg overflow-hidden",
                unlocked
                    ? `bg-gradient-to-br ${variantStyles[variant]}`
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400",
                sizes[size].container,
                className
            )}
        >
            {unlocked && showAnimation && (
                <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            )}

            <div className="relative flex flex-col items-center text-center gap-2">
                <motion.div
                    animate={unlocked && showAnimation ? {
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: showAnimation ? Infinity : 0 }}
                >
                    <Icon className={cn(sizes[size].icon, unlocked ? "" : "opacity-50")} />
                </motion.div>

                <div>
                    <h3 className={cn("font-bold", sizes[size].title)}>{title}</h3>
                    {description && (
                        <p className={cn("opacity-90", sizes[size].desc)}>{description}</p>
                    )}
                </div>

                {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <span className="text-white font-semibold">🔒 Locked</span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

interface AchievementUnlockProps {
    title: string
    description: string
    icon?: "award" | "trophy" | "star" | "crown" | "zap"
    variant?: "bronze" | "silver" | "gold" | "platinum"
    onClose?: () => void
}

export function AchievementUnlock({
    title,
    description,
    icon = "trophy",
    variant = "gold",
    onClose,
}: AchievementUnlockProps) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-950 dark:to-gold-900 p-8 rounded-2xl text-center shadow-2xl">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="mb-6"
                    >
                        <AchievementBadge
                            title={title}
                            description={description}
                            icon={icon}
                            variant={variant}
                            size="lg"
                            showAnimation={true}
                        />
                    </motion.div>

                    <h2 className="text-3xl font-bold mb-2 text-gold-900 dark:text-gold-100">
                        Achievement Unlocked!
                    </h2>
                    <p className="text-gold-700 dark:text-gold-300 mb-6">
                        You've earned a new badge!
                    </p>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-full font-semibold hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-lg"
                        >
                            Awesome!
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
