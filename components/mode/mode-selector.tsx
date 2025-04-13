"use client"

import { useState } from "react"
import { Check, ChevronDown, Code, Database, Laptop, Shield, Briefcase, Atom } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMode, type ApplicationMode } from "@/contexts/mode-context"
import { cn } from "@/lib/utils"

const modeIcons = {
  general: Laptop,
  "red-teaming": Shield,
  "reverse-engineering": Database,
  "business-admin": Briefcase,
  "web-development": Code,
  "app-development": Code,
  "physics-research": Atom,
}

const modeLabels: Record<ApplicationMode, string> = {
  general: "General Assistant",
  "red-teaming": "Red Teaming",
  "reverse-engineering": "Reverse Engineering",
  "business-admin": "Business Administration",
  "web-development": "Web Development",
  "app-development": "App Development",
  "physics-research": "Physics Research",
}

export function ModeSelector() {
  const { currentMode, setMode, isModeLoading, modeCapabilities } = useMode()
  const [open, setOpen] = useState(false)

  const Icon = modeIcons[currentMode]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a mode"
          className="w-full justify-between"
          disabled={isModeLoading}
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{modeLabels[currentMode]}</span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search mode..." />
          <CommandList>
            <CommandEmpty>No mode found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(modeLabels).map(([mode, label]) => {
                const ModeIcon = modeIcons[mode as ApplicationMode]
                return (
                  <CommandItem
                    key={mode}
                    value={mode}
                    onSelect={() => {
                      setMode(mode as ApplicationMode)
                      setOpen(false)
                    }}
                    className="flex items-center gap-2"
                  >
                    <ModeIcon className="h-4 w-4" />
                    <span>{label}</span>
                    <Check className={cn("ml-auto h-4 w-4", currentMode === mode ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
