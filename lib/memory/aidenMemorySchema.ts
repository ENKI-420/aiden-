export type MemoryThread = {
  id: string
  title: string
  contextStack: string[]
  emotionalTuning: "neutral" | "strategic" | "introspective" | "aggressive" | "empathic"
  accessLevel: "public" | "private" | "restricted"
  rolesAllowed: string[]
  lastInvoked: string
  memoryVectors: number[]
  content: string
  createdAt: string
  updatedAt: string
}

export type MemoryQuery = {
  searchTerm?: string
  emotionalTuning?: MemoryThread["emotionalTuning"]
  accessLevel?: MemoryThread["accessLevel"]
  role?: string
  limit?: number
}

export type MemoryResult = {
  thread: MemoryThread
  similarity?: number
}

export interface MemoryManager {
  createThread(thread: Omit<MemoryThread, "id" | "createdAt" | "updatedAt">): Promise<MemoryThread>
  getThread(id: string): Promise<MemoryThread | null>
  updateThread(id: string, updates: Partial<MemoryThread>): Promise<MemoryThread>
  deleteThread(id: string): Promise<boolean>
  searchThreads(query: MemoryQuery): Promise<MemoryResult[]>
  getRecentThreads(limit?: number): Promise<MemoryThread[]>
}
