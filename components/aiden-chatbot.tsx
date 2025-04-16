"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, HelpCircle, Lock, Loader2, Info, FileText, Microscope } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import type React from "react"
import { useCallback } from "react"
import { Shield } from "lucide-react"

// Replace the import for AI SDK with our simplified implementation
// Remove these lines:
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

// Add this import instead:
import { generateChatCompletion, type ChatMessage } from "@/lib/ai-chat"

// Define types for better type safety
interface Message {
  id: string
  role: "user" | "assistant" | "system" | "error"
  content: string
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

interface ChatUser {
  id: string
  name: string
  role: "patient" | "caregiver" | "healthcare_professional" | "researcher" | "admin"
  avatar?: string
}

interface AidenChatbotProps {
  mutationData?: any[]
  user?: ChatUser
  apiKey?: string
  initialMessages?: Message[]
  onError?: (error: Error) => void
}

// Constants
const API_ENDPOINT = process.env.NEXT_PUBLIC_AI_API_ENDPOINT || "/api/aiden"
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

function AidenChatbot({ mutationData = [], user, apiKey, initialMessages, onError }: AidenChatbotProps) {
  // State management
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant"
      content: string
      timestamp: Date
    }[]
  >(
    initialMessages || [
      {
        role: "assistant",
        content:
          "Hello, I'm AIDEN (Advanced Intelligent Digital Entity for Nucleotide analysis). I can help you analyze genomic data, interpret mutations, and provide treatment recommendations. How can I assist you today?",
        timestamp: new Date(),
      },
    ],
  )
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [_username, set_Username] = useState("")
  const [_password, set_Password] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { toast } = useToast()

  // Check if user is offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Check if on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input field when tab changes to chat
  useEffect(() => {
    if (activeTab === "chat" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeTab])

  // Clean up any pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Then find the sendMessageToAI function and replace it with this implementation:
  const sendMessageToAI = useCallback(
    async (userMessage: string, retryCount = 0): Promise<string> => {
      try {
        // Cancel any existing requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController()

        // Prepare the conversation history
        const conversationHistory = messages
          .filter((msg) => msg.role !== "error" && msg.role !== "system")
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          })) as ChatMessage[]

        // Add the new user message
        conversationHistory.push({
          role: "user",
          content: userMessage,
        })

        // Use our simplified implementation instead of the AI SDK
        const response = await generateChatCompletion({
          messages: conversationHistory,
          temperature: 0.7,
          max_tokens: 2000,
        })

        return response
      } catch (error) {
        // Handle aborted requests
        if (error instanceof DOMException && error.name === "AbortError") {
          return "Request was cancelled."
        }

        // Handle network errors with retry logic
        if (
          error instanceof Error &&
          (error.message.includes("network") || error.message.includes("fetch")) &&
          retryCount < MAX_RETRIES
        ) {
          console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`)
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)))
          return sendMessageToAI(userMessage, retryCount + 1)
        }

        // Log the error and rethrow
        console.error("Error sending message to AI:", error)
        if (onError && error instanceof Error) {
          onError(error)
        }

        throw error
      } finally {
        abortControllerRef.current = null
      }
    },
    [messages, mutationData, user, apiKey, onError],
  )

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (input.trim() === "") return
    if (isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Check if we're offline or if USE_MOCK_EPIC is set to true
      const useMockResponse = isOffline || process.env.USE_MOCK_EPIC === "true"

      if (useMockResponse) {
        // Use mock response
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const mockResponse = generateMockAIResponse(input, mutationData)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: mockResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        return
      }

      // Otherwise, send to the AI API
      const aiResponse = await sendMessageToAI(input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      // Handle errors
      console.error("Error in handleSendMessage:", err)

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "error",
        content: err instanceof Error ? err.message : "An unexpected error occurred. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      setError(errorMessage.content)

      // If we get an error, try to use the mock response as a fallback
      if (!isOffline) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockResponse = generateMockAIResponse(input, mutationData)

        const fallbackMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "system",
          content: "Falling back to offline mode due to connection issues. Here's a response based on cached data:",
          timestamp: new Date(),
        }

        const assistantMessage: Message = {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content: mockResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, fallbackMessage, assistantMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, mutationData, isOffline, sendMessageToAI])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Send message on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }

      // Clear input on Escape
      if (e.key === "Escape") {
        setInput("")
      }
    },
    [handleSendMessage],
  )

  // Handle file uploads
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // For production, you would implement file upload logic here
    // For now, we'll just acknowledge the upload
    setMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        role: "system",
        content: `File "${files[0].name}" received. File uploads are being processed.`,
        timestamp: new Date(),
      },
    ])

    // Reset the input
    e.target.value = ""
  }, [])

  // Handle clearing the conversation
  const handleClearConversation = useCallback(() => {
    setMessages([
      {
        id: "welcome-message-new",
        role: "assistant",
        content: "Conversation cleared. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
  }, [])

  // Handle exporting the conversation
  const handleExportConversation = useCallback(() => {
    // Filter out system and error messages
    const exportableMessages = messages.filter((msg) => msg.role === "user" || msg.role === "assistant")

    // Format the conversation
    const conversationText = exportableMessages
      .map((msg) => `${msg.role === "user" ? "You" : "AIDEN"} (${msg.timestamp.toLocaleString()}):\n${msg.content}\n\n`)
      .join("")

    // Create a blob and download link
    const blob = new Blob([conversationText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `AIDEN_Conversation_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }, [messages])

  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleLogin = () => {
    setShowLoginDialog(true)
  }

