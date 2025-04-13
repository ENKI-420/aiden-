"use client"

import { useState, useEffect, useCallback, useRef } from "react"

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
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = useState(false)

  // Use a ref for the recognition instance to avoid re-creating it on every render
  const recognitionRef = useRef<any>(null)
  const onResultRef = useRef(onResult)

  // Update the ref when onResult changes
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  // Initialize speech recognition once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setBrowserSupportsSpeechRecognition(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = continuous
        recognitionRef.current.interimResults = interimResults
        recognitionRef.current.lang = lang

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            }
          }

          if (finalTranscript) {
            setTranscript(finalTranscript)
            if (onResultRef.current) {
              onResultRef.current(finalTranscript)
            }
          }
        }

        recognitionRef.current.onend = () => {
          setListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setListening(false)
        }
      }
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null

        if (listening) {
          try {
            recognitionRef.current.stop()
          } catch (e) {
            console.error("Error stopping speech recognition:", e)
          }
        }
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Update recognition properties when they change
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.continuous = continuous
      recognitionRef.current.interimResults = interimResults
      recognitionRef.current.lang = lang
    }
  }, [continuous, interimResults, lang])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start()
        setListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }, [listening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop()
        // Don't set listening to false here, let the onend handler do it
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
        setListening(false)
      }
    }
  }, [listening])

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
