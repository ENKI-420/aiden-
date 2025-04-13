"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, Trash2 } from "lucide-react"
import { speak, stopAllAudio } from "@/lib/tts"
import { VoiceRecognition } from "@/lib/voice-recognition"

interface VoiceEntry {
  id: string
  type: "input" | "output"
  content: string
  timestamp: Date
  audioUrl?: string
}

export function VoiceConsole() {
  const [entries, setEntries] = useState<VoiceEntry[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const entriesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const recognition = new VoiceRecognition({
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            addEntry("input", transcript)

            if (transcript.toLowerCase().startsWith("aiden")) {
              const command = transcript.substring(5).trim()
              processCommand(command)
            }
          }
        },
        onEnd: () => {
          setIsRecording(false)
        },
      })

      setVoiceRecognition(recognition)
    }

    // Add some sample entries
    setEntries([
      {
        id: "1",
        type: "input",
        content: "AIDEN, what is the status of Project Spectra?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        type: "output",
        content:
          "Project Spectra is currently in Phase 2 of development. The genomic sequencing module is 87% complete, and we expect to begin integration testing next week. The team has reported no major blockers at this time.",
        timestamp: new Date(Date.now() - 3590000),
      },
    ])
  }, [])

  useEffect(() => {
    // Scroll to bottom when new entries are added
    if (entriesEndRef.current) {
      entriesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [entries])

  const toggleRecording = () => {
    if (!voiceRecognition) return

    if (isRecording) {
      voiceRecognition.stop()
    } else {
      voiceRecognition.start()
      setIsRecording(true)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
    } else {
      setIsMuted(true)
      stopAllAudio()
    }
  }

  const togglePlayback = () => {
    if (isPlaying) {
      stopAllAudio()
      setIsPlaying(false)
      setCurrentPlayingId(null)
    } else {
      playAllEntries()
    }
  }

  const playAllEntries = async () => {
    setIsPlaying(true)

    for (const entry of entries) {
      if (entry.type === "output") {
        setCurrentPlayingId(entry.id)
        try {
          await speak(entry.content, { voice: "AIDEN" })
        } catch (error) {
          console.error("Error playing entry:", error)
        }
      }
    }

    setIsPlaying(false)
    setCurrentPlayingId(null)
  }

  const playEntry = async (entry: VoiceEntry) => {
    if (entry.type !== "output" || isMuted) return

    setCurrentPlayingId(entry.id)
    try {
      await speak(entry.content, { voice: "AIDEN" })
    } catch (error) {
      console.error("Error playing entry:", error)
    } finally {
      setCurrentPlayingId(null)
    }
  }

  const addEntry = (type: "input" | "output", content: string) => {
    const newEntry: VoiceEntry = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }

    setEntries((prev) => [...prev, newEntry])
  }

  const clearEntries = () => {
    stopAllAudio()
    setEntries([])
    setIsPlaying(false)
    setCurrentPlayingId(null)
  }

  const processCommand = async (command: string) => {
    // Simulate AI response
    addEntry("output", `Processing command: "${command}"...`)

    // In a real implementation, you would call your AI service here
    setTimeout(() => {
      const response = `I've analyzed your request regarding "${command}". Based on my current data, I can provide you with detailed information on this topic. Would you like me to elaborate further on any specific aspect?`

      addEntry("output", response)

      if (!isMuted) {
        speak(response, { voice: "AIDEN" })
      }
    }, 1500)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`h-full flex flex-col border rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}
    >
      <div
        className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <h2 className="text-lg font-semibold">Voice Console</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={toggleMute}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <button
            onClick={togglePlayback}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
            aria-label={isPlaying ? "Pause" : "Play all"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={clearEntries}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
            aria-label="Clear all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              No voice interactions yet. Start by pressing the microphone button.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-3 rounded-lg ${
                  entry.type === "input"
                    ? isDarkMode
                      ? "bg-blue-900 text-blue-100"
                      : "bg-blue-50 text-blue-800"
                    : isDarkMode
                      ? "bg-gray-800 text-gray-100"
                      : "bg-white text-gray-800"
                } ${currentPlayingId === entry.id ? "border-2 border-primary" : ""}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {entry.type === "input" ? "You" : "AIDEN"} • {entry.timestamp.toLocaleTimeString()}
                  </span>

                  {entry.type === "output" && (
                    <button
                      onClick={() => playEntry(entry)}
                      disabled={currentPlayingId === entry.id || isMuted}
                      className={`p-1 rounded-full ${
                        isDarkMode ? "hover:bg-gray-700 disabled:opacity-50" : "hover:bg-gray-100 disabled:opacity-50"
                      }`}
                      aria-label="Play this response"
                    >
                      <Play className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))}
            <div ref={entriesEndRef} />
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {isRecording
                ? 'Listening... Say "AIDEN" followed by your command'
                : "Press the microphone button to start speaking"}
            </p>
          </div>

          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full ${
              isRecording
                ? "bg-red-500 text-white"
                : isDarkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-primary text-white hover:bg-primary/90"
            }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-2 text-xs text-center">
          <p className={isDarkMode ? "text-gray-500" : "text-gray-400"}>
            Press <kbd className={`px-1.5 py-0.5 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>R</kbd> to
            record,
            <kbd className={`px-1.5 py-0.5 rounded mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>M</kbd> to mute,
            <kbd className={`px-1.5 py-0.5 rounded mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>L</kbd> for last
            log playback
          </p>
        </div>
      </div>
    </div>
  )
}
