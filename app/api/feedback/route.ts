import { supabase } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messageId, feedback } = await req.json()

    // Check if Supabase client is available
    if (!supabase) {
      return NextResponse.json({ error: "Supabase client not initialized" }, { status: 500 })
    }

    try {
      // Get user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.warn("Session error in feedback API:", sessionError.message)
        return NextResponse.json({ error: "Authentication error", details: sessionError.message }, { status: 401 })
      }

      if (!session?.user) {
        // Store anonymous feedback or return error
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
      }

      // Store feedback in database
      const { error: insertError } = await supabase.from("message_feedback").insert({
        message_id: messageId,
        user_id: session.user.id,
        feedback_type: feedback,
        timestamp: new Date().toISOString(),
      })

      if (insertError) {
        throw insertError
      }

      return NextResponse.json({ success: true })
    } catch (supabaseError: any) {
      console.error("Supabase error in feedback API:", supabaseError)
      return NextResponse.json({ error: "Database operation failed", details: supabaseError.message }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Failed to process feedback", details: error.message }, { status: 500 })
  }
}
