"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

type UserToCreate = {
  email: string
  password: string
  role?: string
}

export async function createUsers(users: UserToCreate[]) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get the current user's session to verify they're an admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return [{ email: "all", success: false, message: "Not authenticated" }]
  }

  // Check if the current user is an admin
  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (profileData?.role !== "admin") {
    return [{ email: "all", success: false, message: "Not authorized to create users" }]
  }

  const results = []

  for (const user of users) {
    try {
      // Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
      })

      if (authError) {
        results.push({
          email: user.email,
          success: false,
          message: authError.message,
        })
        continue
      }

      // If user role is specified, create a profile record
      if (user.role && authData.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          email: user.email,
          role: user.role,
        })

        if (profileError) {
          results.push({
            email: user.email,
            success: true,
            message: `User created but profile error: ${profileError.message}`,
          })
          continue
        }
      }

      results.push({
        email: user.email,
        success: true,
        message: "User created successfully",
      })
    } catch (error) {
      results.push({
        email: user.email,
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return results
}
