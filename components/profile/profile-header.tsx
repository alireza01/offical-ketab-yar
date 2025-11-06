'use client'

import { LevelBadge } from '@/components/gamification/level-badge'
import { StreakFlame } from '@/components/gamification/streak-flame'
import { XPDisplay } from '@/components/gamification/xp-display'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Calendar, Mail } from 'lucide-react'
import ProfileCompletion from './profile-completion'

interface ProfileHeaderProps {
    user: User
    profile: {
        username?: string
        full_name?: string
        avatar_url?: string
        bio?: string
        website?: string
        level?: string
        created_at: string
    }
    userStats: {
        xp: number
        level: number
        current_streak: number
        longest_streak: number
    }
}

export function ProfileHeader({ user, profile, userStats }: ProfileHeaderProps) {
    // Calculate profile completion
    const calculateCompletion = () => {
        const fields = [
            profile.username,
            profile.full_name,
            profile.avatar_url,
            profile.bio,
            profile.website,
            profile.level,
        ]
        const completed = fields.filter(Boolean).length
        return Math.round((completed / fields.length) * 100)
    }

    const completionPercentage = calculateCompletion()
    const isInDanger = userStats.current_streak > 0 && !isReadToday()

    function isReadToday() {
        // TODO: Check if user read today
        return true
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <Avatar className="size-24 border-4 border-gold/20">
                                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
                                    <AvatarFallback className="bg-gold/10 text-gold text-2xl">
                                        {profile.full_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Level Badge Overlay */}
                                <div className="absolute -bottom-2 -right-2">
                                    <LevelBadge level={userStats.level} size="sm" showLabel={false} />
                                </div>
                            </motion.div>

                            {/* Streak Display */}
                            <StreakFlame
                                days={userStats.current_streak}
                                isInDanger={isInDanger}
                            />
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 space-y-4">
                            {/* Name & Username */}
                            <div>
                                <h1 className="text-3xl font-bold mb-1">
                                    {profile.full_name || profile.username || 'کاربر'}
                                </h1>
                                {profile.username && (
                                    <p className="text-muted-foreground">@{profile.username}</p>
                                )}
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-muted-foreground">{profile.bio}</p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {user.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="size-4" />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    <span>
                                        عضو از {new Date(profile.created_at).toLocaleDateString('fa-IR')}
                                    </span>
                                </div>
                                {profile.level && (
                                    <Badge variant="outline" className="text-xs">
                                        {profile.level === 'beginner' && 'مبتدی'}
                                        {profile.level === 'intermediate' && 'متوسط'}
                                        {profile.level === 'advanced' && 'پیشرفته'}
                                    </Badge>
                                )}
                            </div>

                            {/* XP Display */}
                            <XPDisplay
                                currentXP={userStats.xp}
                                level={userStats.level}
                                className="max-w-md"
                            />

                            {/* Profile Completion */}
                            {completionPercentage < 100 && (
                                <ProfileCompletion
                                    percentage={completionPercentage}
                                    profile={profile}
                                />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
