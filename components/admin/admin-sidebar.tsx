'use client'

import { cn } from '@/lib/utils'
import { BarChart, BookOpen, Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarItems = [
    { href: '/admin', label: 'Dashboard', icon: BarChart },
    { href: '/admin/books', label: 'Books', icon: BookOpen },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r bg-muted/50 min-h-screen p-4">
            <div className="mb-8">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-2 rounded-md transition-colors',
                                pathname === item.href
                                    ? 'bg-[#D4AF37] text-white'
                                    : 'hover:bg-muted'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
