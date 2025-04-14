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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

// Sample risk data
const riskTrendData = [
  { month: "Jan", risk: 0.42 },
  { month: "Feb", risk: 0.38 },
  { month: "Mar", risk: 0.45 },
  { month: "Apr", risk: 0.51 },
  { month: "May", risk: 0.48 },
  { month: "Jun", risk: 0.52 },
]

const biomarkerData = [
  { name: "KRAS Mutation", value: 35 },
  { name: "EGFR Mutation", value: 25 },
  { name: "ALK Fusion", value: 15 },
  { name: "BRAF Mutation", value: 20 },
  { name: "Other", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const patientRiskData = [
  { id: 1, patientId: "PT-10045", riskScore: 0.78, biomarkers: ["KRAS G12D", "TP53 R175H"], status: "High Risk" },
  { id: 2, patientId: "PT-10046", riskScore: 0.45, biomarkers: ["EGFR L858R"], status: "Medium Risk" },
  { id: 3, patientId: "PT-10047", riskScore: 0.23, biomarkers: ["ALK Fusion"], status: "Low Risk" },
  { id: 4, patientId: "PT-10048", riskScore: 0.67, biomarkers: ["BRAF V600E", "PIK3CA E545K"], status: "High Risk" },
  { id: 5, patientId: "PT-10049", riskScore: 0.32, biomarkers: ["NRAS Q61K"], status: "Medium Risk" },
]

export { RiskAnalytics }

export default function RiskAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tumor Risk Analytics</h2>
          <p className="text-muted-foreground">AI-powered risk assessment using chaotic predictors</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Clock className="mr-1 h-3 w-3" /> Updated 2 hours ago
          </Badge>
          <Button>Run New Analysis</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="biomarkers">Biomarker Analysis</TabsTrigger>
          <TabsTrigger value="patients">Patient Risk Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
                <CardDescription>6-month trend of tumor risk predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ChartTooltipProvider>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={riskTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 1]} tickFormatter={(value) => `${value * 100}%`} />
                        <ChartTooltip>
                          {({ active, payload }: any) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent>
                                  <div className="font-medium">{payload[0].payload.month}</div>
                                  <div>Risk Score: {((payload[0].value as number) * 100).toFixed(1)}%</div>
                                </ChartTooltipContent>
                              )
                            }
                            return null
                          }}
                        </ChartTooltip>
                        <Area
                          type="monotone"
                          dataKey="risk"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#riskGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartTooltipProvider>
                </ChartContainer>
                <div className="mt-4">
                  <ChartLegend className="justify-center">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Risk Score Trend</span>
                    </div>
                  </ChartLegend>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current patient risk distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "High Risk", value: 35 },
                            { name: "Medium Risk", value: 45 },
                            { name: "Low Risk", value: 20 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#ef4444" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#10b981" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-2 grid w-full grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-xs">High</span>
                      </div>
                      <span className="text-lg font-bold">35%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs">Medium</span>
                      </div>
                      <span className="text-lg font-bold">45%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs">Low</span>
                      </div>
                      <span className="text-lg font-bold">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Top contributing factors to risk scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">KRAS Mutation</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      High Impact
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">TP53 Mutation</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      High Impact
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">EGFR Mutation</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Medium Impact
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">BRAF Mutation</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Medium Impact
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm">ALK Fusion</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Low Impact
                    </Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>AI Model Performance</CardTitle>
                <CardDescription>Chaotic predictor model metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="mt-1 text-2xl font-bold">92.4%</div>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      <span>Above threshold</span>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Precision</div>
                    <div className="mt-1 text-2xl font-bold">89.7%</div>
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      <span>Above threshold</span>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">Recall</div>
                    <div className="mt-1 text-2xl font-bold">86.2%</div>
                    <div className="mt-2 flex items-center text-xs text-amber-600">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      <span>Needs improvement</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-md border p-4">
                  <h4 className="text-sm font-medium">Model Information</h4>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Model Version:</span> v2.4.1
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Last Trained:</span> 3 days ago
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Training Samples:</span> 12,458
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Features:</span> 128
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="biomarkers" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Biomarker Distribution</CardTitle>
                <CardDescription>Distribution of key biomarkers in patient population</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <ChartTooltipProvider>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={biomarkerData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {biomarkerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent>
                                  <div className="font-medium">{payload[0].name}</div>
                                  <div>{payload[0].value} patients</div>
                                </ChartTooltipContent>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartTooltipProvider>
                </ChartContainer>
                <div className="mt-4">
                  <ChartLegend className="justify-center">
                    {biomarkerData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </ChartLegend>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biomarker Risk Impact</CardTitle>
                <CardDescription>Impact of biomarkers on risk score</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {biomarkerData.map((biomarker, index) => (
                    <li key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{biomarker.name}</span>
                        <span className="text-sm">
                          {index === 0
                            ? "+0.35"
                            : index === 1
                              ? "+0.28"
                              : index === 2
                                ? "+0.22"
                                : index === 3
                                  ? "+0.31"
                                  : "+0.15"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width:
                              index === 0
                                ? "70%"
                                : index === 1
                                  ? "56%"
                                  : index === 2
                                    ? "44%"
                                    : index === 3
                                      ? "62%"
                                      : "30%",
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-md border p-3">
                  <h4 className="text-xs font-medium">Impact Interpretation</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Values represent the average increase in risk score when the biomarker is present. Higher values
                    indicate stronger correlation with adverse outcomes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Biomarker Correlation Analysis</CardTitle>
                <CardDescription>Correlation between biomarkers and clinical outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Biomarker</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Progression Risk</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Treatment Response</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Survival Impact</th>
                        <th className="whitespace-nowrap p-2 text-left text-sm font-medium">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="whitespace-nowrap p-2 text-sm font-medium">KRAS G12D</td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            High
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Poor
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Negative
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs">High</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="whitespace-nowrap p-2 text-sm font-medium">EGFR L858R</td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            Medium
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Good
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Positive
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs">High</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="whitespace-nowrap p-2 text-sm font-medium">BRAF V600E</td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            High
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            Variable
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Negative
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs">High</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="whitespace-nowrap p-2 text-sm font-medium">ALK Fusion</td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            Medium
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Good
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Positive
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs">High</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap p-2 text-sm font-medium">TP53 R175H</td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            High
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Poor
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            Negative
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                            <span className="text-xs">Medium</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <div className="space-y-6">
            {patientRiskData.map((patient) => (
              <Card key={patient.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Patient {patient.patientId}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        patient.status === "High Risk"
                          ? "bg-red-50 text-red-700"
                          : patient.status === "Medium Risk"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </div>
                  <CardDescription>AI-powered risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Risk Score</h4>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-full max-w-32 rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${patient.riskScore * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{(patient.riskScore * 100).toFixed(0)}%</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Based on genomic profile and clinical data</p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Biomarkers</h4>
                      <div className="flex flex-wrap gap-1">
                        {patient.biomarkers.map((biomarker) => (
                          <Badge key={biomarker} variant="secondary" className="text-xs">
                            {biomarker}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Detected genomic alterations</p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Recommendations</h4>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Targeted therapy assessment</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Monthly monitoring</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>Clinical trial eligibility</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      View Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
