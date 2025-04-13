"use client"

import { useState, useEffect, useCallback } from "react"

interface UseSpeechRecognitionProps {
  onResult?: (result: string) => void
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

interface UseSpeechRecognitionReturn {
  transcript: string
  listening: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  browserSupportsSpeechRecognition: boolean
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function useSpeechRecognition({
  onResult,
  continuous = false,
  interimResults = true,
  lang = "en-US",
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("")
  const [listening, setListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setBrowserSupportsSpeechRecognition(true)
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = continuous
        recognitionInstance.interimResults = interimResults
        recognitionInstance.lang = lang

        recognitionInstance.onresult = (event) => {
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            }
          }

          if (finalTranscript) {
            setTranscript(finalTranscript)
            if (onResult) {
              onResult(finalTranscript)
            }
          }
        }

        recognitionInstance.onend = () => {
          setListening(false)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }

    return () => {
      if (recognition) {
        recognition.onresult = null
        recognition.onend = null
        recognition.onerror = null
        if (listening) {
          recognition.stop()
        }
      }
    }
  }, [continuous, interimResults, lang, onResult])

  const startListening = useCallback(() => {
    if (recognition && !listening) {
      try {
        recognition.start()
        setListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }, [recognition, listening])

  const stopListening = useCallback(() => {
    if (recognition && listening) {
      recognition.stop()
      setListening(false)
    }
  }, [recognition, listening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
  }, [])

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  }
}
