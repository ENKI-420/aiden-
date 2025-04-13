"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, MessageSquare, Code, BookOpen, Palette, Clock, Star, Trash2 } from "lucide-react"

export function ChatSidebar() {
  const { tabs, activeTabId, switchTab } = useChat()
  const [expanded, setExpanded] = useState(true)

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "code":
        return <Code className="h-4 w-4" />
      case "research":
        return <BookOpen className="h-4 w-4" />
      case "creative":
        return <Palette className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div
      className={cn("border-r bg-muted/10 transition-all duration-300 ease-in-out relative", expanded ? "w-64" : "w-0")}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-2 h-8 w-8 rounded-full border bg-background shadow-md z-10"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {expanded && (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Recent Chats</h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={tab.id === activeTabId ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    tab.id === activeTabId ? "bg-secondary" : "",
                  )}
                  onClick={() => switchTab(tab.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getModeIcon(tab.mode)}
                    <span className="truncate">{tab.title}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start">
                <Clock className="h-4 w-4 mr-2" />
                <span>History</span>
              </Button>
              <Button variant="ghost" className="justify-start">
                <Star className="h-4 w-4 mr-2" />
                <span>Favorites</span>
              </Button>
              <Button variant="ghost" className="justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Trash</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
