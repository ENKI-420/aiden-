"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - in a real app, this would come from an API
const data = [
  { treatment: "Treatment A", improved: 85, unchanged: 10, worsened: 5 },
  { treatment: "Treatment B", improved: 70, unchanged: 20, worsened: 10 },
  { treatment: "Treatment C", improved: 60, unchanged: 30, worsened: 10 },
  { treatment: "Treatment D", improved: 75, unchanged: 15, worsened: 10 },
  { treatment: "Treatment E", improved: 65, unchanged: 25, worsened: 10 },
]

interface TreatmentOutcomesChartProps {
  dataSource: string
  timeRange: string
}

export function TreatmentOutcomesChart({ dataSource, timeRange }: TreatmentOutcomesChartProps) {
  return (
    <ChartContainer
      config={{
        improved: {
          label: "Improved",
          color: "hsl(var(--chart-1))",
        },
        unchanged: {
          label: "Unchanged",
          color: "hsl(var(--chart-2))",
        },
        worsened: {
          label: "Worsened",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="treatment" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="improved" fill="var(--color-improved)" stackId="a" />
          <Bar dataKey="unchanged" fill="var(--color-unchanged)" stackId="a" />
          <Bar dataKey="worsened" fill="var(--color-worsened)" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
