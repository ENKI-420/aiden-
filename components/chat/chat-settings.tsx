"use client"

import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

interface ChatSettingsProps {
  onClose: () => void
}

export function ChatSettings({ onClose }: ChatSettingsProps) {
  const { settings, updateSettings } = useChat()

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="font-size">Font Size</Label>
        <RadioGroup
          id="font-size"
          value={settings.fontSize}
          onValueChange={(value) => updateSettings({ fontSize: value as "small" | "medium" | "large" })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="font-small" />
            <Label htmlFor="font-small">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="font-medium" />
            <Label htmlFor="font-medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="font-large" />
            <Label htmlFor="font-large">Large</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message-alignment">Message Alignment</Label>
        <RadioGroup
          id="message-alignment"
          value={settings.messageAlignment}
          onValueChange={(value) => updateSettings({ messageAlignment: value as "left" | "right" })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="align-left" />
            <Label htmlFor="align-left">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="align-right" />
            <Label htmlFor="align-right">Right</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="send-with-enter"
          checked={settings.sendWithEnter}
          onCheckedChange={(checked) => updateSettings({ sendWithEnter: checked })}
        />
        <Label htmlFor="send-with-enter">Send message with Enter key</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-timestamps"
          checked={settings.showTimestamps}
          onCheckedChange={(checked) => updateSettings({ showTimestamps: checked })}
        />
        <Label htmlFor="show-timestamps">Show message timestamps</Label>
      </div>

      <Button onClick={onClose} className="mt-2">
        Save Changes
      </Button>
    </div>
  )
}
