"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PatientTrendsChart } from "@/components/visualizations/patient-trends-chart"
import { DiagnosisDistributionChart } from "@/components/visualizations/diagnosis-distribution-chart"
import { TreatmentOutcomesChart } from "@/components/visualizations/treatment-outcomes-chart"

export default function VisualizationsPage() {
  const [selectedDataSource, setSelectedDataSource] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("6m")

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Visualizations</h1>
      <p className="text-muted-foreground">Interactive charts and graphs for healthcare data analysis</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="dataSource">Data Source</Label>
          <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
            <SelectTrigger>
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="redox">Redox</SelectItem>
              <SelectItem value="fhir">FHIR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="timeRange">Time Range</Label>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/3 flex items-end">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Patient Trends</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis Distribution</TabsTrigger>
          <TabsTrigger value="outcomes">Treatment Outcomes</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Patient Trends Over Time</CardTitle>
              <CardDescription>Visualize patient data trends across different time periods</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <PatientTrendsChart dataSource={selectedDataSource} timeRange={selectedTimeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Distribution</CardTitle>
              <CardDescription>Distribution of diagnoses across patient population</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <DiagnosisDistributionChart dataSource={selectedDataSource} timeRange={selectedTimeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outcomes">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Outcomes</CardTitle>
              <CardDescription>Analyze treatment outcomes and effectiveness</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <TreatmentOutcomesChart dataSource={selectedDataSource} timeRange={selectedTimeRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
