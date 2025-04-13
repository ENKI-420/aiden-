"use client"

import { useState, useEffect } from "react"
import { aiden } from "@/lib/aiden"
import type { MemoryThread } from "@/lib/memory/aidenMemorySchema"
import { Search, Clock, Users, ChevronDown, ChevronRight } from "lucide-react"

interface MemoryViewProps {
  onSelectMemory?: (memory: MemoryThread) => void
}

export function MemoryView({ onSelectMemory }: MemoryViewProps) {
  const [memories, setMemories] = useState<MemoryThread[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [expandedMemories, setExpandedMemories] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState({
    emotionalTuning: "",
    accessLevel: "",
    role: "",
  })

  useEffect(() => {
    loadRecentMemories()
  }, [])

  const loadRecentMemories = async () => {
    try {
      setLoading(true)
      const recentMemories = await aiden.recall("")
      setMemories(recentMemories)
    } catch (error) {
      console.error("Error loading memories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadRecentMemories()
      return
    }

    try {
      setLoading(true)
      const searchResults = await aiden.recall(searchTerm)

      setMemories(searchResults)
    } catch (error) {
      console.error("Error searching memories:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMemoryExpansion = (id: string) => {
    setExpandedMemories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const filteredMemories = memories.filter((memory) => {
    if (filters.emotionalTuning && memory.emotionalTuning !== filters.emotionalTuning) {
      return false
    }
    if (filters.accessLevel && memory.accessLevel !== filters.accessLevel) {
      return false
    }
    if (filters.role && !memory.rolesAllowed.includes(filters.role)) {
      return false
    }
    return true
  })

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Memory Threads</h2>
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90"
          >
            Search
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={filters.emotionalTuning}
            onChange={(e) => handleFilterChange("emotionalTuning", e.target.value)}
            className="text-xs border rounded-md px-2 py-1"
          >
            <option value="">All Emotional Tunings</option>
            <option value="neutral">Neutral</option>
            <option value="strategic">Strategic</option>
            <option value="introspective">Introspective</option>
            <option value="aggressive">Aggressive</option>
            <option value="empathic">Empathic</option>
          </select>

          <select
            value={filters.accessLevel}
            onChange={(e) => handleFilterChange("accessLevel", e.target.value)}
            className="text-xs border rounded-md px-2 py-1"
          >
            <option value="">All Access Levels</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="restricted">Restricted</option>
          </select>

          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="text-xs border rounded-md px-2 py-1"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="AIDEN">AIDEN</option>
            <option value="clinician">Clinician</option>
            <option value="investor">Investor</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No memory threads found.</div>
        ) : (
          <div className="space-y-2">
            {filteredMemories.map((memory) => (
              <div key={memory.id} className="border rounded-md overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                  onClick={() => toggleMemoryExpansion(memory.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedMemories[memory.id] ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <h3 className="font-medium text-sm">{memory.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        memory.emotionalTuning === "neutral"
                          ? "bg-gray-100"
                          : memory.emotionalTuning === "strategic"
                            ? "bg-blue-100 text-blue-800"
                            : memory.emotionalTuning === "introspective"
                              ? "bg-purple-100 text-purple-800"
                              : memory.emotionalTuning === "aggressive"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                      }`}
                    >
                      {memory.emotionalTuning}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        memory.accessLevel === "public"
                          ? "bg-green-100 text-green-800"
                          : memory.accessLevel === "private"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {memory.accessLevel}
                    </span>
                  </div>
                </div>

                {expandedMemories[memory.id] && (
                  <div className="p-3 text-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      <span>Last invoked: {new Date(memory.lastInvoked).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Users className="h-3 w-3" />
                      <span>Roles: {memory.rolesAllowed.join(", ")}</span>
                    </div>

                    <div className="mt-2 border-t pt-2">
                      <p className="text-sm whitespace-pre-wrap">{memory.content}</p>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => onSelectMemory?.(memory)}
                        className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Use this memory
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
