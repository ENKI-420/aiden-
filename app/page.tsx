"use client"

import { useState } from "react"
import { CommandBar } from "@/components/CommandBar"
import { MemoryView } from "@/components/MemoryView"
import { VoiceConsole } from "@/components/VoiceConsole"
import type { MemoryThread } from "@/lib/memory/aidenMemorySchema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Code, Terminal, BarChart, MessageSquare } from "lucide-react"

export default function Home() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [selectedMemory, setSelectedMemory] = useState<MemoryThread | null>(null)

  const handleCommand = (command: string) => {
    setMessages((prev) => [...prev, { role: "user", content: command }])
  }

  const handleAiResponse = (response: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
  }

  const handleSelectMemory = (memory: MemoryThread) => {
    setSelectedMemory(memory)
  }

  return (
    <main className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AIDEN Interface</h1>
            <p className="text-gray-500">Advanced Integrated Development Environment</p>
          </div>

          <CommandBar onCommand={handleCommand} onAiResponse={handleAiResponse} />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="chat">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="memory" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Memory</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Code</span>
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span className="hidden sm:inline">Terminal</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="h-[calc(100vh-240px)]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Chat Interface</CardTitle>
                    <CardDescription>Interact with AIDEN through text or voice commands</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-5rem)] overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Brain className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium">No conversations yet</h3>
                        <p className="text-gray-500 mt-2">
                          Start by typing a command in the search bar above or use the voice console.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg ${
                              message.role === "user" ? "bg-blue-50 text-blue-800" : "bg-gray-50 text-gray-800"
                            }`}
                          >
                            <div className="font-medium mb-1">{message.role === "user" ? "You" : "AIDEN"}</div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="memory" className="h-[calc(100vh-240px)]">
                <MemoryView onSelectMemory={handleSelectMemory} />
              </TabsContent>

              <TabsContent value="code" className="h-[calc(100vh-240px)]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Code Canvas</CardTitle>
                    <CardDescription>View and edit code with AI assistance</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-5rem)]">
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <Code className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-lg font-medium">Code Canvas</h3>
                        <p className="text-gray-500 mt-2">This feature will be available in the next update.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terminal" className="h-[calc(100vh-240px)]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Terminal</CardTitle>
                    <CardDescription>Execute commands and scripts</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-5rem)]">
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <Terminal className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-lg font-medium">Terminal</h3>
                        <p className="text-gray-500 mt-2">This feature will be available in the next update.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="h-[calc(100vh-240px)]">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>View project metrics and insights</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-5rem)]">
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <BarChart className="h-16 w-16 text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                        <p className="text-gray-500 mt-2">This feature will be available in the next update.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="h-[calc(100vh-240px)]">
              <VoiceConsole />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
