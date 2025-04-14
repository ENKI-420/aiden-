"use client"

import * as React from "react"

const ChartTooltipContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

export const ChartTooltipProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = React.useState(false)

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open)
  }, [])

  const value = React.useMemo(
    () => ({
      open,
      onOpenChange,
    }),
    [open, onOpenChange],
  )

  return <ChartTooltipContext.Provider value={value}>{children}</ChartTooltipContext.Provider>
}

export const ChartTooltip = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="pointer-events-none absolute z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-sm opacity-0 transition-opacity data-[state=open]:opacity-100">
      {children}
    </div>
  )
}

export const ChartTooltipContent = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <div className="text-sm">{children}</div>
}

export const ChartContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`relative ${className || ""}`}>{children}</div>
}

export const ChartLegend = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={`flex items-center gap-4 ${className || ""}`}>{children}</div>
}
