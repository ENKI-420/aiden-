"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface PatientInfo {
  id: string
  name: string
  age: number
  gender: string
  bloodType: string
  height: string
  weight: string
  allergies: string[]
}

export function PatientInfoPanel({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(true)
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)

  useEffect(() => {
    // Simulate API call to fetch patient data
    const timer = setTimeout(() => {
      setPatientInfo({
        id: patientId,
        name: "John Doe",
        age: 45,
        gender: "Male",
        bloodType: "O+",
        height: "5'10\" (178 cm)",
        weight: "180 lbs (82 kg)",
        allergies: ["Penicillin", "Peanuts"],
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [patientId])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-1">
        <span className="text-muted-foreground">Name:</span>
        <span className="font-medium">{patientInfo?.name}</span>

        <span className="text-muted-foreground">Age:</span>
        <span className="font-medium">{patientInfo?.age} years</span>

        <span className="text-muted-foreground">Gender:</span>
        <span className="font-medium">{patientInfo?.gender}</span>

        <span className="text-muted-foreground">Blood Type:</span>
        <span className="font-medium">{patientInfo?.bloodType}</span>

        <span className="text-muted-foreground">Height:</span>
        <span className="font-medium">{patientInfo?.height}</span>

        <span className="text-muted-foreground">Weight:</span>
        <span className="font-medium">{patientInfo?.weight}</span>
      </div>

      <div className="pt-2">
        <span className="text-muted-foreground">Allergies:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {patientInfo?.allergies.map((allergy) => (
            <span
              key={allergy}
              className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-0.5 rounded-full"
            >
              {allergy}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
