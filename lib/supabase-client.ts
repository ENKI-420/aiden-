// Simplified Supabase client implementation that doesn't require external dependencies

export interface SupabaseClient {
  auth: {
    signIn: (params: { email: string; password: string }) => Promise<{ user: any; error: any }>
    signOut: () => Promise<{ error: any }>
    getUser: () => Promise<{ user: any; error: any }>
  }
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (
        column: string,
        value: any,
      ) => {
        single: () => Promise<{ data: any; error: any }>
        get: () => Promise<{ data: any; error: any }>
      }
    }
    insert: (data: any) => Promise<{ data: any; error: any }>
    update: (data: any) => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>
    }
    delete: () => {
      eq: (column: string, value: any) => Promise<{ data: any; error: any }>
    }
  }
}

// Mock implementation that returns predefined data
export function createClient(): SupabaseClient {
  return {
    auth: {
      signIn: async ({ email, password }) => {
        // Mock authentication
        if (email === "test@example.com" && password === "password") {
          return {
            user: { id: "user-123", email },
            error: null,
          }
        }
        return {
          user: null,
          error: { message: "Invalid credentials" },
        }
      },
      signOut: async () => {
        return { error: null }
      },
      getUser: async () => {
        return {
          user: { id: "user-123", email: "test@example.com" },
          error: null,
        }
      },
    },
    from: (table) => ({
      select: (columns = "*") => ({
        eq: (column, value) => ({
          single: async () => {
            // Return mock data based on the table and query
            return {
              data: { id: "record-123", name: "Mock Record" },
              error: null,
            }
          },
          get: async () => {
            // Return mock data based on the table and query
            return {
              data: [{ id: "record-123", name: "Mock Record" }],
              error: null,
            }
          },
        }),
      }),
      insert: async (data) => {
        return {
          data: { ...data, id: "new-record-123" },
          error: null,
        }
      },
      update: (data) => ({
        eq: async (column, value) => {
          return {
            data: { ...data, id: "updated-record-123" },
            error: null,
          }
        },
      }),
      delete: () => ({
        eq: async (column, value) => {
          return {
            data: { id: "deleted-record-123" },
            error: null,
          }
        },
      }),
    }),
  }
}

// Export a singleton instance
export const supabase = createClient()
