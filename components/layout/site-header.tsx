'use client'

import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-[#D4AF37]" />
                    <span className="font-bold text-xl">Ketab-Yar</span>
                </Link>
                <nav className="flex items-center space-x-6 ml-6">
                    <Link href="/library" className="text-sm font-medium transition-colors hover:text-[#D4AF37]">
                        Library
                    </Link>
                    <Link href="/about" className="text-sm font-medium transition-colors hover:text-[#D4AF37]">
                        About
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    <Link href="/auth/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button className="bg-[#D4AF37] hover:bg-[#C9A961]">Get Started</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
