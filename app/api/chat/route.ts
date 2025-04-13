import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { modelOptions } from "@/lib/ai-providers"

// Set a longer timeout for chat responses
export const maxDuration = 60 // 60 seconds

export async function POST(req: Request) {
  try {
    const { messages, modelId = "gpt-4o" } = await req.json()

    // Find the selected model or use default
    const selectedModel = modelOptions.find((model) => model.id === modelId) || modelOptions[0]

    // Initialize Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Log conversation for analytics (optional)
    if (session?.user) {
      await supabase.from("chat_logs").insert({
        user_id: session.user.id,
        messages: messages,
        model_id: selectedModel.id,
        timestamp: new Date().toISOString(),
      })
    }

    // Stream the response using the selected model
    const result = streamText({
      model: openai(selectedModel.id),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request", details: error.message }, { status: 500 })
  }
}
