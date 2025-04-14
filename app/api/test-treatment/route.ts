import { type NextRequest, NextResponse } from "next/server"
import { generateMockTreatmentPlan } from "@/lib/treatment-recommendation"

export async function GET(request: NextRequest) {
  try {
    // Generate mock treatment data for a test patient
    const treatmentData = generateMockTreatmentPlan("patient-1")

    return NextResponse.json(treatmentData)
  } catch (error) {
    console.error("Error in test treatment endpoint:", error)
    return NextResponse.json({ error: "Failed to generate test treatment data" }, { status: 500 })
  }
}
