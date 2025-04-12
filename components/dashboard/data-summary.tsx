"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Epic", value: 45 },
  { name: "Redox", value: 30 },
  { name: "FHIR API", value: 15 },
  { name: "Other", value: 10 },
]

export function DataSummary() {
  return (
    <ChartContainer
      config={{
        Epic: {
          label: "Epic",
          color: "hsl(var(--chart-1))",
        },
        Redox: {
          label: "Redox",
          color: "hsl(var(--chart-2))",
        },
        "FHIR API": {
          label: "FHIR API",
          color: "hsl(var(--chart-3))",
        },
        Other: {
          label: "Other",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={`var(--color-${entry.name.replace(" ", "-")})`} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
