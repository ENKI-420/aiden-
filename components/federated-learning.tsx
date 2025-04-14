"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipProvider,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { CheckCircle2, Lock, Shield } from "lucide-react"

// Sample data
const modelPerformanceData = [
  { version: "v1.0", accuracy: 0.78, privacy: 0.92 },
  { version: "v1.5", accuracy: 0.82, privacy: 0.91 },
  { version: "v2.0", accuracy: 0.85, privacy: 0.93 },
  { version: "v2.2", accuracy: 0.87, privacy: 0.94 },
  { version: "v2.3", accuracy: 0.89, privacy: 0.94 },
  { version: "v2.4", accuracy: 0.92, privacy: 0.95 },
]

const institutionData = [
  { name: "Norton Healthcare", patients: 2450, status: "Active", lastSync: "2 hours ago" },
  { name: "Mayo Clinic", patients: 3120, status: "Active", lastSync: "1 hour ago" },
  { name: "Cleveland Clinic", patients: 2780, status: "Active", lastSync: "3 hours ago" },
  { name: "Johns Hopkins", patients: 2950, status: "Active", lastSync: "30 minutes ago" },
  { name: "MD Anderson", patients: 3240, status: "Active", lastSync: "1 hour ago" },
  { name: "Memorial Sloan Kettering", patients: 2890, status: "Active", lastSync: "2 hours ago" },
  { name: "UCSF Medical Center", patients: 2340, status: "Active", lastSync: "4 hours ago" },
  { name: "Massachusetts General", patients: 2670, status: "Active", lastSync: "3 hours ago" },
]

