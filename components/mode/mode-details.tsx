"use client"

import { useMode } from "@/contexts/mode-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Laptop, Shield, Database, Briefcase, Code, Atom } from "lucide-react"

const modeIcons = {
  general: Laptop,
  "red-teaming": Shield,
  "reverse-engineering": Database,
  "business-admin": Briefcase,
  "web-development": Code,
  "app-development": Code,
  "physics-research": Atom,
}

const modeDescriptions: Record<string, string> = {
  general: "General-purpose assistant for everyday questions and tasks.",
  "red-teaming": "Specialized mode for security assessment and vulnerability analysis.",
  "reverse-engineering": "Tools and techniques for analyzing and understanding existing systems.",
  "business-admin": "Business process optimization and administrative support.",
  "web-development": "Web application development with modern frameworks and best practices.",
  "app-development": "Mobile and desktop application development across platforms.",
  "physics-research": "Advanced physics concepts, calculations, and research assistance.",
}

export function ModeDetails() {
  const { currentMode, modeCapabilities } = useMode()
  const Icon = modeIcons[currentMode]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <CardTitle className="text-lg">
            {currentMode
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}{" "}
            Mode
          </CardTitle>
        </div>
        <CardDescription>{modeDescriptions[currentMode]}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mt-2">
          {modeCapabilities[currentMode].map((capability, index) => (
            <Badge key={index} variant="secondary">
              {capability}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
