import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Set a longer timeout for chat responses
export const maxDuration = 60 // 60 seconds

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

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
        timestamp: new Date().toISOString(),
      })
    }

    // Stream the response
    const result = streamText({
      model: openai("gpt-4o"),
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
