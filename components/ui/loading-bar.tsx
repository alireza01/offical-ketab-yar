"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LoadingBarProps {
    variant?: "default" | "gold"
    className?: string
}

export function LoadingBar({ variant = "default", className }: LoadingBarProps) {
    const variants = {
        default: "bg-primary",
        gold: "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600",
    }

    return (
        <div className={cn("fixed top-0 left-0 right-0 h-1 bg-muted z-50", className)}>
            <motion.div
                className={cn("h-full", variants[variant])}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
        </div>
    )
}

interface SpinnerProps {
    size?: "sm" | "md" | "lg"
    variant?: "default" | "gold"
    className?: string
}

export function Spinner({ size = "md", variant = "default", className }: SpinnerProps) {
    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    }

    const variants = {
        default: "border-primary border-t-transparent",
        gold: "border-gold-500 border-t-transparent",
    }

    return (
        <motion.div
            className={cn(
                "rounded-full",
                sizes[size],
                variants[variant],
                className
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    )
}
