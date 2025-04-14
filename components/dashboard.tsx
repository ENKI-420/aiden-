"use client"

import { useState } from "react"
import { MainNav } from "@/components/main-nav"
import { Sidebar } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ModeToggle } from "@/components/mode-toggle"
import { RiskAnalytics } from "@/components/risk-analytics"
import { FederatedLearning } from "@/components/federated-learning"
import { DigitalTwin } from "@/components/digital-twin"
import { MutationAnalysis } from "@/components/mutation-analysis"
import { ResearchDashboard } from "@/components/research-dashboard"
import { AdvancedResearchTools } from "@/components/advanced-research-tools"
import { BatchAnalysis } from "@/components/batch-analysis"
import { Genomic3DModelGenerator } from "@/components/genomic-3d-model-generator"

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background antialiased">
      <Sidebar className="bg-secondary border-r">
        <div className="flex flex-col h-full">
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold">AIDEN Dashboard</h1>
          </div>
          <MainNav />
          <div className="mt-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <ModeToggle />
            </div>
          </div>
        </div>
      </Sidebar>
      <div className="flex-1 p-6">
        <RiskAnalytics />
        <FederatedLearning />
        <DigitalTwin />
        <MutationAnalysis />
        <ResearchDashboard />
        <AdvancedResearchTools />
        <BatchAnalysis />
        <Genomic3DModelGenerator />
      </div>
    </div>
  )
}
