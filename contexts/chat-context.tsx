"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import type { ChatTab, ChatMode, ChatMessage, ChatSettings } from "@/lib/types"
import { getDefaultModel, type ModelOption, modelOptions } from "@/lib/ai-providers"

interface ChatContextProps {
  tabs: ChatTab[]
  activeTabId: string
  settings: ChatSettings
  createTab: (mode?: ChatMode, title?: string) => void
  closeTab: (tabId: string) => void
  switchTab: (tabId: string) => void
  renameTab: (tabId: string, newTitle: string) => void
  updateTabMessages: (tabId: string, messages: ChatMessage[]) => void
  setTabModel: (tabId: string, modelId: string) => void
  updateSettings: (newSettings: Partial<ChatSettings>) => void
  getActiveTab: () => ChatTab | undefined
  getTabModel: (tabId: string) => ModelOption
}

const defaultSettings: ChatSettings = {
  theme: "system",
  fontSize: "medium",
  messageAlignment: "left",
  sendWithEnter: true,
  showTimestamps: true,
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<ChatTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>("")
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings)

  // Initialize with a default tab
  useEffect(() => {
    if (tabs.length === 0) {
      const defaultTab: ChatTab = {
        id: uuidv4(),
        title: "New Chat",
        mode: "general",
        messages: [],
        modelId: getDefaultModel().id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }
      setTabs([defaultTab])
      setActiveTabId(defaultTab.id)
    }
  }, [tabs.length])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("chat-settings")
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      } catch (e) {
        console.error("Failed to parse saved settings:", e)
      }
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("chat-settings", JSON.stringify(settings))
  }, [settings])

  const createTab = useCallback((mode: ChatMode = "general", title = "New Chat") => {
    const newTab: ChatTab = {
      id: uuidv4(),
      title,
      mode,
      messages: [],
      modelId: getDefaultModel().id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    setTabs((prevTabs) => prevTabs.map((tab) => ({ ...tab, isActive: false })).concat(newTab))
    setActiveTabId(newTab.id)
  }, [])

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prevTabs) => {
        const newTabs = prevTabs.filter((tab) => tab.id !== tabId)

        // If we're closing the active tab, activate another one
        if (tabId === activeTabId && newTabs.length > 0) {
          const newActiveTab = newTabs[newTabs.length - 1]
          newTabs[newTabs.length - 1] = { ...newActiveTab, isActive: true }
          setActiveTabId(newActiveTab.id)
        }

        // If we closed the last tab, create a new one
        if (newTabs.length === 0) {
          const defaultTab: ChatTab = {
            id: uuidv4(),
            title: "New Chat",
            mode: "general",
            messages: [],
            modelId: getDefaultModel().id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
          }
          setActiveTabId(defaultTab.id)
          return [defaultTab]
        }

        return newTabs
      })
    },
    [activeTabId],
  )

  const switchTab = useCallback((tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      })),
    )
    setActiveTabId(tabId)
  }, [])

  const renameTab = useCallback((tabId: string, newTitle: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? { ...tab, title: newTitle, updatedAt: new Date() } : tab)),
    )
  }, [])

  const updateTabMessages = useCallback((tabId: string, messages: ChatMessage[]) => {
    setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === tabId ? { ...tab, messages, updatedAt: new Date() } : tab)))
  }, [])

  const setTabModel = useCallback((tabId: string, modelId: string) => {
    setTabs((prevTabs) => prevTabs.map((tab) => (tab.id === tabId ? { ...tab, modelId, updatedAt: new Date() } : tab)))
  }, [])

  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  const getActiveTab = useCallback(() => {
    return tabs.find((tab) => tab.id === activeTabId)
  }, [tabs, activeTabId])

  const getTabModel = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId)
      const modelId = tab?.modelId || getDefaultModel().id
      return modelOptions.find((m) => m.id === modelId) || getDefaultModel()
    },
    [tabs],
  )

  return (
    <ChatContext.Provider
      value={{
        tabs,
        activeTabId,
        settings,
        createTab,
        closeTab,
        switchTab,
        renameTab,
        updateTabMessages,
        setTabModel,
        updateSettings,
        getActiveTab,
        getTabModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
