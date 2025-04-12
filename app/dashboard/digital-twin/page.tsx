import { PatientModelViewer } from "@/components/digital-twin/patient-model-viewer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientInfoPanel } from "@/components/digital-twin/patient-info-panel"
import { ClinicalDataPanel } from "@/components/digital-twin/clinical-data-panel"

export default function DigitalTwinPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Patient Digital Twin</h1>
      <p className="text-muted-foreground">Interactive 3D visualization of patient data</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <PatientModelViewer />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Demographics and basic info</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientInfoPanel patientId="PT-12345" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Clinical Data</CardTitle>
              <CardDescription>Latest measurements and results</CardDescription>
            </CardHeader>
            <CardContent>
              <ClinicalDataPanel patientId="PT-12345" />
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
                Patient shows normal vital signs with slight elevation in blood pressure. No significant anomalies
                detected in the latest imaging studies. Genomic analysis indicates moderate risk for cardiovascular
                conditions.
              </p>
            </TabsContent>
            <TabsContent value="trends" className="pt-4">
              <p>
                Blood pressure has shown a gradual increase over the past 6 months. Weight has remained stable.
                Cholesterol levels have improved since the last visit, likely due to medication adherence.
              </p>
            </TabsContent>
            <TabsContent value="predictions" className="pt-4">
              <p>
                Based on current trends and genomic profile, the patient has a 15% increased risk of developing Type 2
                Diabetes within the next 5 years. Recommended preventative measures include dietary adjustments and
                increased physical activity.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
