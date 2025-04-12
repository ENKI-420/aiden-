"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Share2 } from "lucide-react"

// Sample reports data
const reports = [
  {
    id: "1",
    name: "Patient Demographics Report",
    description: "Overview of patient demographics and distribution",
    created: "2023-04-10T14:30:00",
    format: "PDF",
  },
  {
    id: "2",
    name: "Treatment Outcomes Analysis",
    description: "Analysis of treatment outcomes by diagnosis",
    created: "2023-04-08T09:15:00",
    format: "Excel",
  },
  {
    id: "3",
    name: "Data Completeness Audit",
    description: "Audit of data completeness across sources",
    created: "2023-04-05T16:45:00",
    format: "PDF",
  },
  {
    id: "4",
    name: "Monthly Patient Flow",
    description: "Analysis of patient admissions and discharges",
    created: "2023-04-01T11:20:00",
    format: "PDF",
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportType, setReportType] = useState("all")

  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (reportType === "all" || report.format.toLowerCase() === reportType.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <p className="text-muted-foreground">Generate and manage reports from your healthcare data</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="w-full sm:w-1/2">
          <Label htmlFor="search">Search Reports</Label>
          <Input
            id="search"
            placeholder="Search by report name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <Label htmlFor="reportType">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="existing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="existing">Existing Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate New Report</TabsTrigger>
        </TabsList>
        <TabsContent value="existing">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>View and download your generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell>
                        {new Date(report.created).toLocaleDateString()}{" "}
                        {new Date(report.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </TableCell>
                      <TableCell>{report.format}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Create a new report from your healthcare data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input id="reportName" placeholder="Enter report name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select defaultValue="patient">
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient Demographics</SelectItem>
                    <SelectItem value="treatment">Treatment Outcomes</SelectItem>
                    <SelectItem value="data">Data Completeness</SelectItem>
                    <SelectItem value="flow">Patient Flow</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataSource">Data Source</Label>
                <Select defaultValue="all">
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
              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
