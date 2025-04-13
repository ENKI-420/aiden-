import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with the correct environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Create Supabase client with anonymous key (for client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create Supabase admin client with service role key (for server-side only)
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

// Prisma client is only initialized if the environment is properly configured
let prisma: any = null

// Only import and initialize Prisma if we're in a Node.js environment
if (typeof window === "undefined") {
  try {
    const { PrismaClient } = require("@prisma/client")

    if (process.env.NEXT_POSTGRES_PRISMA_URL) {
      if (process.env.NODE_ENV === "production") {
        prisma = new PrismaClient()
      } else {
        if (!global.prisma) {
          global.prisma = new PrismaClient()
        }
        prisma = global.prisma
      }
    } else {
      console.warn("Database URL not found, Prisma client not initialized")
    }
  } catch (error) {
    console.warn("Failed to initialize Prisma client:", error)
  }
}

export { prisma }
