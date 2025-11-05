"use client"

import { createClient } from "@/lib/supabase/client"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: Error | null
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Enhanced Auth Provider with singleton Supabase client
 * Implements Agent 2's performance optimization
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  // Create singleton Supabase client (Agent 2 fix)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getSession = async (): Promise<void> => {
      setIsLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          throw error
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
        setError(error instanceof Error ? error : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Error setting up auth state change listener:", error)
      setError(error instanceof Error ? error : new Error("Unknown error occurred"))
      setIsLoading(false)
      return () => { }
    }
  }, [supabase.auth])

  const signUp = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        throw error
      }
      logger.info('User signed up successfully', {
        context: 'useSupabaseAuth',
        metadata: { email }
      })
      router.push("/auth/verify")
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      setError(err)
      logger.error("Error signing up", error, { context: 'useSupabaseAuth' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        throw error
      }
      logger.info('User signed in successfully', {
        context: 'useSupabaseAuth',
        metadata: { email }
      })
      router.push("/dashboard")
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      setError(err)
      logger.error("Error signing in", error, { context: 'useSupabaseAuth' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      logger.info('User signed out successfully', { context: 'useSupabaseAuth' })
      router.push("/")
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      setError(err)
      logger.error("Error signing out", error, { context: 'useSupabaseAuth' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) {
        throw error
      }
      logger.info('Password reset email sent', {
        context: 'useSupabaseAuth',
        metadata: { email }
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error occurred")
      setError(err)
      logger.error("Error resetting password", error, { context: 'useSupabaseAuth' })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error

      setSession(data.session)
      setUser(data.session?.user ?? null)
      logger.info('Session refreshed', { context: 'useSupabaseAuth' })
    } catch (error) {
      logger.error("Error refreshing session", error, { context: 'useSupabaseAuth' })
    }
  }

  const value = {
    user,
    session,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within an AuthProvider")
  }
  return context
}
