import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messageId, feedback } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Store feedback in database
    await supabase.from("message_feedback").insert({
      message_id: messageId,
      user_id: session.user.id,
      feedback_type: feedback,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ error: "Failed to process feedback", details: error.message }, { status: 500 })
  }
}
