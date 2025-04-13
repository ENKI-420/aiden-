import { SupabaseMemoryManager } from "./memory/supabaseMemoryManager"
import { speak, stopAllAudio } from "./tts"
import type { MemoryThread, MemoryQuery } from "./memory/aidenMemorySchema"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export interface AidenOptions {
  emotionalTuning?: MemoryThread["emotionalTuning"]
  voice?: "Lin" | "AIDEN" | "Narrator"
  speakResponse?: boolean
}

export class Aiden {
  private memoryManager: SupabaseMemoryManager
  private options: AidenOptions

  constructor(options: AidenOptions = {}) {
    this.memoryManager = new SupabaseMemoryManager()
    this.options = {
      emotionalTuning: "neutral",
      voice: "AIDEN",
      speakResponse: false,
      ...options,
    }
  }

  async query(input: string, options: Partial<AidenOptions> = {}): Promise<string> {
    const mergedOptions = { ...this.options, ...options }

    // Search memory for relevant context
    const memoryQuery: MemoryQuery = {
      searchTerm: input,
      emotionalTuning: mergedOptions.emotionalTuning,
      limit: 5,
    }

    const relevantMemories = await this.memoryManager.searchThreads(memoryQuery)

    // Build context from memories
    const memoryContext = relevantMemories.map((result) => result.thread.content).join("\n\n")

    // Generate response with AI
    const prompt = `
You are AIDEN, an advanced AI assistant with access to specialized knowledge and capabilities.
Emotional tuning: ${mergedOptions.emotionalTuning}

Relevant memory context:
${memoryContext}

User query: ${input}

Respond in a helpful, concise manner consistent with your emotional tuning.
`

    const { text: response } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Optionally speak the response
    if (mergedOptions.speakResponse) {
      speak(response, { voice: mergedOptions.voice })
    }

    return response
  }

  async recall(query: string): Promise<MemoryThread[]> {
    const memoryQuery: MemoryQuery = {
      searchTerm: query,
      limit: 10,
    }

    const results = await this.memoryManager.searchThreads(memoryQuery)
    return results.map((result) => result.thread)
  }

  async createMemory(
    content: string,
    options: Partial<Omit<MemoryThread, "id" | "createdAt" | "updatedAt" | "content">> = {},
  ): Promise<MemoryThread> {
    const newThread: Omit<MemoryThread, "id" | "createdAt" | "updatedAt"> = {
      title: options.title || content.substring(0, 50) + (content.length > 50 ? "..." : ""),
      contextStack: options.contextStack || [],
      emotionalTuning: options.emotionalTuning || "neutral",
      accessLevel: options.accessLevel || "public",
      rolesAllowed: options.rolesAllowed || ["admin", "AIDEN"],
      lastInvoked: new Date().toISOString(),
      memoryVectors: options.memoryVectors || [],
      content,
    }

    return await this.memoryManager.createThread(newThread)
  }

  async summarize(threadId: string): Promise<string> {
    const thread = await this.memoryManager.getThread(threadId)

    if (!thread) {
      throw new Error(`Memory thread not found: ${threadId}`)
    }

    const { text: summary } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following content concisely:\n\n${thread.content}`,
      temperature: 0.3,
      maxTokens: 200,
    })

    return summary
  }

  setOptions(options: Partial<AidenOptions>): void {
    this.options = { ...this.options, ...options }
  }

  stopSpeaking(): void {
    stopAllAudio()
  }
}

// Singleton instance for easy access
export const aiden = new Aiden()
