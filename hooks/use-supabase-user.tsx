"use client"

import { supabase } from "@/lib/db"
import { useEffect, useState } from "react"
import type { User } from "@/lib/types"

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Check if we have a valid Supabase client
    if (!supabase) {
      console.warn("Supabase client not initialized properly.")
      setLoading(false)
      return
    }

    async function getUser() {
      try {
        setLoading(true)

        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn("No active session or session error:", sessionError.message)
          setLoading(false)
          return
        }

        // If we have a session, get the user
        if (sessionData?.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser()

          if (userError) {
            throw userError
          }

          if (userData?.user) {
            setUser(userData.user as unknown as User)
          }
        } else {
          // No session but not an error - just no logged in user
          console.log("No active user session")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    // Get initial user
    getUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser((session.user as unknown as User) || null)
      } else {
        setUser(null)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
