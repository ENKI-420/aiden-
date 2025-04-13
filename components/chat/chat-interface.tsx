"use client"

import type React from "react"

import { useChat } from "@/contexts/chat-context"
import { useEffect, useRef, useState, useCallback } from "react"
import { useChat as useAIChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Loader2,
  Send,
  Mic,
  MicOff,
  ImageIcon,
  Paperclip,
  Code,
  BookOpen,
  Palette,
  MessageSquare,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useHotkeys } from "@/hooks/use-hotkeys"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { MessageContent } from "./message-content"
import { MessageActions } from "./message-actions"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { ErrorBoundary } from "@/components/error-boundary"
import { ModelSelector } from "./model-selector"
import type { ChatMode } from "@/lib/types"
import { format } from "date-fns"

interface ChatInterfaceProps {
  tabId: string
  mode: ChatMode
}

export function ChatInterface({ tabId, mode }: ChatInterfaceProps) {
  const { user } = useSupabaseUser()
  const { getTabModel, setTabModel, updateTabMessages, settings } = useChat()
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const selectedModel = getTabModel(tabId)

  // Create a chat instance with the current model
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useAIChat({
    api: "/api/chat",
    body: {
      modelId: selectedModel.id,
      mode,
    },
    onResponse: (response) => {
      if (response.status === 200) {
        console.log("Chat response received successfully")
      }
    },
    onFinish: () => {
      scrollToBottom()
      // Update tab messages when a message is completed
      updateTabMessages(tabId, messages)
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  // Custom submit handler to update conversation history
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      originalHandleSubmit(e)
      // Clear attachments after sending
      setAttachments([])
    },
    [originalHandleSubmit],
  )

  const { transcript, listening, startListening, stopListening, browserSupportsSpeechRecognition } =
    useSpeechRecognition({
      onResult: (result) => {
        handleInputChange({ target: { value: result } } as React.ChangeEvent<HTMLTextAreaElement>)
      },
    })

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

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
        if (!isLoading && input.trim()) {
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
  ])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopListening()
      setIsRecording(false)
    } else {
      startListening()
      setIsRecording(true)
    }
  }, [isRecording, startListening, stopListening])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && settings.sendWithEnter) {
        e.preventDefault()
        if (!isLoading && input.trim()) {
          handleSubmit(new Event("submit") as any)
        }
      }
    },
    [handleSubmit, input, isLoading, settings.sendWithEnter],
  )

  const handleModelChange = useCallback(
    (model: any) => {
      setTabModel(tabId, model.id)
    },
    [setTabModel, tabId],
  )

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }, [])

  // Get mode-specific welcome message and placeholder
  const getModeConfig = () => {
    switch (mode) {
      case "code":
        return {
          welcomeTitle: "Code Assistant",
          welcomeMessage: "Ask me to write, explain, or debug code in any programming language.",
          placeholder: "Describe the code you need or paste code to debug...",
          icon: <Code className="h-5 w-5 mr-2" />,
        }
      case "research":
        return {
          welcomeTitle: "Research Assistant",
          welcomeMessage: "Ask me to research topics, summarize information, or cite sources.",
          placeholder: "What would you like to research?",
          icon: <BookOpen className="h-5 w-5 mr-2" />,
        }
      case "creative":
        return {
          welcomeTitle: "Creative Assistant",
          welcomeMessage: "Ask me to help with creative writing, ideas, or visual descriptions.",
          placeholder: "Describe what you'd like me to create...",
          icon: <Palette className="h-5 w-5 mr-2" />,
        }
      default:
        return {
          welcomeTitle: "General Assistant",
          welcomeMessage: "How can I help you today?",
          placeholder: "Type your message...",
          icon: <MessageSquare className="h-5 w-5 mr-2" />,
        }
    }
  }

  const modeConfig = getModeConfig()

  // Apply font size from settings
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-sm"
      case "large":
        return "text-lg"
      default:
        return "text-base"
    }
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-red-500">Something went wrong with the chat interface. Please refresh the page.</div>
      }
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {modeConfig.icon}
            <h2 className="text-xl font-semibold">{modeConfig.welcomeTitle}</h2>
          </div>
          <div className="w-48">
            <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
          </div>
        </div>

        <Card className="flex-1 overflow-hidden border rounded-lg">
          <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-240px)] p-4">
            <div className={cn("flex flex-col gap-6", getFontSizeClass())}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8 text-center text-muted-foreground">
                  <div className="max-w-md">
                    <h3 className="text-lg font-semibold mb-2">{modeConfig.welcomeTitle}</h3>
                    <p>{modeConfig.welcomeMessage}</p>
                    <p className="text-sm mt-2">Currently using: {selectedModel.name}</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4 max-w-3xl",
                      message.role === "user"
                        ? settings.messageAlignment === "right"
                          ? "ml-auto flex-row-reverse"
                          : ""
                        : settings.messageAlignment === "right"
                          ? "mr-auto"
                          : "",
                    )}
                  >
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      {message.role === "user" ? (
                        <>
                          <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt="User" />
                          <AvatarFallback>{user?.email?.charAt(0) || "U"}</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/aiden-avatar.png" alt="AIDEN" />
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={cn(
                        "flex flex-col gap-1",
                        message.role === "user" && settings.messageAlignment === "right" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          message.role === "user" && settings.messageAlignment === "right" ? "flex-row-reverse" : "",
                        )}
                      >
                        <span className="font-medium">
                          {message.role === "user" ? user?.user_metadata?.full_name || "You" : "AIDEN"}
                        </span>
                        {settings.showTimestamps && (
                          <span className="text-xs text-muted-foreground">
                            {format(message.createdAt || new Date(), "h:mm a")}
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "p-3 rounded-lg",
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        <MessageContent content={message.content} role={message.role} mode={mode} />
                      </div>
                      {message.role === "assistant" && (
                        <MessageActions message={message} onRegenerate={() => reload()} />
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex gap-4 max-w-3xl">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/aiden-avatar.png" alt="AIDEN" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">AIDEN</span>
                      {settings.showTimestamps && (
                        <span className="text-xs text-muted-foreground">{format(new Date(), "h:mm a")}</span>
                      )}
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                      </div>
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

        <form onSubmit={handleSubmit} className="mt-4">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-1 bg-muted p-1 rounded text-xs">
                  <span className="truncate max-w-[100px]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <Card className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={modeConfig.placeholder}
                className="min-h-[60px] resize-none pr-24 pl-4 py-3 rounded-md border-0"
                disabled={isLoading}
                rows={1}
                aria-label="Chat input"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {mode === "creative" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={isLoading}
                    aria-label="Add image"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <label htmlFor="file-upload">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    disabled={isLoading}
                    aria-label="Attach file"
                    asChild
                  >
                    <span>
                      <Paperclip className="h-4 w-4" />
                    </span>
                  </Button>
                </label>

                {browserSupportsSpeechRecognition && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleRecording}
                    disabled={isLoading}
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </Card>
            <Button
              type="submit"
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              aria-label="Send message"
              className="h-10 px-4"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              <span>Send</span>
            </Button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  )
}
