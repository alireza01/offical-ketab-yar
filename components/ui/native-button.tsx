import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import * as React from "react"

const nativeButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gpu-accelerated touch-action-manipulation",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg active:shadow-sm",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg active:shadow-sm",
                outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/30 active:bg-accent/80",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm active:shadow-none",
                ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
                link: "text-primary underline-offset-4 hover:underline",
                gold: "bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 shadow-lg hover:shadow-xl shadow-gold-500/30 active:shadow-md",
                premium: "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-white hover:from-gold-500 hover:via-gold-600 hover:to-gold-700 shadow-xl hover:shadow-2xl shadow-gold-500/40 font-semibold active:shadow-lg",
                glass: "frosted-glass border border-white/20 hover:bg-white/10 active:bg-white/5",
            },
            size: {
                default: "h-11 px-5 py-2.5",
                sm: "h-9 rounded-lg px-3.5 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-14 rounded-2xl px-10 text-lg",
                icon: "h-11 w-11",
            },
            haptic: {
                light: "",
                medium: "",
                heavy: "",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            haptic: "medium",
        },
    }
)

export interface NativeButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof nativeButtonVariants> {
    asChild?: boolean
    loading?: boolean
}

const NativeButton = React.forwardRef<HTMLButtonElement, NativeButtonProps>(
    ({ className, variant, size, haptic, asChild = false, loading, children, onClick, ...props }, ref) => {
        if (asChild) {
            return (
                <Slot
                    className={cn(nativeButtonVariants({ variant, size, haptic, className }))}
                    ref={ref}
                    onClick={onClick}
                    {...props}
                >
                    {children}
                </Slot>
            )
        }

        return (
            <motion.button
                className={cn(nativeButtonVariants({ variant, size, haptic, className }))}
                ref={ref}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                disabled={loading || props.disabled}
                onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
                type={props.type}
                aria-label={props['aria-label']}
                aria-disabled={props['aria-disabled']}
                aria-pressed={props['aria-pressed']}
                id={props.id}
                name={props.name}
                value={props.value}
                form={props.form}
                formAction={props.formAction}
                formEncType={props.formEncType}
                formMethod={props.formMethod}
                formNoValidate={props.formNoValidate}
                formTarget={props.formTarget}
                autoFocus={props.autoFocus}
                tabIndex={props.tabIndex}
            >
                {loading ? (
                    <>
                        <div className="spinner h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        <span className="opacity-70">در حال بارگذاری...</span>
                    </>
                ) : (
                    children
                )}
            </motion.button>
        )
    }
)
NativeButton.displayName = "NativeButton"

export { NativeButton, nativeButtonVariants }

