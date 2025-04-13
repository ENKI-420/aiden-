"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { ChatMessage } from "@/lib/types"

interface MessageActionsProps {
  message: ChatMessage
  onRegenerate?: () => void
}

export function MessageActions({ message, onRegenerate }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The message has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the message to clipboard.",
        variant: "destructive",
      })
    }
  }, [message.content])

  const handleFeedback = useCallback(
    async (type: "positive" | "negative") => {
      setFeedback(type)

      try {
        // Send feedback to your API
        await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageId: message.id,
            feedback: type,
          }),
        })

        toast({
          title: "Feedback received",
          description: "Thank you for your feedback!",
        })
      } catch (err) {
        console.error("Failed to send feedback: ", err)
        toast({
          title: "Failed to send feedback",
          description: "Please try again later.",
          variant: "destructive",
        })
        setFeedback(null)
      }
    },
    [message.id],
  )

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-muted-foreground"
        onClick={copyToClipboard}
        aria-label="Copy to clipboard"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy to clipboard</span>
      </Button>

      {onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground"
          onClick={onRegenerate}
          aria-label="Regenerate response"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span className="text-xs">Regenerate</span>
        </Button>
      )}

      <div className="flex items-center ml-auto">
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 ${feedback === "positive" ? "text-green-500" : "text-muted-foreground"}`}
          onClick={() => handleFeedback("positive")}
          disabled={feedback !== null}
          aria-label="Thumbs up"
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="sr-only">Thumbs up</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-2 ${feedback === "negative" ? "text-red-500" : "text-muted-foreground"}`}
          onClick={() => handleFeedback("negative")}
          disabled={feedback !== null}
          aria-label="Thumbs down"
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="sr-only">Thumbs down</span>
        </Button>
      </div>
    </div>
  )
}
