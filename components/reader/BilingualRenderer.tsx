'use client'

import { useLanguageStore } from '@/stores/useLanguageStore'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface BilingualRendererProps {
    paragraph: {
        english: any[] // Portable Text blocks
        farsi: any[] // Portable Text blocks
    }
    index: number
    onVisible?: (index: number) => void
}

export function BilingualRenderer({ paragraph, index, onVisible }: BilingualRendererProps) {
    const { mode } = useLanguageStore()
    const paragraphRef = useRef<HTMLDivElement>(null)
    const hasBeenVisibleRef = useRef(false)

    // Track when paragraph becomes visible (for gamification)
    useEffect(() => {
        if (!paragraphRef.current || hasBeenVisibleRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasBeenVisibleRef.current) {
                        hasBeenVisibleRef.current = true
                        onVisible?.(index)
                    }
                })
            },
            { threshold: 0.5 } // Trigger when 50% visible
        )

        observer.observe(paragraphRef.current)

        return () => observer.disconnect()
    }, [index, onVisible])

    // Portable Text components for styling
    const portableTextComponents = {
        block: {
            normal: ({ children }: any) => (
                <p className="mb-4 leading-relaxed">{children}</p>
            ),
        },
        marks: {
            strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
            em: ({ children }: any) => <em className="italic">{children}</em>,
        },
    }

    return (
        <motion.div
            ref={paragraphRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="paragraph-container mb-6"
        >
            {/* English Only */}
            {mode === 'EN' && (
                <div dir="ltr" className="text-base md:text-lg">
                    <PortableText value={paragraph.english} components={portableTextComponents} />
                </div>
            )}

            {/* Persian Only */}
            {mode === 'FA' && (
                <div dir="rtl" className="text-base md:text-lg font-vazirmatn">
                    <PortableText value={paragraph.farsi} components={portableTextComponents} />
                </div>
            )}

            {/* English Primary + Persian Secondary */}
            {mode === 'EN_FA' && (
                <div className="space-y-3">
                    {/* English - Large */}
                    <div dir="ltr" className="text-base md:text-lg">
                        <PortableText value={paragraph.english} components={portableTextComponents} />
                    </div>
                    {/* Persian - Small */}
                    <div dir="rtl" className="text-sm text-muted-foreground font-vazirmatn border-r-2 border-gold-500/30 pr-4">
                        <PortableText value={paragraph.farsi} components={portableTextComponents} />
                    </div>
                </div>
            )}

            {/* Persian Primary + English Secondary */}
            {mode === 'FA_EN' && (
                <div className="space-y-3">
                    {/* Persian - Large */}
                    <div dir="rtl" className="text-base md:text-lg font-vazirmatn">
                        <PortableText value={paragraph.farsi} components={portableTextComponents} />
                    </div>
                    {/* English - Small */}
                    <div dir="ltr" className="text-sm text-muted-foreground border-l-2 border-gold-500/30 pl-4">
                        <PortableText value={paragraph.english} components={portableTextComponents} />
                    </div>
                </div>
            )}
        </motion.div>
    )
}
