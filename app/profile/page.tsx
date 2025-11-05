"use client"

import { motion } from 'framer-motion'
import { Calendar, Edit, Flame, Mail, Sparkles, Trophy } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

import { StreakFlame } from '@/components/dashboard/streak-flame'
import { XPProgress } from '@/components/dashboard/xp-progress'
import { ProfileStats } from '@/components/profile/profile-stats'
import { ReadingHistory } from '@/components/profile/reading-history'
import { UserAvatar } from '@/components/profile/user-avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGamification } from '@/hooks/use-gamification'
import { createBrowserClient } from '@/lib/supabase/client'
import { getUserProfile, type UserProfile } from '@/lib/supabase/queries/user'

import { calculateLevel } from '@/types/gamification'

/**
 * Profile Page (Pure CSR)
 * User profile with stats, gamification, and reading history
 * Implements:
 * - Agent 1: CSR for private zone (no SEO)
 * - Agent 2: Zero server load, client-side data fetching
 * - Agent 3: Personalization, gamification, native app feel
 */

export default function ProfilePage() {
  const supabase = createBrowserClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          redirect('/auth/login')
          return
        }

        const userProfile = await getUserProfile(user.id)
        if (userProfile) {
          setProfile(userProfile)
        }
      } catch {
        // Error handled by error boundary
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [supabase])

  const { gamificationData, isLoading: isGamificationLoading } = useGamification(profile?.id)

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return null
  }

  const levelInfo = calculateLevel(profile.xp)
  const memberSince = new Date(profile.created_at).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="border-[#D4AF37]/20 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#B8956A]/10" />

          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="relative">
                <UserAvatar
                  userId={profile.id}
                  avatarUrl={profile.avatar_url}
                  fullName={profile.full_name}
                  size="xl"
                  editable={true}
                />
                {/* Level Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute -bottom-2 -right-2"
                >
                  <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#B8956A] text-white px-3 py-1 text-sm font-bold shadow-lg">
                    <Trophy className="w-4 h-4 mr-1" />
                    سطح {levelInfo.current}
                  </Badge>
                </motion.div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2">
                    {profile.full_name || profile.name || 'کاربر'}
                    {profile.subscription_tier === 'premium' && (
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    )}
                  </h1>
                  {profile.username && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    عضو از {memberSince}
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#D4AF37]" />
                    {levelInfo.title}
                  </div>
                </div>

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:underline text-sm"
                  >
                    {profile.website}
                  </a>
                )}
              </div>

              {/* Edit Button */}
              <Button asChild className="bg-gradient-to-r from-[#D4AF37] to-[#B8956A] hover:from-[#C9A961] hover:to-[#A67C52]">
                <Link href="/profile/edit">
                  <Edit className="w-4 h-4 mr-2" />
                  ویرایش پروفایل
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gamification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XP Progress */}
        <Card className="lg:col-span-2 border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
              پیشرفت شما
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGamificationLoading ? (
              <Skeleton className="h-40" />
            ) : gamificationData ? (
              <XPProgress gamification={gamificationData} />
            ) : null}
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              استریک روزانه
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            {isGamificationLoading ? (
              <Skeleton className="h-40 w-40 rounded-full" />
            ) : (
              <StreakFlame streak={gamificationData?.current_streak || 0} />
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Tabs Section */}
      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="stats">آمار و ارقام</TabsTrigger>
          <TabsTrigger value="history">تاریخچه مطالعه</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <ProfileStats userId={profile.id} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ReadingHistory userId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-96" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-64" />
        <Skeleton className="h-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}
