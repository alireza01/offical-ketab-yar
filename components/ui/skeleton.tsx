import * as React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar" | "button" | "book-cover"
  animate?: boolean
  shimmer?: boolean
}

/**
 * Skeleton Component - Visible in both light and dark themes
 * Agent 2 (Performance): GPU-accelerated animations
 * Agent 3 (Psychology): Premium loading feel
 */
function Skeleton({
  className,
  variant = "default",
  animate = true,
  shimmer = true,
  ...props
}: SkeletonProps) {
  const variants = {
    default: "h-4 w-full",
    card: "h-[200px] w-full rounded-xl",
    text: "h-4 w-[250px]",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-[100px] rounded-md",
    "book-cover": "h-[300px] w-[200px] rounded-lg",
  }

  return (
    <div
      className={cn(
        // Enhanced visibility for BOTH light and dark themes
        "relative overflow-hidden rounded-md",
        "bg-gray-200/80 dark:bg-gray-800/80",
        "border border-gray-300/30 dark:border-gray-700/30",
        animate && "animate-pulse",
        variants[variant],
        className
      )}
      {...props}
    >
      {shimmer && (
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent"
          style={{
            animation: "shimmer 2s infinite linear",
          }}
        />
      )}
    </div>
  )
}

export { Skeleton }
export type { SkeletonProps }

