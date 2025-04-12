"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - in a real app, this would come from an API
const data = [
  { name: "Cardiovascular", value: 35 },
  { name: "Respiratory", value: 25 },
  { name: "Gastrointestinal", value: 15 },
  { name: "Neurological", value: 12 },
  { name: "Musculoskeletal", value: 8 },
  { name: "Other", value: 5 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-lg font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill} className="text-lg">
        {value} patients
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill={fill} className="text-sm">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

interface DiagnosisDistributionChartProps {
  dataSource: string
  timeRange: string
}

export function DiagnosisDistributionChart({ dataSource, timeRange }: DiagnosisDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  // Create a config object for ChartContainer
  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <ChartContainer config={chartConfig} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
