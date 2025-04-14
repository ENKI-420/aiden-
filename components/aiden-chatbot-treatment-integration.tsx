"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Brain, Dna, Pill, Zap } from "lucide-react"
import AidenChatbot from "./aiden-chatbot"
import TreatmentRecommendation from "./treatment-recommendation"

interface AidenChatbotTreatmentIntegrationProps {
  patientId: string
}

export default function AidenChatbotTreatmentIntegration({ patientId }: AidenChatbotTreatmentIntegrationProps) {
  const [activeTab, setActiveTab] = useState("chat")

  const handleGenerateTreatmentPlan = () => {
    setActiveTab("treatment")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-blue-600" />
              AIDEN AI Assistant
            </CardTitle>
            <CardDescription>Advanced Intelligent Digital Entity for Nucleotide analysis</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Patient ID: {patientId}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="chat" className="flex-1">
              <Brain className="mr-2 h-4 w-4" />
              Chat with AIDEN
            </TabsTrigger>
            <TabsTrigger value="treatment" className="flex-1">
              <Pill className="mr-2 h-4 w-4" />
              Treatment Plan
            </TabsTrigger>
            <TabsTrigger value="genomics" className="flex-1">
              <Dna className="mr-2 h-4 w-4" />
              Genomic Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="p-0 border-0">
            <div className="p-4">
              <Alert className="mb-4">
                <Zap className="h-4 w-4" />
                <AlertTitle>AI Treatment Recommendations Available</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>AIDEN can generate personalized treatment recommendations based on genomic data.</span>
                  <Button size="sm" onClick={handleGenerateTreatmentPlan}>
                    Generate Treatment Plan
                  </Button>
                </AlertDescription>
              </Alert>

              <AidenChatbot patientId={patientId} />
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="p-4 border-0">
            <TreatmentRecommendation patientId={patientId} />
          </TabsContent>

          <TabsContent value="genomics" className="p-4 border-0">
            <div className="flex items-center justify-center h-[300px] border rounded-md">
              <div className="text-center">
                <Dna className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Genomic Analysis</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Detailed genomic analysis is available in the Genomic Analysis tab of the main dashboard.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
