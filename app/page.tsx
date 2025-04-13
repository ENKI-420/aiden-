import { ChatContainer } from "@/components/chat/chat-container"
import { ChatProvider } from "@/contexts/chat-context"

export default function Home() {
  return (
    <ChatProvider>
      <ChatContainer />
    </ChatProvider>
  )
}
