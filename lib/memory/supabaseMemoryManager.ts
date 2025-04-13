import { createClient } from "@supabase/supabase-js"
import type { MemoryManager, MemoryThread, MemoryQuery, MemoryResult } from "./aidenMemorySchema"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/db"

export class SupabaseMemoryManager implements MemoryManager {
  private supabase

  constructor() {
    // Use the admin client for full database access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    this.supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  async createThread(thread: Omit<MemoryThread, "id" | "createdAt" | "updatedAt">): Promise<MemoryThread> {
    const id = uuidv4()
    const now = new Date().toISOString()

    const newThread: MemoryThread = {
      ...thread,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Use Supabase directly if Prisma is not available
    if (!prisma) {
      const { error } = await this.supabase.from("memory_threads").insert({
        id,
        title: thread.title,
        context_stack: thread.contextStack,
        emotional_tuning: thread.emotionalTuning,
        access_level: thread.accessLevel,
        roles_allowed: thread.rolesAllowed,
        last_invoked: now,
        memory_vectors: thread.memoryVectors,
        content: thread.content,
        created_at: now,
        updated_at: now,
      })

      if (error) throw new Error(`Failed to create memory thread: ${error.message}`)
      return newThread
    }

    // Use Prisma if available
    try {
      await prisma.memoryThread.create({
        data: {
          id,
          title: thread.title,
          contextStack: thread.contextStack,
          emotionalTuning: thread.emotionalTuning,
          accessLevel: thread.accessLevel,
          rolesAllowed: thread.rolesAllowed,
          lastInvoked: now,
          memoryVectors: thread.memoryVectors,
          content: thread.content,
        },
      })

      return newThread
    } catch (error) {
      console.error("Failed to create memory thread:", error)
      throw new Error(`Failed to create memory thread: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getThread(id: string): Promise<MemoryThread | null> {
    // Use Supabase directly if Prisma is not available
    if (!prisma) {
      const { data, error } = await this.supabase.from("memory_threads").select("*").eq("id", id).single()

      if (error) throw new Error(`Failed to get memory thread: ${error.message}`)
      if (!data) return null

      return {
        id: data.id,
        title: data.title,
        contextStack: data.context_stack || [],
        emotionalTuning: data.emotional_tuning,
        accessLevel: data.access_level,
        rolesAllowed: data.roles_allowed || [],
        lastInvoked: data.last_invoked,
        memoryVectors: data.memory_vectors || [],
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    }

    // Use Prisma if available
    try {
      const thread = await prisma.memoryThread.findUnique({
        where: { id },
      })

      if (!thread) return null

      return {
        ...thread,
        contextStack: thread.contextStack as string[],
        memoryVectors: thread.memoryVectors as number[],
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
        lastInvoked: thread.lastInvoked.toISOString(),
      }
    } catch (error) {
      console.error("Failed to get memory thread:", error)
      throw new Error(`Failed to get memory thread: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async updateThread(id: string, updates: Partial<MemoryThread>): Promise<MemoryThread> {
    const now = new Date().toISOString()

    // Use Supabase directly if Prisma is not available
    if (!prisma) {
      const { data, error } = await this.supabase
        .from("memory_threads")
        .update({
          title: updates.title,
          context_stack: updates.contextStack,
          emotional_tuning: updates.emotionalTuning,
          access_level: updates.accessLevel,
          roles_allowed: updates.rolesAllowed,
          last_invoked: updates.lastInvoked,
          memory_vectors: updates.memoryVectors,
          content: updates.content,
          updated_at: now,
        })
        .eq("id", id)
        .select("*")
        .single()

      if (error) throw new Error(`Failed to update memory thread: ${error.message}`)

      return {
        id: data.id,
        title: data.title,
        contextStack: data.context_stack || [],
        emotionalTuning: data.emotional_tuning,
        accessLevel: data.access_level,
        rolesAllowed: data.roles_allowed || [],
        lastInvoked: data.last_invoked,
        memoryVectors: data.memory_vectors || [],
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    }

    // Use Prisma if available
    try {
      const updatedThread = await prisma.memoryThread.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: now,
        },
      })

      return {
        ...updatedThread,
        contextStack: updatedThread.contextStack as string[],
        memoryVectors: updatedThread.memoryVectors as number[],
        createdAt: updatedThread.createdAt.toISOString(),
        updatedAt: updatedThread.updatedAt.toISOString(),
        lastInvoked: updatedThread.lastInvoked.toISOString(),
      }
    } catch (error) {
      console.error("Failed to update memory thread:", error)
      throw new Error(`Failed to update memory thread: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteThread(id: string): Promise<boolean> {
    // Use Supabase directly if Prisma is not available
    if (!prisma) {
      const { error } = await this.supabase.from("memory_threads").delete().eq("id", id)
      if (error) throw new Error(`Failed to delete memory thread: ${error.message}`)
      return true
    }

    // Use Prisma if available
    try {
      await prisma.memoryThread.delete({
        where: { id },
      })

      return true
    } catch (error) {
      console.error("Failed to delete memory thread:", error)
      throw new Error(`Failed to delete memory thread: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async searchThreads(query: MemoryQuery): Promise<MemoryResult[]> {
    // Use Supabase directly if Prisma is not available
    if (!prisma) {
      let supabaseQuery = this.supabase.from("memory_threads").select("*")

      if (query.emotionalTuning) {
        supabaseQuery = supabaseQuery.eq("emotional_tuning", query.emotionalTuning)
      }

      if (query.accessLevel) {
        supabaseQuery = supabaseQuery.eq("access_level", query.accessLevel)
      }

      if (query.role) {
        supabaseQuery = supabaseQuery.contains("roles_allowed", [query.role])
      }

      if (query.searchTerm) {
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query.searchTerm}%,content.ilike.%${query.searchTerm}%`)
      }

      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit)
      }

      const { data, error } = await supabaseQuery

      if (error) throw new Error(`Failed to search memory threads: ${error.message}`)

      return (data || []).map((item) => ({
        thread: {
          id: item.id,
          title: item.title,
          contextStack: item.context_stack || [],
          emotionalTuning: item.emotional_tuning,
          accessLevel: item.access_level,
          rolesAllowed: item.roles_allowed || [],
          lastInvoked: item.last_invoked,
          memoryVectors: item.memory_vectors || [],
          content: item.content,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        },
      }))
    }

    // Use Prisma if available
    try {
      // Build the where clause based on the query parameters
      const where: any = {}

      if (query.emotionalTuning) {
        where.emotionalTuning = query.emotionalTuning
      }

      if (query.accessLevel) {
        where.accessLevel = query.accessLevel
      }

      if (query.role) {
        where.rolesAllowed = {
          has: query.role,
        }
      }

      // For text search, we'll use a simple contains for now
      if (query.searchTerm) {
        where.OR = [
          { title: { contains: query.searchTerm, mode: "insensitive" } },
          { content: { contains: query.searchTerm, mode: "insensitive" } },
        ]
      }

      const threads = await prisma.memoryThread.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: query.limit || 10,
      })

      return threads.map((thread) => ({
        thread: {
          ...thread,
          contextStack: thread.contextStack as string[],
          memoryVectors: thread.memoryVectors as number[],
          createdAt: thread.createdAt.toISOString(),
          updatedAt: thread.updatedAt.toISOString(),
          lastInvoked: thread.lastInvoked.toISOString(),
        },
      }))
    } catch (error) {
      console.error("Failed to search memory threads:", error)
      throw new Error(`Failed to search memory threads: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getRecentThreads(limit = 10): Promise<MemoryThread[]> {
    // Use Supabase directly if Prisma is not available
    if (!prisma) {
      const { data, error } = await this.supabase
        .from("memory_threads")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(limit)

      if (error) throw new Error(`Failed to get recent memory threads: ${error.message}`)

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        contextStack: item.context_stack || [],
        emotionalTuning: item.emotional_tuning,
        accessLevel: item.access_level,
        rolesAllowed: item.roles_allowed || [],
        lastInvoked: item.last_invoked,
        memoryVectors: item.memory_vectors || [],
        content: item.content,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    }

    // Use Prisma if available
    try {
      const threads = await prisma.memoryThread.findMany({
        orderBy: { updatedAt: "desc" },
        take: limit,
      })

      return threads.map((thread) => ({
        ...thread,
        contextStack: thread.contextStack as string[],
        memoryVectors: thread.memoryVectors as number[],
        createdAt: thread.createdAt.toISOString(),
        updatedAt: thread.updatedAt.toISOString(),
        lastInvoked: thread.lastInvoked.toISOString(),
      }))
    } catch (error) {
      console.error("Failed to get recent memory threads:", error)
      throw new Error(
        `Failed to get recent memory threads: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }
}
