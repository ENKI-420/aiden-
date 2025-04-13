import { openai } from "@ai-sdk/openai"
import { aiProviders } from "./config"

export type AIProvider = "openai" | "azure" | "gemini" | "togetherai" | "codesral"

export interface ModelOption {
  id: string
  name: string
  provider: AIProvider
  description: string
  maxTokens: number
  contextWindow: number
}

export const modelOptions: ModelOption[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's most advanced model with vision capabilities",
    maxTokens: 4096,
    contextWindow: 128000,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "Fast and efficient for most tasks",
    maxTokens: 4096,
    contextWindow: 16385,
  },
  {
    id: "text-embedding-ada-002",
    name: "Ada Embeddings",
    provider: "openai",
    description: "Efficient text embeddings model",
    maxTokens: 8191,
    contextWindow: 8191,
  },
]

// Get the default model based on available API keys
export function getDefaultModel(): ModelOption {
  if (aiProviders.openai.apiKey) {
    return modelOptions.find((model) => model.id === "gpt-4o") || modelOptions[0]
  }

  // Default fallback
  return modelOptions[0]
}

// Create the appropriate AI model client based on the provider
export function createAIModelClient(modelOption: ModelOption) {
  // For now, we only support OpenAI models in the Next.js environment
  return openai(modelOption.id)
}
