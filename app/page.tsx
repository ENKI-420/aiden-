import { ChatInterface } from "@/components/chat/chat-interface"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">AIDEN Chat Interface</h1>
      <ChatInterface />
    </main>
  )
}
