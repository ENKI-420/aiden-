"use client"

import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import type { User } from "@/lib/types"

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    async function getUser() {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (data?.user) {
          setUser(data.user as unknown as User)
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
      setUser((session?.user as unknown as User) || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
