"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface UserAvatarProps {
    userId: string
    avatarUrl?: string | null
    fullName?: string | null
    size?: 'sm' | 'md' | 'lg' | 'xl'
    editable?: boolean
    className?: string
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
}

export function UserAvatar({
    avatarUrl,
    fullName,
    size = 'md',
    className
}: UserAvatarProps) {
    const initials = fullName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?'

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
            <AvatarImage src={avatarUrl || undefined} alt={fullName || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8956A]/20 text-[#D4AF37] font-bold">
                {avatarUrl ? <User className="w-1/2 h-1/2" /> : initials}
            </AvatarFallback>
        </Avatar>
    )
}
