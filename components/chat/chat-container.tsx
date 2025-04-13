"use client"

import { useEffect, useState } from "react"
import { useChat } from "@/contexts/chat-context"
import { TabBar } from "./tab-bar"
import { ChatInterface } from "./chat-interface"
import type { ChatMode } from "@/lib/types"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ChatSidebar } from "./chat-sidebar"
import { ChatHeader } from "./chat-header"

export function ChatContainer() {
  const { tabs, activeTabId } = useChat()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />

        <div className="flex flex-col flex-1">
          <TabBar />

          <Tabs value={activeTabId} className="flex-1 overflow-hidden">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col h-full"
              >
                <ChatInterface tabId={tab.id} mode={tab.mode as ChatMode} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
