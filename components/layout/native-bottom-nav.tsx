'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BookMarked, Home, LayoutDashboard, Library, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { href: '/', label: 'خانه', icon: Home },
    { href: '/library', label: 'کتابخانه', icon: Library },
    { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { href: '/vocabulary', label: 'واژگان', icon: BookMarked },
    { href: '/settings', label: 'تنظیمات', icon: Settings },
]

export function NativeBottomNav() {
    const pathname = usePathname()

    return (
        <nav className="bottom-nav md:hidden">
            <div className="flex items-center justify-around px-1 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="tab-item relative active:scale-[0.85] transition-transform"
                        >
                            <div className="relative flex flex-col items-center gap-1">
                                <div className="relative">
                                    <Icon
                                        className={cn(
                                            "h-6 w-6 transition-all duration-200",
                                            isActive ? "text-gold-600" : "text-muted-foreground"
                                        )}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "text-[10px] font-medium transition-all duration-200",
                                        isActive ? "text-gold-600 scale-105" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </span>
                                {/* Dot indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavActiveDot"
                                        className="absolute -bottom-1 w-1 h-1 bg-gold-600 rounded-full"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
