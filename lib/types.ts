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
