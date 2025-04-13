"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send, Mic, MicOff, User, TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { MessageContent } from "./message-content"
import { MessageActions } from "./message-actions"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { ErrorBoundary } from "@/components/error-boundary"
import { useMode } from "@/contexts/mode-context"
import { ModeSelector } from "@/components/mode/mode-selector"
import { ModeDetails } from "@/components/mode/mode-details"
import { enhanceUserQuery } from "@/lib/mode-handlers"
import { Terminal } from "@/components/terminal/terminal"

export function ChatInterface() {
  const { user, loading: userLoading } = useSupabaseUser()
  const { currentMode, isModeLoading } = useMode()
  const [isRecording, setIsRecording] = useState(false)
  const [showModeDetails, setShowModeDetails] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append, reload, stop } = useChat({
    api: "/api/chat",
    body: {
      mode: currentMode,
    },
    onResponse: (response) => {
      // You can log analytics events here
      if (response.status === 200) {
        console.log("Chat response received successfully")
      }
    },
    onFinish: () => {
      // Scroll to bottom when message is complete
      scrollToBottom()
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const { transcript, listening, startListening, stopListening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({
      onResult: (result) => {
        handleInputChange({ target: { value: result } } as React.ChangeEvent<HTMLTextAreaElement>)
      },
    })

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle hotkeys
  useHotkeys([
    [
      "mod+enter",
      () => {
        if (input.trim()) {
          const form = new FormData()
          form.append("message", input)
          handleSubmit(new Event("submit") as any)
        }
      },
    ],
    [
      "escape",
      () => {
        if (isLoading) {
          stop()
        }
      },
    ],
    [
      "ctrl+`",
      () => {
        setShowTerminal(!showTerminal)
      },
    ],
  ])

  const toggleRecording = () => {
    if (isRecording) {
      stopListening()
      setIsRecording(false)
    } else {
      startListening()
      setIsRecording(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        const form = new FormData()
        form.append("message", input)
        handleSubmit(new Event("submit") as any)
      }
    }
  }

  // Handle custom submit with mode-enhanced query
  const handleEnhancedSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Enhance the query based on the current mode
    const enhancedInput = enhanceUserQuery(input, currentMode)

    // Use the append method to add the message with the original input
    // The API will receive the enhanced input
    append({
      role: "user",
      content: input,
      id: Date.now().toString(),
    })

    // Clear the input
    handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-red-500">Something went wrong with the chat interface. Please refresh the page.</div>
      }
      onReset={() => {
        // Reset the chat state if needed
        if (isLoading) {
          stop()
        }
      }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ModeSelector />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowTerminal(!showTerminal)}
              aria-label={showTerminal ? "Hide terminal" : "Show terminal"}
              className="flex-shrink-0"
            >
              <TerminalIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-1"
            onClick={() => setShowModeDetails(!showModeDetails)}
          >
            {showModeDetails ? "Hide mode details" : "Show mode details"}
          </Button>

          {showModeDetails && (
            <div className="mt-2">
              <ModeDetails />
            </div>
          )}

          {showTerminal && (
            <div className="mt-4">
              <Terminal />
            </div>
          )}
        </div>

        <Card className="flex-1 overflow-hidden border rounded-lg">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-280px)] p-4">
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to AIDEN Chat</h3>
                    <p>
                      You are in{" "}
                      {currentMode
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}{" "}
                      mode.
                    </p>
                    <p className="mt-2">Start a conversation by typing a message below.</p>
                    <p className="mt-2 text-sm">
                      Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+`</kbd> to toggle the terminal.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 p-4 rounded-lg",
                      message.role === "user" ? "bg-muted/50" : "bg-background",
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      {message.role === "user" ? (
                        <>
                          <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt="User" />
                          <AvatarFallback>{user?.email?.charAt(0) || <User className="h-4 w-4" />}</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/aiden-avatar.png" alt="AIDEN" />
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="flex flex-col flex-1 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {message.role === "user" ? user?.user_metadata?.full_name || "You" : "AIDEN"}
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                        {message.role === "assistant" && index > 0 && (
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded-md">
                            {currentMode
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </span>
                        )}
                      </div>
                      <MessageContent content={message.content} role={message.role} />
                      {message.role === "assistant" && (
                        <MessageActions message={message} onRegenerate={() => reload()} />
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-3 p-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/aiden-avatar.png" alt="AIDEN" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">AIDEN</span>
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-muted rounded-md">
                        {currentMode
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
                  <p className="font-medium">Error: {error.message || "Something went wrong"}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => reload()}>
                    Try again
                  </Button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </Card>

        <form onSubmit={handleEnhancedSubmit} className="flex items-end gap-2 mt-2">
          <div className="relative flex-1">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Ask a question in ${currentMode
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")} mode...`}
              className="min-h-[60px] resize-none pr-12"
              disabled={isLoading || isModeLoading}
              rows={1}
              aria-label="Chat input"
            />
            {browserSupportsSpeechRecognition && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 bottom-2"
                onClick={toggleRecording}
                disabled={isLoading || isModeLoading}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isLoading || isModeLoading || !input.trim()} aria-label="Send message">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </ErrorBoundary>
  )
}
