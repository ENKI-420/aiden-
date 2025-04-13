"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useMode } from "@/contexts/mode-context"
import { executeCommand } from "@/lib/terminal/command-executor"
import type { TerminalHistory } from "@/lib/terminal/types"
import { cn } from "@/lib/utils"
import { Loader2, X, Minimize, Maximize, TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useHotkeys } from "@/hooks/use-hotkeys"

interface TerminalProps {
  className?: string
}

export function Terminal({ className }: TerminalProps) {
  const { currentMode } = useMode()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<TerminalHistory[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Terminal prompt based on current mode
  const getPrompt = () => {
    const modePrompts: Record<string, string> = {
      general: "aiden",
      "red-teaming": "aiden-sec",
      "reverse-engineering": "aiden-re",
      "business-admin": "aiden-ba",
      "web-development": "aiden-web",
      "app-development": "aiden-app",
      "physics-research": "aiden-phys",
    }

    return `${modePrompts[currentMode]}@terminal:~$`
  }

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [history])

  // Focus input when terminal is opened
  useEffect(() => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus()
    }
  }, [isMinimized])

  // Handle command execution
  const handleExecuteCommand = async () => {
    if (!input.trim()) return

    // Add command to history
    const newCommandHistory = [...commandHistory, input]
    setCommandHistory(newCommandHistory)
    setHistoryIndex(newCommandHistory.length)

    // Add command to terminal history
    const newHistory = [...history, { type: "command", content: input, timestamp: new Date().toISOString() }]
    setHistory(newHistory)
    setInput("")
    setIsLoading(true)

    try {
      // Execute command based on current mode
      const result = await executeCommand(input, currentMode)

      // Add result to terminal history
      setHistory((prev) => [
        ...prev,
        {
          type: "output",
          content: result.output,
          timestamp: new Date().toISOString(),
          status: result.status,
          data: result.data,
        },
      ])
    } catch (error) {
      // Add error to terminal history
      setHistory((prev) => [
        ...prev,
        {
          type: "error",
          content: error instanceof Error ? error.message : "An unknown error occurred",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleExecuteCommand()
  }

  // Handle keyboard navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else {
        setHistoryIndex(commandHistory.length)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Implement tab completion here
    }
  }

  // Register hotkeys
  useHotkeys([
    ["ctrl+`", () => setIsMinimized(!isMinimized)],
    [
      "escape",
      () => {
        if (isFullscreen) {
          setIsFullscreen(false)
        }
      },
    ],
  ])

  // Clear terminal history
  const clearTerminal = () => {
    setHistory([])
  }

  if (isMinimized) {
    return (
      <Button className="fixed bottom-4 right-4 z-50" onClick={() => setIsMinimized(false)} aria-label="Open terminal">
        <TerminalIcon className="h-4 w-4 mr-2" />
        Terminal
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col border rounded-md bg-black text-green-400 font-mono text-sm",
        isFullscreen ? "fixed inset-0 z-50" : "h-80",
        className,
      )}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4" />
          <span>AIDEN Terminal - {currentMode.replace(/-/g, " ")} Mode</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize terminal"
          >
            <Minimize className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={clearTerminal}
            aria-label="Clear terminal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <div className="text-yellow-400">
            AIDEN Terminal v1.0.0 - {currentMode.replace(/-/g, " ")} Mode
            <br />
            Type 'help' to see available commands.
          </div>

          {history.map((item, index) => (
            <div key={index} className="space-y-1">
              {item.type === "command" && (
                <div className="flex">
                  <span className="text-blue-400 mr-2">{getPrompt()}</span>
                  <span>{item.content}</span>
                </div>
              )}
              {item.type === "output" && (
                <div
                  className={cn(
                    "pl-4 whitespace-pre-wrap",
                    item.status === "success" ? "text-green-400" : "text-white",
                  )}
                >
                  {item.content}
                </div>
              )}
              {item.type === "error" && <div className="pl-4 text-red-400 whitespace-pre-wrap">{item.content}</div>}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing command...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </ScrollArea>

      {/* Terminal input */}
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-2 bg-gray-900 border-t">
        <span className="text-blue-400 mr-2">{getPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none"
          disabled={isLoading}
          aria-label="Terminal input"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  )
}
