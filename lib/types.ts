export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt?: Date
}

export interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface FeedbackData {
  messageId: string
  feedback: "positive" | "negative"
}

export type ChatMode = "general" | "code" | "research" | "creative"

export interface ChatTab {
  id: string
  title: string
  mode: ChatMode
  messages: ChatMessage[]
  modelId: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface ChatSettings {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  messageAlignment: "left" | "right"
  sendWithEnter: boolean
  showTimestamps: boolean
}
