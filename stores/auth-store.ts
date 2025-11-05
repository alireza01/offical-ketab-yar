/**
 * Auth Store - Centralized Authentication State
 * Eliminates repeated supabase.auth.getUser() calls across components
 * Implements Agent 2's performance strategy (cache user data client-side)
 */

import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    subscription_tier: 'free' | 'premium'
    subscription_expires_at: string | null
    xp: number
    current_streak: number
    last_read_at: string | null
    created_at: string
}

interface AuthState {
    // State
    user: User | null
    profile: UserProfile | null
    isLoading: boolean
    isInitialized: boolean
    error: string | null

    // Actions
    initialize: () => Promise<void>
    setUser: (user: User | null) => void
    setProfile: (profile: UserProfile | null) => void
    updateProfile: (updates: Partial<UserProfile>) => void
    signOut: () => Promise<void>
    reset: () => void
}

const initialState = {
    user: null,
    profile: null,
    isLoading: false,
    isInitialized: false,
    error: null,
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            ...initialState,

            initialize: async () => {
                if (get().isInitialized) return

                set({ isLoading: true, error: null })

                try {
                    const supabase = createClient()

                    // Get current user
                    const { data: { user }, error: userError } = await supabase.auth.getUser()

                    if (userError) throw userError

                    if (!user) {
                        set({
                            user: null,
                            profile: null,
                            isLoading: false,
                            isInitialized: true
                        })
                        return
                    }

                    // Get user profile
                    const { data: profile, error: profileError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    if (profileError) throw profileError

                    set({
                        user,
                        profile: profile as UserProfile,
                        isLoading: false,
                        isInitialized: true,
                        error: null,
                    })

                    // Set up auth state change listener
                    supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_OUT') {
                            get().reset()
                        } else if (event === 'SIGNED_IN' && session?.user) {
                            get().setUser(session.user)

                            // Fetch fresh profile
                            const { data: freshProfile } = await supabase
                                .from('users')
                                .select('*')
                                .eq('id', session.user.id)
                                .single()

                            if (freshProfile) {
                                get().setProfile(freshProfile as UserProfile)
                            }
                        }
                    })
                } catch (error) {
                    console.error('Auth initialization error:', error)
                    set({
                        error: error instanceof Error ? error.message : 'Authentication failed',
                        isLoading: false,
                        isInitialized: true,
                    })
                }
            },

            setUser: (user) => {
                set({ user })
            },

            setProfile: (profile) => {
                set({ profile })
            },

            updateProfile: (updates) => {
                set((state) => ({
                    profile: state.profile ? { ...state.profile, ...updates } : null,
                }))
            },

            signOut: async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                get().reset()
            },

            reset: () => {
                set(initialState)
            },
        }),
        {
            name: 'ketab-yar-auth',
            partialize: (state) => ({
                user: state.user,
                profile: state.profile,
            }),
        }
    )
)
