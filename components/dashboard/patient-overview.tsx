"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { department: "Oncology", active: 245, inactive: 35 },
  { department: "Cardiology", active: 188, inactive: 22 },
  { department: "Neurology", active: 156, inactive: 18 },
  { department: "Pediatrics", active: 132, inactive: 15 },
  { department: "Orthopedics", active: 122, inactive: 12 },
  { department: "Radiology", active: 99, inactive: 8 },
]

export function PatientOverview() {
  return (
    <ChartContainer
      config={{
        active: {
          label: "Active Patients",
          color: "hsl(var(--chart-1))",
        },
        inactive: {
          label: "Inactive Patients",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="department" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="active" fill="var(--color-active)" radius={[0, 4, 4, 0]} />
          <Bar dataKey="inactive" fill="var(--color-inactive)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
