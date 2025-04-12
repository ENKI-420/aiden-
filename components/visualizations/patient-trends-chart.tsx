"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - in a real app, this would come from an API
const data = [
  { month: "Jan", admissions: 65, discharges: 58, referrals: 42 },
  { month: "Feb", admissions: 59, discharges: 55, referrals: 39 },
  { month: "Mar", admissions: 80, discharges: 74, referrals: 52 },
  { month: "Apr", admissions: 81, discharges: 79, referrals: 56 },
  { month: "May", admissions: 56, discharges: 58, referrals: 40 },
  { month: "Jun", admissions: 55, discharges: 52, referrals: 45 },
  { month: "Jul", admissions: 40, discharges: 37, referrals: 36 },
  { month: "Aug", admissions: 60, discharges: 58, referrals: 49 },
  { month: "Sep", admissions: 70, discharges: 66, referrals: 51 },
  { month: "Oct", admissions: 65, discharges: 61, referrals: 47 },
  { month: "Nov", admissions: 75, discharges: 70, referrals: 53 },
  { month: "Dec", admissions: 85, discharges: 80, referrals: 59 },
]

interface PatientTrendsChartProps {
  dataSource: string
  timeRange: string
}

export function PatientTrendsChart({ dataSource, timeRange }: PatientTrendsChartProps) {
  // In a real app, we would filter data based on dataSource and timeRange
  // For this example, we'll just use the full dataset

  return (
    <ChartContainer
      config={{
        admissions: {
          label: "Admissions",
          color: "hsl(var(--chart-1))",
        },
        discharges: {
          label: "Discharges",
          color: "hsl(var(--chart-2))",
        },
        referrals: {
          label: "Referrals",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="admissions" stroke="var(--color-admissions)" strokeWidth={2} />
          <Line type="monotone" dataKey="discharges" stroke="var(--color-discharges)" strokeWidth={2} />
          <Line type="monotone" dataKey="referrals" stroke="var(--color-referrals)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