  const performLogin = async () => {
    if (!loginUsername || !loginPassword) {
      setLoginError("Please enter both username and password")
      return
    }

    setIsLoggingIn(true)
    setLoginError("")

    try {
      // You can replace this with your actual authentication endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })

      // Check content type before trying to parse JSON
      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        // Handle non-JSON response
        const textResponse = await response.text()
        console.error("Non-JSON response received:", textResponse)
        throw new Error("Server returned an invalid response format")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed")
      }

      // Handle successful login
      localStorage.setItem("user", JSON.stringify(data.user || { username: loginUsername }))
      setShowLoginDialog(false)
      setIsAuthenticated(true)

      // Add a success message
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          role: "system",
          content: `Login successful. Welcome, ${loginUsername}!`,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Login error:", error)

      // Implement a fallback for development/testing
      if (loginUsername === "demo" && loginPassword === "password") {
        console.log("Using demo fallback login")
        localStorage.setItem("user", JSON.stringify({ username: "demo", role: "researcher" }))
        setShowLoginDialog(false)
        setIsAuthenticated(true)

        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            role: "system",
            content: "Login successful using demo credentials. Welcome to AIDEN!",
            timestamp: new Date(),
          },
        ])
        return
      }

      setLoginError(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please check your credentials or try again later.",
      )
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Generate a mock AI response based on the user's input
  const generateMockAIResponse = (userInput: string, mutationData: any[] = []): string => {
    const input = userInput.toLowerCase()

    // Check for mutation-related queries
    if (input.includes("mutation") || input.includes("braf") || input.includes("kras") || input.includes("egfr")) {
      if (mutationData.length > 0) {
        const mutation = mutationData[0]
        return `Based on the genomic analysis, I've identified a ${mutation.gene} ${mutation.mutation} mutation with a RAScore of ${mutation.raScore.toFixed(2)}. This is classified as ${mutation.pathogenicity} and has ${mutation.clinicalSignificance}. This mutation may respond to targeted therapies such as BRAF inhibitors.`
      } else {
        return "I don't have any mutation data available for this patient yet. Would you like me to run a genomic analysis?"
      }
    }

    // Check for treatment-related queries
    if (input.includes("treatment") || input.includes("therapy") || input.includes("drug")) {
      return "Based on the genomic profile, potential treatment options include targeted therapies (BRAF/MEK inhibitors), immunotherapy (checkpoint inhibitors), or combination approaches. Clinical trials may also be available. Would you like me to provide more specific recommendations based on the mutation profile?"
    }

    // Check for prognosis-related queries
    if (input.includes("prognosis") || input.includes("survival") || input.includes("outcome")) {
      return "Prognosis depends on multiple factors including mutation status, stage, and treatment response. The presence of BRAF V600E mutation typically indicates better response to targeted therapies. Based on similar genomic profiles, the 5-year survival rate is approximately 65-70% with appropriate treatment."
    }

    // Check for clinical trial queries
    if (input.includes("trial") || input.includes("study") || input.includes("research")) {
      return "I found 3 relevant clinical trials for this genomic profile:\n\n1. NCT04256473: Phase 2 study of BRAF/MEK inhibition\n2. NCT03843775: Combination immunotherapy trial\n3. NCT04294160: Targeted therapy resistance study\n\nWould you like more details about any of these trials?"
    }

    // Check for location-related queries
    if (
      input.includes("location") ||
      input.includes("center") ||
      input.includes("hospital") ||
      input.includes("norton")
    ) {
      return `Here are the Norton Cancer Institute locations:\n
1. Norton Cancer Institute – Downtown
   676 S. Floyd St.
   Louisville, KY 40202
   (502) 629-4440\n
2. Norton Cancer Institute – St. Matthews
   4123 Dutchmans Lane, Suite 300
   Louisville, KY 40207
   (502) 899-3366\n
3. Norton Cancer Institute – Brownsboro
   4955 Norton Healthcare Blvd.
   Louisville, KY 40241
   (502) 394-6410\n
4. Norton Cancer Institute – Jeffersonville
   301 Gordon Gutmann Blvd., Suite 103
   Jeffersonville, IN 47130
   (812) 288-1156\n
5. Norton Cancer Institute – Corydon
   1263 Hospital Dr. NW, Suite 100
   Corydon, IN 47112
   (812) 734-0912\n
6. Norton Cancer Institute Radiation Center – St. Matthews
   4003 Kresge Way, Suite 100
   Louisville, KY 40207
   (502) 896-7779\n
7. Norton Cancer Institute Radiation Center – Downtown
   676 S. Floyd St., Lower Level
   Louisville, KY 40202
   (502) 629-4555\n
8. Norton Cancer Institute Radiation Center – Northeast
   3991 Dutchmans Lane
   Louisville, KY 40207
   (502) 896-7779\n
9. Norton Cancer Institute – Madison
   2628 Michigan Road, Suite A
   Madison, IN 47250
   (812) 801-0603`
    }

    // Default response for other queries
    return "I'm AIDEN, your genomic analysis assistant. I can help with interpreting mutation data, suggesting treatments based on genomic profiles, finding clinical trials, and providing evidence-based information about cancer genomics. How can I assist you with your genomic analysis today?"
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to a backend service
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse = {
          role: "assistant" as const,
          content: generateMockAIResponse(input, mutationData),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error getting AI response:", error)
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)

    try {
      // In a real app, this would be an API call to authenticate
      // For now, we'll simulate authentication
      setTimeout(() => {
        // Simple validation
        if (_username === "doctor" && _password === "password") {
          setIsAuthenticated(true)
          setShowLoginModal(false)
          toast({
            title: "Authenticated",
            description: "You are now logged in to secure AIDEN features.",
          })
        } else {
          toast({
            title: "Authentication Failed",
            description: "Invalid username or password.",
            variant: "destructive",
          })
        }
        setIsAuthenticating(false)
      }, 1000)
    } catch (error) {
      console.error("Authentication error:", error)
      toast({
        title: "Authentication Error",
        description: "An error occurred during authentication.",
        variant: "destructive",
      })
      setIsAuthenticating(false)
    }
  }

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">AIDEN Assistant</h2>
            <p className="text-muted-foreground">Advanced Intelligent Digital Entity for Nucleotide analysis</p>
          </div>
        </div>

        <Card className="dark:border-slate-700 border-norton-blue shadow-lg">
          <CardHeader className="pb-3 bg-gradient-to-r from-norton-blue to-norton-teal">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-norton-teal text-white">NCI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-white">AIDEN</CardTitle>
                <CardDescription className="text-white/90">
                  AGILE - Adaptive Genomic Insights for Laboratory Evaluations
                  <br />
                  Norton Cancer Institute Assistant
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-center">
              <Lock className="h-16 w-16 mx-auto mb-4 text-norton-blue" />
              <h3 className="text-xl font-bold mb-2">Secure Access Required</h3>
              <p className="text-muted-foreground max-w-md">
                AIDEN provides secure, HIPAA-compliant analysis of genomic data and patient information. Please log in
                to access all features.
              </p>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tzDzhAK6s9cbSCe4c0hIdspQ1U4R1K.png"
                alt="Agile Defense Systems Logo"
                width={180}
                height={45}
                className="mb-2"
              />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Powered by Agile Defense Systems - CAGE code: 9HUP5
              </Badge>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button onClick={handleLogin} className="bg-norton-blue hover:bg-norton-teal">
                <Lock className="mr-2 h-4 w-4" />
                Secure Login
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(true)}>
                Continue as Guest (Limited Features)
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant & Secure</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AIDEN Assistant</h2>
          <p className="text-muted-foreground">Advanced Intelligent Digital Entity for Nucleotide analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHelpModal(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
          {!isAuthenticated && (
            <Button variant="outline" size="sm" onClick={() => setShowLoginModal(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Secure Login
            </Button>
          )}
          {isAuthenticated && (
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
              Authenticated
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat with AIDEN</CardTitle>
              <CardDescription>Ask questions about genomic data and get AI-powered insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-y-auto space-y-4 p-4 rounded-md border bg-muted/40">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                  >
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>ST</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start gap-2">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AIDEN is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Input
                  placeholder="Ask AIDEN about genomic analysis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Genomic Analysis</CardTitle>
              <CardDescription>AI-powered analysis of genomic data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Mutation Summary</h3>
                  </div>
                  <div className="mt-2">
                    {mutationData.length > 0 ? (
                      <div className="space-y-2">
                        <p>
                          Analysis identified {mutationData.length} significant mutations in the patient's genomic
                          profile.
                        </p>
                        <ul className="space-y-1 text-sm">
                          {mutationData.slice(0, 3).map((mutation, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <span>
                                {mutation.gene} {mutation.mutation} ({mutation.type})
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  mutation.raScore > 0.8
                                    ? "bg-red-50 text-red-700"
                                    : mutation.raScore > 0.6
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-green-50 text-green-700"
                                }
                              >
                                RAScore: {mutation.raScore.toFixed(2)}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No mutation data available. Run genomic analysis first.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">AI Interpretation</h3>
                  </div>
                  <div className="mt-2">
                    {mutationData.length > 0 ? (
                      <div className="space-y-2">
                        <p>
                          AIDEN has analyzed the mutation profile and identified potential therapeutic targets and
                          clinical implications.
                        </p>
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm">
                            The BRAF V600E mutation detected in this sample is a well-characterized driver mutation in
                            melanoma. This mutation leads to constitutive activation of the MAPK pathway, promoting cell
                            proliferation and survival. Patients with this mutation typically respond well to BRAF
                            inhibitors (e.g., vemurafenib, dabrafenib) and MEK inhibitors (e.g., trametinib), especially
                            when used in combination.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        AI interpretation will be available after genomic analysis is complete.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Treatment Recommendations</h3>
                  </div>
                  <div className="mt-2">
                    {mutationData.length > 0 ? (
                      <div className="space-y-2">
                        <p>Based on the genomic profile, AIDEN recommends the following treatment options:</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-green-500"></div>
                            <div>
                              <span className="font-medium">First-line:</span> Combination BRAF/MEK inhibition
                              (dabrafenib + trametinib)
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                            <div>
                              <span className="font-medium">Alternative:</span> Vemurafenib + cobimetinib
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-amber-500"></div>
                            <div>
                              <span className="font-medium">Clinical trial:</span> NCT04256473 - Novel BRAF/MEK
                              inhibitor combination
                            </div>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Treatment recommendations will be available after genomic analysis is complete.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="research">
          <Card>
            <CardHeader>
              <CardTitle>Research Insights</CardTitle>
              <CardDescription>Latest research and clinical trials relevant to the genomic profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Relevant Clinical Trials</h3>
                    </div>
                    <Badge>3 Matches</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-md bg-muted p-3">
                      <h4 className="font-medium">
                        Phase 2 Study of Novel BRAF/MEK Inhibitor Combination in BRAF-Mutant Melanoma
                      </h4>
                      <p className="mt-1 text-sm">NCT04256473 • Recruiting</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          98% Match
                        </Badge>
                        <span className="text-xs text-muted-foreground">Norton Cancer Institute</span>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <h4 className="font-medium">
                        Combination Immunotherapy and Targeted Therapy in BRAF-Mutant Melanoma
                      </h4>
                      <p className="mt-1 text-sm">NCT03843775 • Recruiting</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          92% Match
                        </Badge>
                        <span className="text-xs text-muted-foreground">Multiple Locations</span>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <h4 className="font-medium">Mechanisms of Resistance to Targeted Therapy in Melanoma</h4>
                      <p className="mt-1 text-sm">NCT04294160 • Recruiting</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          85% Match
                        </Badge>
                        <span className="text-xs text-muted-foreground">University Research Consortium</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Recent Publications</h3>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-md bg-muted p-3">
                      <h4 className="font-medium">
                        Long-term Outcomes of BRAF/MEK Inhibition in BRAF V600-Mutant Melanoma
                      </h4>
                      <p className="mt-1 text-sm">Journal of Clinical Oncology • 2023</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This study reports 5-year survival outcomes for patients treated with combination BRAF/MEK
                        inhibition, showing durable responses in a subset of patients.
                      </p>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <h4 className="font-medium">
                        Genomic Predictors of Response to Immunotherapy in BRAF-Mutant Melanoma
                      </h4>
                      <p className="mt-1 text-sm">Nature Medicine • 2023</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Researchers identified genomic signatures that predict response to immune checkpoint inhibitors
                        in patients with BRAF-mutant melanoma.
                      </p>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <h4 className="font-medium">
                        Novel Combination Approaches for Overcoming Resistance to BRAF Inhibition
                      </h4>
                      <p className="mt-1 text-sm">Cancer Discovery • 2022</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This review discusses emerging strategies to overcome resistance to BRAF inhibitors, including
                        novel drug combinations and alternative dosing schedules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secure Login</DialogTitle>
            <DialogDescription>
              Login to access secure AIDEN features including patient-specific recommendations and sensitive genomic
              data.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input id="username" value={_username} onChange={(e) => set_Username(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={_password}
                  onChange={(e) => set_Password(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowLoginModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAuthenticating}>
                {isAuthenticating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Lock className="h-4 w-4 mr-2" />
                )}
                Login
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AIDEN Assistant Help</DialogTitle>
            <DialogDescription>Learn how to use AIDEN for genomic analysis and interpretation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-medium">What is AIDEN?</h3>
              <p className="mt-1 text-sm">
                AIDEN (Advanced Intelligent Digital Entity for Nucleotide analysis) is an AI assistant specialized in
                genomic analysis, interpretation, and clinical decision support. AIDEN can analyze mutation data,
                suggest treatments, find clinical trials, and provide evidence-based information about cancer genomics.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">How to Use AIDEN</h3>
              <div className="mt-2 space-y-2">
                <div className="rounded-md bg-muted p-3">
                  <h4 className="font-medium">Chat Tab</h4>
                  <p className="mt-1 text-sm">
                    Ask AIDEN questions about genomic data, mutations, treatments, or clinical trials. Example
                    questions:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• "What does the BRAF V600E mutation mean for this patient?"</li>
                    <li>• "What treatment options are available for KRAS G12C mutations?"</li>
                    <li>• "Are there any clinical trials for this mutation profile?"</li>
                    <li>• "What's the prognosis for a patient with this genomic profile?"</li>
                  </ul>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <h4 className="font-medium">Analysis Tab</h4>
                  <p className="mt-1 text-sm">
                    View AI-powered analysis of the patient's genomic data, including mutation summaries,
                    interpretations, and treatment recommendations.
                  </p>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <h4 className="font-medium">Research Tab</h4>
                  <p className="mt-1 text-sm">
                    Explore relevant clinical trials and recent publications related to the patient's genomic profile.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Secure Features</h3>
              <p className="mt-1 text-sm">
                Some features require secure login to protect patient privacy and comply with healthcare regulations.
                These include:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Patient-specific treatment recommendations</li>
                <li>• Access to full genomic profiles</li>
                <li>• Integration with electronic health records</li>
                <li>• Saving and sharing analysis reports</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Norton Cancer Institute Locations</h3>
              <p className="mt-1 text-sm">
                AIDEN can provide information about Norton Cancer Institute locations and services. Ask about specific
                locations or services to get detailed information.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHelpModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Add both named export and default export
export { AidenChatbot }
export default AidenChatbot
