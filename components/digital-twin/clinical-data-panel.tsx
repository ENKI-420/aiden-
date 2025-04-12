"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface ClinicalData {
  bloodPressure: string
  heartRate: number
  temperature: string
  respiratoryRate: number
  oxygenSaturation: number
  glucoseLevel: number
}

export function ClinicalDataPanel({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(true)
  const [clinicalData, setClinicalData] = useState<ClinicalData | null>(null)

  useEffect(() => {
    // Simulate API call to fetch clinical data
    const timer = setTimeout(() => {
      setClinicalData({
        bloodPressure: "120/80 mmHg",
        heartRate: 72,
        temperature: "98.6°F (37°C)",
        respiratoryRate: 16,
        oxygenSaturation: 98,
        glucoseLevel: 95,
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [patientId])

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Blood Pressure:</span>
          <span className="font-medium">{clinicalData?.bloodPressure}</span>
        </div>
        <Progress value={75} className="h-2" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Heart Rate:</span>
          <span className="font-medium">{clinicalData?.heartRate} bpm</span>
        </div>
        <Progress value={60} className="h-2" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Temperature:</span>
          <span className="font-medium">{clinicalData?.temperature}</span>
        </div>
        <Progress value={50} className="h-2" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Oxygen Saturation:</span>
          <span className="font-medium">{clinicalData?.oxygenSaturation}%</span>
        </div>
        <Progress value={98} className="h-2" />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Glucose Level:</span>
          <span className="font-medium">{clinicalData?.glucoseLevel} mg/dL</span>
        </div>
        <Progress value={65} className="h-2" />
      </div>
    </div>
  )
}
