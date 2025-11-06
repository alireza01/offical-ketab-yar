import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import * as React from "react"

export interface NativeInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode
    error?: string
}

const NativeInput = React.forwardRef<HTMLInputElement, NativeInputProps>(
    ({ className, type, icon, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)

        return (
            <div className="relative w-full">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-xl border-2 border-input bg-background px-4 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 focus-visible:border-gold-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 gpu-accelerated",
                        icon && "pl-10",
                        error && "border-destructive focus-visible:ring-destructive/50 focus-visible:border-destructive",
                        isFocused && "scale-[1.01]",
                        className
                    )}
                    ref={ref}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-destructive mt-1.5 mr-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        )
    }
)
NativeInput.displayName = "NativeInput"

export { NativeInput }

