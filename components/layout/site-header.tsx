'use client'

import { useGamificationContext } from '@/components/gamification/gamification-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { BookMarked, BookOpen, Flame, LayoutDashboard, Library, Menu, Settings, Sparkles, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const { level, xp, currentStreak } = useGamificationContext()

  // Calculate XP progress to next level
  const xpForNextLevel = level * 100
  const xpProgress = (xp / xpForNextLevel) * 100

  const navItems = [
    { href: '/', label: 'خانه', icon: BookOpen },
    { href: '/library', label: 'کتابخانه', icon: Library },
    { href: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { href: '/vocabulary', label: 'واژگان', icon: BookMarked },
    { href: '/settings', label: 'تنظیمات', icon: Settings },
  ]

  return (
    <header className="native-header">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-9 h-9 md:w-10 md:h-10 gradient-gold rounded-xl md:rounded-2xl flex items-center justify-center shadow-gold"
            >
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </motion.div>
            <span className="text-gradient-gold hidden sm:inline-block">
              کتاب‌یار
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <motion.div key={item.href} whileTap={{ scale: 0.97 }}>
                  <Link href={item.href} className="relative">
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'relative rounded-xl',
                        isActive && 'gradient-gold text-white shadow-gold'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Gamification Stats - Only show when logged in */}
            {user && (
              <div className="hidden lg:flex items-center gap-2">
                {/* Streak Counter */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-orange-500/20 cursor-pointer"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
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
                    {currentStreak}
                  </span>
                </motion.div>

                {/* XP & Level */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-gold-500/20 cursor-pointer"
                >
                  <Zap className="h-4 w-4 text-gold-600" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-muted-foreground leading-none">
                      سطح {level}
                    </span>
                    <Progress
                      value={xpProgress}
                      className="h-1 w-16 bg-gold-500/20"
                    />
                  </div>
                  <span className="text-xs font-bold text-gold-600">
                    {xp}
                  </span>
                </motion.div>
              </div>
            )}

            <ThemeToggle />

            {!user ? (
              <>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hidden sm:flex rounded-xl border-2 border-gold-600/30 hover:border-gold-600 hover:bg-gold-600/10"
                  >
                    <Link href="/auth/login">ورود</Link>
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    size="sm"
                    asChild
                    className="hidden sm:flex gradient-gold text-white shadow-gold rounded-xl"
                  >
                    <Link href="/auth/signup">
                      <Sparkles className="h-4 w-4 ml-2" />
                      اشتراک ویژه
                    </Link>
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  asChild
                  className="hidden sm:flex gradient-gold text-white shadow-gold rounded-xl"
                >
                  <Link href="/subscription">
                    <Sparkles className="h-4 w-4 ml-2" />
                    ارتقا به پرمیوم
                  </Link>
                </Button>
              </motion.div>
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
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="md:hidden border-t glass"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                        isActive
                          ? 'gradient-gold text-white shadow-gold'
                          : 'hover:bg-muted active:scale-[0.98]'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
              {!user && (
                <motion.div
                  className="pt-4 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    asChild
                    className="w-full rounded-xl border-2 border-gold-600/30 hover:border-gold-600 hover:bg-gold-600/10"
                  >
                    <Link href="/auth/login">ورود</Link>
                  </Button>
                  <Button asChild className="w-full gradient-gold text-white shadow-gold rounded-xl">
                    <Link href="/auth/signup">
                      <Sparkles className="h-4 w-4 ml-2" />
                      اشتراک ویژه
                    </Link>
                  </Button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
