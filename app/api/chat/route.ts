import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { prepareMessagesForMode } from "@/lib/mode-handlers"
import type { ApplicationMode } from "@/contexts/mode-context"
import { supabase } from "@/lib/db"

// Set a longer timeout for chat responses
export const maxDuration = 60 // 60 seconds

export async function POST(req: Request) {
  try {
    const { messages, mode = "general" } = await req.json()

    // Prepare messages based on the current mode
    const preparedMessages = prepareMessagesForMode(messages, mode as ApplicationMode)

    // Use Supabase client if available
    if (supabase) {
      try {
        // Get user session - don't throw if no session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn("Session error in API route:", sessionError.message)
        }

        // Log conversation for analytics (optional) - only if user is authenticated
        if (session?.user) {
          try {
            await supabase.from("chat_logs").insert({
              user_id: session.user.id,
              messages: preparedMessages,
              mode: mode,
              timestamp: new Date().toISOString(),
            })
          } catch (logError) {
            console.error("Error logging chat:", logError)
            // Continue even if logging fails
          }
        }
      } catch (supabaseError) {
        console.error("Supabase client error:", supabaseError)
        // Continue even if Supabase operations fail
      }
    }

    // Stream the response - this should work even without authentication
    try {
      // Select the appropriate model based on the mode
      const modelSelection = mode === "physics-research" ? "gpt-4o" : "gpt-4o"

      const result = streamText({
        model: openai(modelSelection),
        messages: preparedMessages,
        temperature: mode === "general" ? 0.7 : 0.5, // Lower temperature for specialized modes
        maxTokens: 2000,
      })

      return result.toDataStreamResponse()
    } catch (streamError: any) {
      console.error("Streaming error:", streamError)
      return NextResponse.json(
        {
          error: "Failed to stream response",
          details: streamError.message,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