export default function FederatedLearning() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Secure Federated Learning</h2>
          <p className="text-muted-foreground">Privacy-preserving AI training across institutions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Network Healthy
          </Badge>
          <Button>Initiate Training Round</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Network Overview</TabsTrigger>
          <TabsTrigger value="performance">Model Performance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Federated Network Status</CardTitle>
                <CardDescription>Current status of participating institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Institution</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Patients</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Status</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Last Sync</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutionData.map((institution, index) => (
                        <tr key={index} className="border-b">
                          <td className="whitespace-nowrap p-2 text-sm font-medium">{institution.name}</td>
                          <td className="p-2 text-sm">{institution.patients.toLocaleString()}</td>
                          <td className="p-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {institution.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm">{institution.lastSync}</td>
                          <td className="p-2">
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Statistics</CardTitle>
                <CardDescription>Federated learning network metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Total Institutions</div>
                    <div className="mt-1 text-2xl font-bold">8</div>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      <span>All institutions active</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Total Patients</div>
                    <div className="mt-1 text-2xl font-bold">22,440</div>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      <span>+1,240 from last month</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Current Model</div>
                    <div className="mt-1 text-2xl font-bold">v2.4.1</div>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      <span>Updated 2 days ago</span>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Training Rounds</div>
                    <div className="mt-1 text-2xl font-bold">124</div>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      <span>Last round completed successfully</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Activity</CardTitle>
                <CardDescription>Recent federated learning training activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Training Round #124</h4>
                        <p className="text-xs text-muted-foreground">Completed 2 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Successful
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-2 md:grid-cols-4">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Institutions:</span> 8/8
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Duration:</span> 4.2 hours
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Accuracy Gain:</span> +1.2%
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Privacy Score:</span> 0.95
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Training Round #123</h4>
                        <p className="text-xs text-muted-foreground">Completed 9 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Successful
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-2 md:grid-cols-4">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Institutions:</span> 8/8
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Duration:</span> 3.8 hours
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Accuracy Gain:</span> +0.8%
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Privacy Score:</span> 0.94
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Training Round #122</h4>
                        <p className="text-xs text-muted-foreground">Completed 16 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        Partial
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-2 md:grid-cols-4">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Institutions:</span> 7/8
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Duration:</span> 5.1 hours
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Accuracy Gain:</span> +0.5%
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Privacy Score:</span> 0.94
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Model Performance Trend</CardTitle>
                <CardDescription>Accuracy and privacy metrics across model versions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ChartTooltipProvider>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={modelPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="version" />
                        <YAxis domain={[0.7, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <ChartTooltip>
                          {({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent>
                                  <div className="font-medium">{payload[0].payload.version}</div>
                                  <div>Accuracy: {((payload[0].value as number) * 100).toFixed(1)}%</div>
                                  <div>Privacy: {((payload[1].value as number) * 100).toFixed(1)}%</div>
                                </ChartTooltipContent>
                              )
                            }
                            return null
                          }}
                        </ChartTooltip>
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="privacy"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartTooltipProvider>
                </ChartContainer>
                <div className="mt-4">
                  <ChartLegend className="justify-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Model Accuracy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm">Privacy Score</span>
                    </div>
                  </ChartLegend>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Model Metrics</CardTitle>
                <CardDescription>Performance metrics for v2.4.1</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div className="h-full w-[92%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Precision</span>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div className="h-full w-[89%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recall</span>
                      <span className="text-sm font-medium">86%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div className="h-full w-[86%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">F1 Score</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div className="h-full w-[87%] rounded-full bg-primary"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privacy Score</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div className="h-full w-[95%] rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-md border p-3">
                  <h4 className="text-xs font-medium">Model Information</h4>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>v2.4.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Released:</span>
                      <span>2 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training Rounds:</span>
                      <span>124</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parameters:</span>
                      <span>128M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Institution Contributions</CardTitle>
                <CardDescription>Model performance improvement by institution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ChartTooltipProvider>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Norton", contribution: 0.018 },
                          { name: "Mayo", contribution: 0.022 },
                          { name: "Cleveland", contribution: 0.015 },
                          { name: "Johns Hopkins", contribution: 0.019 },
                          { name: "MD Anderson", contribution: 0.024 },
                          { name: "MSK", contribution: 0.017 },
                          { name: "UCSF", contribution: 0.014 },
                          { name: "Mass General", contribution: 0.016 },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                        <ChartTooltip>
                          {({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent>
                                  <div className="font-medium">{payload[0].payload.name}</div>
                                  <div>Contribution: {((payload[0].value as number) * 100).toFixed(1)}%</div>
                                </ChartTooltipContent>
                              )
                            }
                            return null
                          }}
                        </ChartTooltip>
                        <Bar dataKey="contribution" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartTooltipProvider>
                </ChartContainer>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Chart shows the percentage contribution to model accuracy improvement from each institution in the
                    most recent training round. Higher values indicate more significant contributions to the federated
                    model.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Compliance</CardTitle>
                <CardDescription>HIPAA & GDPR compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">HIPAA Compliance</h4>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Compliant
                      </Badge>
                      <span className="text-xs text-muted-foreground">Last audit: 14 days ago</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Data encryption at rest and in transit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Access controls and authentication</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Audit logging and monitoring</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Business Associate Agreements</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <h4 className="font-medium">GDPR Compliance</h4>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Compliant
                      </Badge>
                      <span className="text-xs text-muted-foreground">Last audit: 21 days ago</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Data minimization principles</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Purpose limitation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Data subject rights management</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Data Protection Impact Assessment</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy-Preserving Technologies</CardTitle>
                <CardDescription>Technologies used to ensure data privacy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Homomorphic Encryption</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enables computation on encrypted data without decryption, ensuring patient data never leaves the
                      institution in an unencrypted form.
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Implementation Status</span>
                        <span className="text-xs font-medium">100%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                        <div className="h-full w-full rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Differential Privacy</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Adds calibrated noise to model updates to prevent extraction of individual patient data while
                      maintaining statistical utility.
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Implementation Status</span>
                        <span className="text-xs font-medium">100%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                        <div className="h-full w-full rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">Secure Multi-Party Computation</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Allows institutions to jointly compute model updates without revealing their individual inputs to
                      other participants.
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Implementation Status</span>
                        <span className="text-xs font-medium">100%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                        <div className="h-full w-full rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Audit Log</CardTitle>
                <CardDescription>Recent privacy-related events and audits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Quarterly Privacy Audit</h4>
                        <p className="text-xs text-muted-foreground">Completed 14 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Passed
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">
                      Comprehensive audit of all privacy controls, data access logs, and compliance with HIPAA and GDPR
                      regulations. No issues found.
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Differential Privacy Parameter Update</h4>
                        <p className="text-xs text-muted-foreground">Completed 28 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        System Update
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">
                      Updated epsilon parameter in differential privacy algorithm to enhance privacy guarantees while
                      maintaining model utility.
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">External Security Assessment</h4>
                        <p className="text-xs text-muted-foreground">Completed 45 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Passed
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">
                      Third-party security assessment of federated learning infrastructure, encryption implementation,
                      and privacy-preserving technologies.
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Privacy Impact Assessment</h4>
                        <p className="text-xs text-muted-foreground">Completed 60 days ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Approved
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm">
                      Comprehensive assessment of privacy risks and mitigation strategies for the federated learning
                      network. All risks adequately addressed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { FederatedLearning }
