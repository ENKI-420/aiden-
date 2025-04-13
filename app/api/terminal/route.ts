import { NextResponse } from "next/server"
import { supabase, prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { command, output, mode } = await req.json()

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.warn("Session error in terminal API:", sessionError.message)
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    // Store command in database if user is authenticated
    if (session?.user) {
      try {
        // Use Prisma to store the command
        await prisma.terminalHistory.create({
          data: {
            userId: session.user.id,
            command,
            output: typeof output === "string" ? output : JSON.stringify(output),
            mode,
            timestamp: new Date(),
          },
        })

        return NextResponse.json({ success: true })
      } catch (dbError: any) {
        console.error("Database error in terminal API:", dbError)
        return NextResponse.json(
          { error: "Failed to store terminal command", details: dbError.message },
          { status: 500 },
        )
      }
    }

    // If no user session, just return success without storing
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Terminal API error:", error)
    return NextResponse.json({ error: "Failed to process terminal command", details: error.message }, { status: 500 })
  }
}
