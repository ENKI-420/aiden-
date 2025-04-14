"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Brain, Search, User, Dna, Pill, FlaskRoundIcon as Flask } from "lucide-react"
import AidenChatbot from "./aiden-chatbot"
import TreatmentRecommendation from "./treatment-recommendation"

interface AidenDashboardProps {
  patientId?: string
}

export default function AidenDashboard({ patientId = "patient-1" }: AidenDashboardProps) {
  const [activePatientId, setActivePatientId] = useState(patientId)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would search for patients
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AIDEN Clinical Dashboard</h2>
          <p className="text-muted-foreground">AI-powered clinical decision support for precision oncology</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <Button variant="outline" className="gap-1">
            <User className="h-4 w-4" />
            <span>Patient: {activePatientId}</span>
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="treatment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="treatment">
            <Pill className="mr-2 h-4 w-4" />
            Treatment Recommendations
          </TabsTrigger>
          <TabsTrigger value="genomics">
            <Dna className="mr-2 h-4 w-4" />
            Genomic Analysis
          </TabsTrigger>
          <TabsTrigger value="trials">
            <Flask className="mr-2 h-4 w-4" />
            Clinical Trials
          </TabsTrigger>
          <TabsTrigger value="aiden">
            <Brain className="mr-2 h-4 w-4" />
            AIDEN Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treatment" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patient Overview</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">John Doe</div>
                <p className="text-xs text-muted-foreground">ID: {activePatientId}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-medium">58</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">Male</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diagnosis</p>
                    <p className="font-medium">NSCLC</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stage</p>
                    <p className="font-medium">IIIB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Key Mutations</CardTitle>
                <Dna className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">EGFR Exon 19 del</div>
                      <p className="text-xs text-muted-foreground">Pathogenic</p>
                    </div>
                    <div className="text-sm font-bold text-green-600">Actionable</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">TP53 R273H</div>
                      <p className="text-xs text-muted-foreground">Pathogenic</p>
                    </div>
                    <div className="text-sm font-bold text-amber-600">Prognostic</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Treatment</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium">Osimertinib</div>
                    <p className="text-xs text-muted-foreground">80mg daily, started 3 months ago</p>
                  </div>
                  <Separator />
                  <div className="mt-4">
                    <div className="text-sm text-muted-foreground">Response Assessment</div>
                    <div className="font-medium text-green-600">Partial Response (-30%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <TreatmentRecommendation patientId={activePatientId} />
        </TabsContent>

        <TabsContent value="genomics">
          <Card>
            <CardHeader>
              <CardTitle>Genomic Analysis</CardTitle>
              <CardDescription>Comprehensive genomic profiling and interpretation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <div className="text-center">
                  <Dna className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Genomic Viewer</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    Detailed genomic analysis is available in the Genomic Analysis tab of the main dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trials">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Trials Matching</CardTitle>
              <CardDescription>AI-matched clinical trials based on patient's genomic profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] border rounded-md">
                <div className="text-center">
                  <Flask className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Clinical Trials</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    View matched clinical trials in the Treatment Recommendations tab.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aiden">
          <AidenChatbot patientId={activePatientId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
