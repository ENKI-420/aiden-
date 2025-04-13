"use client"

import { useState } from "react"
import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Edit2, Check, MessageSquare, Code, BookOpen, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMode } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TabBar() {
  const { tabs, activeTabId, createTab, closeTab, switchTab, renameTab } = useChat()

  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const handleStartEditing = (tabId: string, currentTitle: string) => {
    setEditingTabId(tabId)
    setEditingTitle(currentTitle)
  }

  const handleFinishEditing = () => {
    if (editingTabId && editingTitle.trim()) {
      renameTab(editingTabId, editingTitle.trim())
    }
    setEditingTabId(null)
    setEditingTitle("")
  }

  const getModeIcon = (mode: ChatMode) => {
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
    <div className="flex items-center border-b bg-background">
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        <div className="flex">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "group flex items-center min-w-[140px] max-w-[200px] h-10 px-3 border-r relative",
                tab.id === activeTabId ? "bg-background border-b-2 border-b-primary" : "bg-muted/30 hover:bg-muted/50",
              )}
            >
              <div
                className="flex items-center gap-2 flex-1 cursor-pointer overflow-hidden"
                onClick={() => switchTab(tab.id)}
              >
                {getModeIcon(tab.mode)}

                {editingTabId === tab.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFinishEditing()
                      } else if (e.key === "Escape") {
                        setEditingTabId(null)
                      }
                    }}
                    className="h-6 py-0 px-1 text-sm"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate text-sm">{tab.title}</span>
                )}
              </div>

              <div
                className={cn(
                  "flex items-center gap-1 ml-1",
                  tab.id === activeTabId ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                {editingTabId === tab.id ? (
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleFinishEditing}>
                    <Check className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartEditing(tab.id, tab.title)
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center px-2 border-l">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => createTab("general", "General Chat")}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span>General Chat</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => createTab("code", "Code Assistant")}>
                    <Code className="h-4 w-4 mr-2" />
                    <span>Code Assistant</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => createTab("research", "Research Assistant")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Research Assistant</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => createTab("creative", "Creative Assistant")}>
                    <Palette className="h-4 w-4 mr-2" />
                    <span>Creative Assistant</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
