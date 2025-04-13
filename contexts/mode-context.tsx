"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/db"

export type ApplicationMode =
  | "general"
  | "red-teaming"
  | "reverse-engineering"
  | "business-admin"
  | "web-development"
  | "app-development"
  | "physics-research"

interface ModeContextType {
  currentMode: ApplicationMode
  setMode: (mode: ApplicationMode) => void
  isModeLoading: boolean
  modeCapabilities: Record<ApplicationMode, string[]>
}

const defaultModeCapabilities: Record<ApplicationMode, string[]> = {
  general: ["General question answering", "Basic information retrieval", "Conversational assistance"],
  "red-teaming": [
    "Security vulnerability assessment",
    "Penetration testing methodologies",
    "Defensive strategy analysis",
  ],
  "reverse-engineering": ["Code decompilation techniques", "System architecture analysis", "Protocol reconstruction"],
  "business-admin": ["Process optimization", "Resource allocation", "Strategic planning"],
  "web-development": ["Frontend framework expertise", "Backend system design", "API integration"],
  "app-development": ["Mobile platform development", "Cross-platform solutions", "Performance optimization"],
  "physics-research": ["Quantum mechanics modeling", "Theoretical physics concepts", "Experimental design assistance"],
}

const ModeContext = createContext<ModeContextType>({
  currentMode: "general",
  setMode: () => {},
  isModeLoading: false,
  modeCapabilities: defaultModeCapabilities,
})

export const useMode = () => useContext(ModeContext)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [currentMode, setCurrentMode] = useState<ApplicationMode>("general")
  const [isModeLoading, setIsModeLoading] = useState(false)
  const [modeCapabilities] = useState(defaultModeCapabilities)

  // Load user's preferred mode from Supabase if authenticated
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!supabase) {
        return
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn("Session error:", sessionError.message)
          return
        }

        if (session?.user) {
          setIsModeLoading(true)

          try {
            const { data, error } = await supabase
              .from("user_preferences")
              .select("preferred_mode")
              .eq("user_id", session.user.id)
              .single()

            if (!error && data?.preferred_mode) {
              setCurrentMode(data.preferred_mode as ApplicationMode)
            }
          } catch (error) {
            console.error("Error fetching user preferences:", error)
          } finally {
            setIsModeLoading(false)
          }
        }
      } catch (error) {
        console.error("Error loading user preferences:", error)
        setIsModeLoading(false)
      }
    }

    loadUserPreferences()
  }, [])

  const setMode = async (mode: ApplicationMode) => {
    setIsModeLoading(true)

    // Save user preference if authenticated
    if (supabase) {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn("Session error:", sessionError.message)
        } else if (session?.user) {
          await supabase.from("user_preferences").upsert({
            user_id: session.user.id,
            preferred_mode: mode,
            updated_at: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Error saving user preferences:", error)
      }
    }

    setCurrentMode(mode)
    setIsModeLoading(false)
  }

  return (
    <ModeContext.Provider value={{ currentMode, setMode, isModeLoading, modeCapabilities }}>
      {children}
    </ModeContext.Provider>
  )
}
