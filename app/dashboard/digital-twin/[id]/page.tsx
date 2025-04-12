"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { PatientModelViewer } from "@/components/digital-twin/patient-model-viewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientInfoPanel } from "@/components/digital-twin/patient-info-panel"
import { ClinicalDataPanel } from "@/components/digital-twin/clinical-data-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Download, Lock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface DigitalTwinDetails {
  id: string
  name: string
  type: string
  lastAccessed: string
  createdAt: string
  status: "active" | "processing" | "archived"
  accessLevel: "full" | "limited" | "view-only"
  patientId: string
  modelType: "full-body" | "cardiac" | "neurological"
}

export default function DigitalTwinPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [twinDetails, setTwinDetails] = useState<DigitalTwinDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    // Simulate fetching digital twin details
    const fetchTwinDetails = async () => {
      // In a real app, this would fetch from an API
      setTimeout(() => {
        setTwinDetails({
          id: id as string,
          name: id === "dt-001" ? "Primary Digital Twin" : id === "dt-002" ? "Cardiac System" : "Neurological System",
          type: id === "dt-001" ? "Full Body Model" : "Specialized Model",
          lastAccessed: new Date().toISOString(),
          createdAt: "2022-11-22T09:15:00",
          status: "active",
          accessLevel: "full",
          patientId: "PT-12345",
          modelType: id === "dt-001" ? "full-body" : id === "dt-002" ? "cardiac" : "neurological",
        })
        setLoadingDetails(false)
      }, 1000)
    }

    if (isAuthenticated && id) {
      fetchTwinDetails()
    }
  }, [isAuthenticated, id])

  if (loading || loadingDetails) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (!twinDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-medium mb-2">Digital Twin Not Found</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          The requested digital twin could not be found or you don't have access to it.
        </p>
        <Button onClick={() => router.push("/dashboard/digital-twin-selector")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Digital Twins
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/digital-twin-selector")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{twinDetails.name}</h1>
            <Badge variant="outline" className="ml-2">
              {twinDetails.type}
            </Badge>
          </div>
          <p className="text-muted-foreground">Last accessed: {new Date(twinDetails.lastAccessed).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Lock className="h-4 w-4 mr-2" />
            Permissions
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <PatientModelViewer modelType={twinDetails.modelType} patientId={twinDetails.patientId} />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Demographics and basic info</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientInfoPanel patientId={twinDetails.patientId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Clinical Data</CardTitle>
              <CardDescription>Latest measurements and results</CardDescription>
            </CardHeader>
            <CardContent>
              <ClinicalDataPanel patientId={twinDetails.patientId} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Analysis & Insights</CardTitle>
          <CardDescription>AI-generated insights from patient data</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="pt-4">
              <p>
                {twinDetails.modelType === "full-body"
                  ? "Patient shows normal vital signs with slight elevation in blood pressure. No significant anomalies detected in the latest imaging studies. Genomic analysis indicates moderate risk for cardiovascular conditions."
                  : twinDetails.modelType === "cardiac"
                    ? "Cardiac function is within normal parameters. Left ventricular ejection fraction is 58%. Mild mitral valve regurgitation detected. Coronary arteries show minimal plaque buildup."
                    : "Brain structure appears normal with no evidence of lesions or abnormalities. Cognitive function tests indicate normal performance across all domains. No signs of neurodegeneration detected."}
              </p>
            </TabsContent>
            <TabsContent value="trends" className="pt-4">
              <p>
                {twinDetails.modelType === "full-body"
                  ? "Blood pressure has shown a gradual increase over the past 6 months. Weight has remained stable. Cholesterol levels have improved since the last visit, likely due to medication adherence."
                  : twinDetails.modelType === "cardiac"
                    ? "Heart rate variability has improved by 15% over the past 3 months. Blood pressure has stabilized within normal range. Exercise capacity has increased as evidenced by improved stress test results."
                    : "Cognitive performance has remained stable over the past year. Sleep patterns show improvement with increased REM sleep duration. Stress markers have decreased following implementation of mindfulness practices."}
              </p>
            </TabsContent>
            <TabsContent value="predictions" className="pt-4">
              <p>
                {twinDetails.modelType === "full-body"
                  ? "Based on current trends and genomic profile, the patient has a 15% increased risk of developing Type 2 Diabetes within the next 5 years. Recommended preventative measures include dietary adjustments and increased physical activity."
                  : twinDetails.modelType === "cardiac"
                    ? "Cardiac model predicts stable function with current medication regimen. Risk of major cardiac event in next 5 years is estimated at 8%, which is below average for the patient's age group. Continued adherence to current treatment plan is recommended."
                    : "Neurological model indicates low risk for cognitive decline over the next decade. Continued cognitive engagement through mental exercises and social interaction is recommended to maintain optimal brain health."}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
