"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type UserWithRole = User & {
  role: string
  hasMfaEnabled: boolean
  digitalTwinAccess: string[]
}

type AuthContextType = {
  user: UserWithRole | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null; requiresMfa: boolean }>
  verifyMfa: (code: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isAuthenticated: boolean
  digitalTwins: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [digitalTwins, setDigitalTwins] = useState<string[]>([])
  const [pendingMfaSession, setPendingMfaSession] = useState<Session | null>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true)

        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()

        if (initialSession) {
          await handleSession(initialSession)
        } else {
          setUser(null)
          setIsAdmin(false)
          setIsAuthenticated(false)
          setDigitalTwins([])
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (newSession) {
        await handleSession(newSession)
      } else {
        setUser(null)
        setSession(null)
        setIsAdmin(false)
        setIsAuthenticated(false)
        setDigitalTwins([])
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleSession = async (newSession: Session) => {
    setSession(newSession)

    try {
      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, has_mfa_enabled, digital_twin_access")
        .eq("id", newSession.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return
      }

      const role = profileData?.role || "user"
      const hasMfaEnabled = profileData?.has_mfa_enabled || false
      const digitalTwinAccess = profileData?.digital_twin_access || []

      setUser({
        ...newSession.user,
        role,
        hasMfaEnabled,
        digitalTwinAccess,
      })

      setIsAdmin(role === "admin")
      setIsAuthenticated(true)
      setDigitalTwins(digitalTwinAccess)
    } catch (error) {
      console.error("Error handling session:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return { error, requiresMfa: false }
      }

      // Check if MFA is required
      const { data: profileData } = await supabase
        .from("profiles")
        .select("has_mfa_enabled")
        .eq("id", data.user.id)
        .single()

      const requiresMfa = profileData?.has_mfa_enabled || false

      if (requiresMfa) {
        setPendingMfaSession(data.session)
        return { error: null, requiresMfa: true }
      }

      return { error: null, requiresMfa: false }
    } catch (error) {
      console.error("Error signing in:", error)
      return {
        error: error instanceof Error ? error : new Error("Unknown error during sign in"),
        requiresMfa: false,
      }
    }
  }

  const verifyMfa = async (code: string) => {
    try {
      if (!pendingMfaSession) {
        return { error: new Error("No pending MFA session") }
      }

      // In a real implementation, this would verify the MFA code
      // For this demo, we'll simulate verification with any 6-digit code
      if (!/^\d{6}$/.test(code)) {
        return { error: new Error("Invalid MFA code. Must be 6 digits.") }
      }

      // Simulate successful verification
      await handleSession(pendingMfaSession)
      setPendingMfaSession(null)

      return { error: null }
    } catch (error) {
      console.error("Error verifying MFA:", error)
      return { error: error instanceof Error ? error : new Error("Unknown error during MFA verification") }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        verifyMfa,
        signOut,
        isAdmin,
        isAuthenticated,
        digitalTwins,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
