import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import * as React from "react"

interface NativeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "gold" | "premium" | "interactive" | "glass"
    hover?: boolean
    pressable?: boolean
}

const NativeCard = React.forwardRef<HTMLDivElement, NativeCardProps>(
    ({ className, variant = "default", hover = false, pressable = false, children, ...props }, ref) => {
        const variants = {
            default: "native-card",
            gold: "native-card bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-950 dark:to-gold-900 border-gold-200 dark:border-gold-800",
            premium: "native-card bg-gradient-to-br from-gold-100 via-gold-50 to-white dark:from-gold-900 dark:via-gold-950 dark:to-background border-gold-300 dark:border-gold-700 shadow-lg",
            interactive: "native-card cursor-pointer",
            glass: "frosted-glass rounded-xl border border-white/20",
        }

        if (pressable) {
            const { onClick, role, tabIndex, ...restProps } = props
            return (
                <motion.div
                    ref={ref}
                    className={cn(
                        variants[variant],
                        hover && "hover:shadow-md hover:scale-[1.02] transition-all duration-200",
                        className
                    )}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={onClick}
                    role={role}
                    tabIndex={tabIndex}
                    aria-label={restProps["aria-label"]}
                >
                    {children}
                </motion.div>
            )
        }

        return (
            <div
                ref={ref}
                className={cn(
                    variants[variant],
                    hover && "hover:shadow-md hover:scale-[1.02] transition-all duration-200",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
NativeCard.displayName = "NativeCard"

const NativeCardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
NativeCardHeader.displayName = "NativeCardHeader"

const NativeCardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
NativeCardTitle.displayName = "NativeCardTitle"

const NativeCardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
NativeCardDescription.displayName = "NativeCardDescription"

const NativeCardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
NativeCardContent.displayName = "NativeCardContent"

const NativeCardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
NativeCardFooter.displayName = "NativeCardFooter"

export {
    NativeCard, NativeCardContent, NativeCardDescription, NativeCardFooter, NativeCardHeader, NativeCardTitle
}

