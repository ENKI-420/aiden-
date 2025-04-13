import { NextResponse } from "next/server"

// Mock TTS service - in production, you would use a real TTS service like ElevenLabs or Azure
async function generateSpeech(text: string, voice: string): Promise<ArrayBuffer> {
  // This is a placeholder - in a real implementation, you would call a TTS service
  // For now, we'll use the browser's built-in TTS via a data URL

  // In production, replace this with actual TTS API call
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${getVoiceId(voice)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
    },
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.statusText}`)
  }

  return await response.arrayBuffer()
}

function getVoiceId(voice: string): string {
  // Map voice names to ElevenLabs voice IDs
  const voiceMap: Record<string, string> = {
    Lin: "21m00Tcm4TlvDq8ikWAM",
    AIDEN: "AZnzlk1XvdvUeBnXmlld",
    Narrator: "EXAVITQu4vr4xnSDxMaL",
  }

  return voiceMap[voice] || voiceMap["AIDEN"]
}

export async function POST(req: Request) {
  try {
    const { text, voice = "AIDEN" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const audioBuffer = await generateSpeech(text, voice)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    })
  } catch (error) {
    console.error("TTS API error:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}
