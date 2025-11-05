'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { BookMarked, BookOpen, Flame, LayoutDashboard, Library, Menu, Settings, Sparkles, Trophy, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // TODO: Replace with actual user data from auth context
  const userStats = {
    streak: 7,
    xp: 450,
    level: 5,
    xpToNextLevel: 500,
    isLoggedIn: false, // Change to true when user is logged in
  }

  const xpProgress = (userStats.xp / userStats.xpToNextLevel) * 100

  const navItems = [
    { href: '/', label: 'خانه', icon: BookOpen },
    { href: '/library', label: 'کتابخانه', icon: Library },
    { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { href: '/vocabulary', label: 'واژگان', icon: BookMarked },
    { href: '/review', label: 'مرور', icon: Trophy },
    { href: '/settings', label: 'تنظیمات', icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-br from-gold-600 to-gold-400 rounded-lg flex items-center justify-center shadow-lg shadow-gold-500/30"
            >
              <BookOpen className="h-5 w-5 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent group-hover:from-gold-500 group-hover:to-gold-300 transition-all">
              کتاب‌یار
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                  className={cn(
                    'relative',
                    isActive && 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600'
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </Button>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Gamification Stats - Only show when logged in */}
            {userStats.isLoggedIn && (
              <div className="hidden lg:flex items-center gap-3">
                {/* Streak Counter */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Flame className="h-4 w-4 text-orange-500" />
                  </motion.div>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {userStats.streak}
                  </span>
                </motion.div>

                {/* XP & Level */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20"
                >
                  <Zap className="h-4 w-4 text-gold-600" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        سطح {userStats.level}
                      </span>
                    </div>
                    <Progress
                      value={xpProgress}
                      className="h-1 w-16 bg-gold-500/20"
                    />
                  </div>
                  <span className="text-xs font-bold text-gold-600">
                    {userStats.xp}
                  </span>
                </motion.div>
              </div>
            )}

            <ThemeToggle />

            {!userStats.isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  ورود
                </Button>
                <Button
                  size="sm"
                  className="hidden sm:flex bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 shadow-lg shadow-gold-500/30"
                >
                  <Sparkles className="h-4 w-4 ml-2" />
                  اشتراک ویژه
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="hidden sm:flex bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 shadow-lg shadow-gold-500/30"
              >
                <Sparkles className="h-4 w-4 ml-2" />
                ارتقا به پرمیوم
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white'
                        : 'hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  ورود
                </Button>
                <Button className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600">
                  <Sparkles className="h-4 w-4 ml-2" />
                  اشتراک ویژه
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
