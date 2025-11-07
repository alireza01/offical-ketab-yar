'use client'

import { useGamificationContext } from '@/components/gamification/gamification-provider'
import { SyncIndicator } from '@/components/sync/sync-indicator'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { useSupabaseAuth } from '@/hooks/use-supabase-auth'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { BookMarked, BookOpen, Flame, Home, LayoutDashboard, Library, LogOut, Settings, Sparkles, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useSupabaseAuth()
  const { level, xp, currentStreak } = useGamificationContext()
  const [libraryHover, setLibraryHover] = useState(false)

  const xpForNextLevel = level * 100
  const xpProgress = (xp / xpForNextLevel) * 100

  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Mock genres - replace with actual Sanity query later
  const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery',
    'Romance', 'Biography', 'Self-Help', 'History',
    'Fantasy', 'Thriller', 'Horror', 'Poetry'
  ]

  return (
    <header className="native-header sticky top-0 z-50 border-b">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl md:text-2xl group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-12 h-12 md:w-14 md:h-14 gradient-gold rounded-2xl flex items-center justify-center shadow-gold"
            >
              <BookOpen className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </motion.div>
            <span className="text-gradient-gold hidden sm:inline-block text-2xl">
              کتاب‌یار
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button
                variant={pathname === '/' ? 'default' : 'ghost'}
                size="lg"
                className={cn(
                  'rounded-xl font-semibold text-base h-12 px-5',
                  pathname === '/' && 'gradient-gold text-white shadow-gold'
                )}
              >
                <Home className="h-5 w-5 ml-2" />
                خانه
              </Button>
            </Link>

            {/* Library with Hover Menu */}
            <div
              className="relative"
              onMouseEnter={() => setLibraryHover(true)}
              onMouseLeave={() => setLibraryHover(false)}
            >
              <Link href="/library">
                <Button
                  variant={pathname.startsWith('/library') ? 'default' : 'ghost'}
                  size="lg"
                  className={cn(
                    'rounded-xl font-semibold text-base h-12 px-5',
                    pathname.startsWith('/library') && 'gradient-gold text-white shadow-gold'
                  )}
                >
                  <Library className="h-5 w-5 ml-2" />
                  کتابخانه
                </Button>
              </Link>

              {/* Hover Dropdown */}
              <AnimatePresence>
                {libraryHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-popover border rounded-xl shadow-xl p-4"
                  >
                    <div className="mb-3">
                      <Link href="/library">
                        <Button variant="ghost" className="w-full justify-start font-semibold text-base h-10">
                          <Library className="h-5 w-5 ml-2" />
                          همه کتاب‌ها
                        </Button>
                      </Link>
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 px-3">دسته‌بندی‌ها</p>
                      <div className="grid grid-cols-2 gap-1">
                        {genres.map((genre) => (
                          <Link key={genre} href={`/library?genre=${genre.toLowerCase()}`}>
                            <Button variant="ghost" className="w-full justify-start text-sm h-9">
                              {genre}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/dashboard">
              <Button
                variant={pathname === '/dashboard' ? 'default' : 'ghost'}
                size="lg"
                className={cn(
                  'rounded-xl font-semibold text-base h-12 px-5',
                  pathname === '/dashboard' && 'gradient-gold text-white shadow-gold'
                )}
              >
                <LayoutDashboard className="h-5 w-5 ml-2" />
                داشبورد
              </Button>
            </Link>

            <Link href="/vocabulary">
              <Button
                variant={pathname === '/vocabulary' ? 'default' : 'ghost'}
                size="lg"
                className={cn(
                  'rounded-xl font-semibold text-base h-12 px-5',
                  pathname === '/vocabulary' && 'gradient-gold text-white shadow-gold'
                )}
              >
                <BookMarked className="h-5 w-5 ml-2" />
                واژگان
              </Button>
            </Link>

            <Link href="/settings">
              <Button
                variant={pathname === '/settings' ? 'default' : 'ghost'}
                size="lg"
                className={cn(
                  'rounded-xl font-semibold text-base h-12 px-5',
                  pathname === '/settings' && 'gradient-gold text-white shadow-gold'
                )}
              >
                <Settings className="h-5 w-5 ml-2" />
                تنظیمات
              </Button>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <SyncIndicator />

            {user ? (
              <>
                {/* Gamification Stats */}
                <div className="hidden lg:flex items-center gap-2">
                  {/* Streak */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-orange-500/20 cursor-pointer"
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
                      <Flame className="h-5 w-5 text-orange-500" />
                    </motion.div>
                    <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                      {currentStreak}
                    </span>
                  </motion.div>

                  {/* XP & Level */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-gold-500/20 cursor-pointer"
                  >
                    <Zap className="h-5 w-5 text-gold-600" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground leading-none">
                        سطح {level}
                      </span>
                      <Progress
                        value={xpProgress}
                        className="h-1.5 w-20 bg-gold-500/20"
                      />
                    </div>
                    <span className="text-base font-bold text-gold-600">
                      {xp}
                    </span>
                  </motion.div>
                </div>

                <ThemeToggle />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                      <Avatar className="h-12 w-12 border-2 border-gold-500/30">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-gold-600 to-gold-400 text-white font-bold text-lg">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-gold-600 to-gold-400 text-white font-bold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold">{user.user_metadata?.name || 'کاربر'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="ml-2 h-4 w-4" />
                        پروفایل
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="ml-2 h-4 w-4" />
                        تنظیمات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="ml-2 h-4 w-4" />
                      خروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button
                  size="lg"
                  asChild
                  className="gradient-gold text-white shadow-gold rounded-xl font-bold text-base px-8 h-12"
                >
                  <Link href="/auth/signup">
                    <Sparkles className="h-5 w-5 ml-2" />
                    ثبت‌نام رایگان
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
