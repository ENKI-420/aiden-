"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useMode } from "./mode-context"
import type { TerminalHistory } from "@/lib/terminal/types"

interface TerminalContextType {
  history: TerminalHistory[]
  setHistory: React.Dispatch<React.SetStateAction<TerminalHistory[]>>
  commandHistory: string[]
  setCommandHistory: React.Dispatch<React.SetStateAction<string[]>>
  isMinimized: boolean
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>
  isFullscreen: boolean
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
  clearTerminal: () => void
}

const TerminalContext = createContext<TerminalContextType>({
  history: [],
  setHistory: () => {},
  commandHistory: [],
  setCommandHistory: () => {},
  isMinimized: true,
  setIsMinimized: () => {},
  isFullscreen: false,
  setIsFullscreen: () => {},
  clearTerminal: () => {},
})

export const useTerminal = () => useContext(TerminalContext)

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const { currentMode } = useMode()
  const [history, setHistory] = useState<TerminalHistory[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isMinimized, setIsMinimized] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Add welcome message when mode changes
  useEffect(() => {
    setHistory([
      {
        type: "output",
        content: `Welcome to AIDEN Terminal v1.0.0 - ${currentMode.replace(/-/g, " ")} Mode\nType 'help' to see available commands.`,
        timestamp: new Date().toISOString(),
        status: "info",
      },
    ])
  }, [currentMode])

  const clearTerminal = () => {
    setHistory([
      {
        type: "output",
        content: `Terminal cleared. AIDEN Terminal v1.0.0 - ${currentMode.replace(/-/g, " ")} Mode`,
        timestamp: new Date().toISOString(),
        status: "info",
      },
    ])
  }

  return (
    <TerminalContext.Provider
      value={{
        history,
        setHistory,
        commandHistory,
        setCommandHistory,
        isMinimized,
        setIsMinimized,
        isFullscreen,
        setIsFullscreen,
        clearTerminal,
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}
