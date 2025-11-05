'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

interface ConditionalLayoutProps {
    children: ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()

    // Hide header/footer on reading pages for immersive experience
    const isReadingPage = pathname?.startsWith('/books/read/')

    if (isReadingPage) {
        return <>{children}</>
    }

    return (
        <>
            <SiteHeader />
            <main className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </>
    )
}
