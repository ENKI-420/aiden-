import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { audioBlob } = await req.json()

    if (!audioBlob) {
      return NextResponse.json({ error: "Audio data is required" }, { status: 400 })
    }

    // Convert base64 to blob
    const audio = Buffer.from(audioBlob.split(",")[1], "base64")

    // Use OpenAI Whisper API to transcribe audio
    const formData = new FormData()
    formData.append("file", new Blob([audio], { type: "audio/webm" }), "audio.webm")
    formData.append("model", "whisper-1")

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`)
    }

    const { text } = await response.json()

    return NextResponse.json({ transcript: text })
  } catch (error) {
    console.error("Voice API error:", error)
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 })
  }
}
