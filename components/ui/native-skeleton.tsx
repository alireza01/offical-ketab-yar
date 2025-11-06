import { cn } from "@/lib/utils"

interface NativeSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'text' | 'circular' | 'rectangular'
}

function NativeSkeleton({
    className,
    variant = 'default',
    ...props
}: NativeSkeletonProps) {
    const variants = {
        default: 'rounded-xl',
        text: 'rounded-md h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    }

    return (
        <div
            className={cn(
                "skeleton bg-muted",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

// Preset skeleton components for common use cases
function NativeSkeletonCard() {
    return (
        <div className="native-card p-6 space-y-4">
            <div className="flex items-center gap-4">
                <NativeSkeleton variant="circular" className="h-12 w-12" />
                <div className="flex-1 space-y-2">
                    <NativeSkeleton variant="text" className="w-3/4" />
                    <NativeSkeleton variant="text" className="w-1/2" />
                </div>
            </div>
            <NativeSkeleton variant="rectangular" className="h-40 w-full" />
            <div className="space-y-2">
                <NativeSkeleton variant="text" className="w-full" />
                <NativeSkeleton variant="text" className="w-5/6" />
                <NativeSkeleton variant="text" className="w-4/6" />
            </div>
        </div>
    )
}

function NativeSkeletonBookCard() {
    return (
        <div className="space-y-3">
            <NativeSkeleton variant="rectangular" className="aspect-[2/3] w-full" />
            <NativeSkeleton variant="text" className="w-full" />
            <NativeSkeleton variant="text" className="w-3/4" />
            <div className="flex items-center gap-2">
                <NativeSkeleton variant="text" className="w-16" />
                <NativeSkeleton variant="text" className="w-20" />
            </div>
        </div>
    )
}

function NativeSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 native-card">
                    <NativeSkeleton variant="circular" className="h-10 w-10" />
                    <div className="flex-1 space-y-2">
                        <NativeSkeleton variant="text" className="w-3/4" />
                        <NativeSkeleton variant="text" className="w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export {
    NativeSkeleton, NativeSkeletonBookCard, NativeSkeletonCard, NativeSkeletonList
}

