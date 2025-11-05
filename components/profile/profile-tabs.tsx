'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, History, Settings, Trophy } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { ProfileStats } from './profile-stats'

// Agent 2: Dynamic imports for heavy components
const ReadingHistory = dynamic(() => import('./reading-history').then(mod => ({ default: mod.ReadingHistory })), {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false,
})

const ProfileAchievements = dynamic<{ userId: string; userStats: any }>(() => import('./profile-achievements'), {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false,
})

const ProfileSettings = dynamic<{ user: any; profile: any }>(() => import('./profile-settings'), {
    loading: () => <Skeleton className="h-96 w-full" />,
    ssr: false,
})

interface ProfileTabsProps {
    user: any
    profile: any
    userStats: any
}

export function ProfileTabs({ user, profile, userStats }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                <TabsTrigger value="overview" className="gap-2">
                    <BookOpen className="size-4" />
                    <span className="hidden sm:inline">خلاصه</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                    <History className="size-4" />
                    <span className="hidden sm:inline">تاریخچه</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-2">
                    <Trophy className="size-4" />
                    <span className="hidden sm:inline">دستاوردها</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2" data-tab="settings">
                    <Settings className="size-4" />
                    <span className="hidden sm:inline">تنظیمات</span>
                </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
                <ProfileStats userStats={userStats} />

                {/* Recent Activity Preview */}
                <div>
                    <h2 className="text-xl font-bold mb-4">آخرین فعالیت‌ها</h2>
                    <ReadingHistory userId={user.id} limit={3} preview />
                </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="mt-6">
                <ReadingHistory userId={user.id} />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="mt-6">
                <ProfileAchievements userId={user.id} userStats={userStats} />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
                <ProfileSettings user={user} profile={profile} />
            </TabsContent>
        </Tabs>
    )
}
