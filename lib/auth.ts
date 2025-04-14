// This is a simplified auth implementation
// In production, use a proper auth solution like NextAuth.js or Clerk

import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"

// Secret key for JWT signing
// In production, use a proper secret management solution
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "this_is_not_a_secure_secret_replace_in_production",
)

export interface User {
  id: string
  name: string
  email: string
  role: "patient" | "caregiver" | "healthcare_professional" | "researcher" | "admin"
  avatar?: string
}

export async function getUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token.value, JWT_SECRET)
    return verified.payload as unknown as User
  } catch (error) {
    console.error("Failed to verify token:", error)
    return null
  }
}

export async function signIn(credentials: { email: string; password: string }): Promise<User | null> {
  // In production, validate credentials against a database
  // This is a mock implementation for demonstration

  // Mock user database
  const users: Record<string, User & { password: string }> = {
    "user@example.com": {
      id: "user1",
      name: "John Doe",
      email: "user@example.com",
      password: "password123", // In production, use hashed passwords
      role: "patient",
    },
    "doctor@norton.com": {
      id: "doctor1",
      name: "Dr. Sarah Chen",
      email: "doctor@norton.com",
      password: "doctor123",
      role: "healthcare_professional",
    },
  }

  const user = users[credentials.email]

  if (!user || user.password !== credentials.password) {
    return null
  }

  // Create JWT token
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  // Set cookie
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: "strict",
  })

  // Return user without password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function signOut() {
  cookies().delete("auth_token")
}
