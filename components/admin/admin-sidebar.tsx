'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  ExternalLink,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    title: 'داشبورد',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'کاربران',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'تحلیل‌ها',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'کلیدهای AI',
    href: '/admin/ai-keys',
    icon: Settings,
  },
  {
    title: 'CMS (کتاب‌ها و بلاگ)',
    href: '/Studio',
    icon: BookOpen,
    external: true,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-l bg-card flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-br from-gold-600 to-gold-400 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/30"
          >
            <BookOpen className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <span className="block text-lg font-bold bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
              کتاب‌یار
            </span>
            <span className="block text-xs text-muted-foreground">پنل مدیریت</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium flex-1">{item.title}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-lg shadow-gold-500/20'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 transition-transform group-hover:scale-110',
                isActive && 'text-white'
              )} />
              <span className="font-medium">{item.title}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          asChild
        >
          <Link href="/">
            <Home className="h-4 w-4 ml-2" />
            بازگشت به سایت
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-4 w-4 ml-2" />
          خروج
        </Button>
      </div>
    </aside>
  )
}
