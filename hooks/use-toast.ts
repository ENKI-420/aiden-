"use client"

import type React from "react"

import type { ToastActionElement } from "@/components/ui/toast"
import { useToast as useToastUI } from "@/components/ui/toast"

// Re-export the toast hook with a different name to avoid conflicts
export const useToast = useToastUI

// Export a simplified toast function for easier usage
export const toast = ({
  title,
  description,
  action,
  variant = "default",
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}) => {
  const { toast } = useToast()
  return toast({ title, description, action, variant })
}
