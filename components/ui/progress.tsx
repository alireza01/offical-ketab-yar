"use client"

import * as React from "react"

import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "gold" | "success" | "warning"
  showValue?: boolean
  animated?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = "default", showValue = false, animated = true, ...props }, ref) => {
  const variants = {
    default: "bg-primary",
    gold: "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600",
    success: "bg-gradient-to-r from-green-400 to-green-600",
    warning: "bg-gradient-to-r from-yellow-400 to-orange-500",
  }

  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "bg-secondary relative h-4 w-full overflow-hidden rounded-full",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "size-full flex-1 will-change-transform",
            animated ? "transition-all duration-500 ease-out" : "transition-none",
            variants[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground px-2">
          {Math.round(value || 0)}%
        </span>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

