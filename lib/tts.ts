export type VoiceType = "Lin" | "AIDEN" | "Narrator"

export interface TTSOptions {
  voice: VoiceType
  rate?: number
  pitch?: number
  volume?: number
}

const defaultOptions: TTSOptions = {
  voice: "AIDEN",
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
}

export async function speak(text: string, options: Partial<TTSOptions> = {}): Promise<void> {
  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        ...mergedOptions,
      }),
    })

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        reject(error)
      }

      audio.play().catch(reject)
    })
  } catch (error) {
    console.error("TTS error:", error)
    throw error
  }
}

export function stopAllAudio(): void {
  // Stop all currently playing audio
  document.querySelectorAll("audio").forEach((audio) => {
    audio.pause()
    audio.currentTime = 0
  })
}
