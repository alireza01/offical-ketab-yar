import * as React from "react"

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar" | "button" | "book-cover"
  animate?: boolean
  shimmer?: boolean
}

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
        "bg-muted relative overflow-hidden",
        animate && "animate-pulse",
        variants[variant],
        className
      )}
      {...props}
    >
      {shimmer && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  )
}

export { Skeleton }
export type { SkeletonProps }

