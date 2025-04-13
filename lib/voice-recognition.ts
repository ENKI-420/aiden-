export interface VoiceRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: Error) => void
  onStart?: () => void
  onEnd?: () => void
}

declare var webkitSpeechRecognition: any

export class VoiceRecognition {
  private recognition: SpeechRecognition | null = null
  private options: VoiceRecognitionOptions
  private isListening = false

  constructor(options: VoiceRecognitionOptions = {}) {
    this.options = {
      continuous: true,
      interimResults: true,
      language: "en-US",
      ...options,
    }

    this.initRecognition()
  }

  private initRecognition(): void {
    if (typeof window === "undefined") return

    const SpeechRecognition: any = window.SpeechRecognition || webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser")
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = this.options.continuous || false
    this.recognition.interimResults = this.options.interimResults || false
    this.recognition.lang = this.options.language || "en-US"

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")

      const isFinal = event.results[event.results.length - 1].isFinal

      if (this.options.onResult) {
        this.options.onResult(transcript, isFinal)
      }
    }

    this.recognition.onerror = (event) => {
      if (this.options.onError) {
        this.options.onError(new Error(`Speech recognition error: ${event.error}`))
      }
    }

    this.recognition.onstart = () => {
      this.isListening = true
      if (this.options.onStart) {
        this.options.onStart()
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.options.onEnd) {
        this.options.onEnd()
      }
    }
  }

  public start(): void {
    if (!this.recognition) {
      this.initRecognition()
    }

    if (this.recognition && !this.isListening) {
      this.recognition.start()
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }
}

export function useVoiceCommand(callback: (command: string) => void): VoiceRecognition {
  const recognition = new VoiceRecognition({
    continuous: false,
    interimResults: false,
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        const command = transcript.trim().toLowerCase()
        if (command.startsWith("aiden")) {
          callback(command.substring(5).trim())
        }
      }
    },
  })

  return recognition
}
