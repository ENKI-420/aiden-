"use client"

import { useState, useRef, useEffect } from "react"
import { Command } from "cmdk"
import { Search, Mic, MicOff, Terminal, X } from "lucide-react"
import { aiden } from "@/lib/aiden"
import { VoiceRecognition } from "@/lib/voice-recognition"

interface CommandBarProps {
  onCommand: (command: string) => void
  onAiResponse: (response: string) => void
}

export function CommandBar({ onCommand, onAiResponse }: CommandBarProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [voiceRecognition, setVoiceRecognition] = useState<VoiceRecognition | null>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const recognition = new VoiceRecognition({
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            setValue(transcript)
            if (transcript.toLowerCase().startsWith("aiden")) {
              const command = transcript.substring(5).trim()
              handleCommand(command)
            }
          }
        },
        onEnd: () => {
          setIsRecording(false)
        },
      })

      setVoiceRecognition(recognition)
    }
  }, [])

  const toggleRecording = () => {
    if (!voiceRecognition) return

    if (isRecording) {
      voiceRecognition.stop()
    } else {
      voiceRecognition.start()
      setIsRecording(true)
    }
  }

  const handleCommand = async (command: string) => {
    if (!command.trim()) return

    onCommand(command)
    setValue("")
    setOpen(false)

    try {
      const response = await aiden.query(command, { speakResponse: true })
      onAiResponse(response)
    } catch (error) {
      console.error("Error executing command:", error)
      onAiResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-500 border rounded-lg shadow-sm bg-background hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Type a command or question...</span>
          <kbd className="hidden px-2 py-1 text-xs bg-gray-100 rounded sm:inline-flex">⌘K</kbd>
        </button>
      </div>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command bar"
        className="fixed inset-x-0 top-24 z-50 w-full max-w-2xl p-0 mx-auto overflow-hidden bg-white border rounded-lg shadow-lg"
      >
        <div className="flex items-center px-3 border-b">
          <Search className="w-4 h-4 mr-2 text-gray-400" />
          <Command.Input
            ref={inputRef}
            value={value}
            onValueChange={setValue}
            placeholder="Type a command or question..."
            className="w-full py-3 text-base bg-transparent border-0 outline-none placeholder:text-gray-400"
          />
          {value && (
            <button onClick={() => setValue("")} className="p-1 text-gray-400 hover:text-gray-500">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={toggleRecording}
            className={`p-1 ml-2 rounded-full ${isRecording ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-gray-500"}`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <Command.List className="max-h-80 overflow-y-auto py-2">
          <Command.Empty className="py-6 text-center text-gray-500">No results found.</Command.Empty>

          <Command.Group heading="Commands">
            <Command.Item
              onSelect={() => handleCommand("/help")}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>/help</span>
              </div>
              <div className="text-xs text-gray-400">Show available commands</div>
            </Command.Item>

            <Command.Item
              onSelect={() => handleCommand("/recall")}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>/recall</span>
              </div>
              <div className="text-xs text-gray-400">Search memory threads</div>
            </Command.Item>

            <Command.Item
              onSelect={() => handleCommand("/mode strategic")}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>/mode strategic</span>
              </div>
              <div className="text-xs text-gray-400">Switch to strategic mode</div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Recent Queries">
            <Command.Item
              onSelect={() => handleCommand("What is the status of Project Spectra?")}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
            >
              What is the status of Project Spectra?
            </Command.Item>
            <Command.Item
              onSelect={() => handleCommand("Summarize the latest genomic research findings")}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
            >
              Summarize the latest genomic research findings
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="flex items-center justify-end p-2 border-t">
          <button
            onClick={() => handleCommand(value)}
            disabled={!value.trim()}
            className="px-3 py-1 text-sm text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-50"
          >
            Execute
          </button>
        </div>
      </Command.Dialog>
    </div>
  )
}
