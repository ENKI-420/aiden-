"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Brain, Dna, RefreshCw, FileDown, Clock, BarChart } from "lucide-react"
import { useFHIRClient } from "@/lib/fhir-client"
import DigitalBioModelsGallery from "./digital-bio-models-gallery"

interface DigitalTwinProps {
  mutationData?: any[]
}

export default function DigitalTwin({ mutationData = [] }: DigitalTwinProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPatient, setSelectedPatient] = useState("PT-10045")
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [simulationResults, setSimulationResults] = useState<any | null>(null)
  const [selectedTreatment, setSelectedTreatment] = useState("vemurafenib")
  const [timeframe, setTimeframe] = useState("12")
  const [simulationType, setSimulationType] = useState("treatment")

  // Use the FHIR client
  const { client, isLoading: isClientLoading } = useFHIRClient(true)
  const [patientInfo, setPatientInfo] = useState<any | null>(null)
  const [conditionsData, setConditionsData] = useState<any[]>([])
  const [medicationsData, setMedicationsData] = useState<any[]>([])
  const [genomicData, setGenomicData] = useState<any[]>([])
  const [isLoadingPatient, setIsLoadingPatient] = useState(false)

  // Load patient data
  useEffect(() => {
    if (!client || !selectedPatient) return

    // Set loading state
    setIsLoadingPatient(true)

    // Define async function to fetch patient info
    const fetchPatientInfo = async () => {
      try {
        const patientResult = await client.getPatient(selectedPatient)
        setPatientInfo(patientResult)
      } catch (error) {
        console.error("Error loading patient info:", error)
      }
    }

    // Define async function to fetch conditions
    const fetchConditions = async () => {
      try {
        const conditionsResult = await client.getConditions(selectedPatient)
        setConditionsData(conditionsResult)
      } catch (error) {
        console.error("Error loading conditions:", error)
      }
    }

    // Define async function to fetch medications
    const fetchMedications = async () => {
      try {
        // Directly set the state with the result - no intermediate variables
        setMedicationsData(await client.getMedicationRequests(selectedPatient))
      } catch (error) {
        console.error("Error loading medications:", error)
      }
    }

    // Define async function to fetch genomic data - FIXED to avoid reassignment
    const fetchGenomicData = async () => {
      try {
        // Check if we have mutation data from props first
        if (mutationData && mutationData.length > 0) {
          // Use the mutation data from props
          setGenomicData([...mutationData])
        } else {
          // Fetch from API and set state directly
          const result = await client.getGenomicData(selectedPatient)
          setGenomicData(result)
        }
      } catch (error) {
        console.error("Error loading genomic data:", error)
        // Set empty array on error to avoid undefined errors
        setGenomicData([])
      }
    }

    // Execute all fetch operations and set loading to false when done
    Promise.all([
      fetchPatientInfo().catch(() => {}),
      fetchConditions().catch(() => {}),
      fetchMedications().catch(() => {}),
      fetchGenomicData().catch(() => {}),
    ]).finally(() => {
      setIsLoadingPatient(false)
    })
  }, [client, selectedPatient, mutationData])

  // Run simulation
  const runSimulation = () => {
    setSimulationRunning(true)
    setSimulationProgress(0)

    // Reset previous results
    setSimulationResults(null)

    // Simulate progress
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setSimulationRunning(false)

          // Generate simulation results
          const results = generateSimulationResults()
          setSimulationResults(results)

          return 100
        }
        return prev + 2
      })
    }, 200)
  }

  // Generate simulation results based on patient data and selected options
  const generateSimulationResults = () => {
    // Use mutation data to influence simulation results
    const relevantMutations = genomicData.length > 0 ? genomicData : mutationData

    // Calculate average RAScore
    const avgRascore =
      relevantMutations.reduce((acc: number, mut: any) => acc + mut.rascore, 0) / (relevantMutations.length || 1)

    // Treatment response is inversely related to RAScore
    const responseRate = Math.max(10, Math.min(95, 100 - avgRascore * 100))

    // Calculate progression-free survival based on treatment and RAScore
    let pfsMonths = 12
    if (selectedTreatment === "vemurafenib") {
      pfsMonths = 7 - avgRascore * 5
    } else if (selectedTreatment === "dabrafenib") {
      pfsMonths = 8 - avgRascore * 5
    } else if (selectedTreatment === "trametinib") {
      pfsMonths = 6 - avgRascore * 4
    } else if (selectedTreatment === "combo") {
      pfsMonths = 11 - avgRascore * 6
    }

    // Ensure PFS is within reasonable bounds
    pfsMonths = Math.max(2, Math.min(18, pfsMonths))

    // Calculate response distribution
    const completeResponse = responseRate * 0.3
    const partialResponse = responseRate * 0.7
    const stableDisease = (100 - responseRate) * 0.8
    const progressiveDisease = (100 - responseRate) * 0.2

    // Calculate resistance risk factors
    const resistanceFactors = [
      {
        name: "MEK Pathway Activation",
        risk: avgRascore * 100,
        description: "Secondary activation of the MEK pathway can bypass BRAF inhibition.",
      },
      {
        name: "NRAS Secondary Mutation",
        risk: avgRascore * 70,
        description: "Secondary NRAS mutations can develop, leading to resistance.",
      },
      {
        name: "PI3K Pathway Activation",
        risk: avgRascore * 50,
        description: "Activation of the PI3K pathway can provide an alternate growth signal.",
      },
    ]

    return {
      overallResponse: responseRate,
      responseDistribution: {
        completeResponse,
        partialResponse,
        stableDisease,
        progressiveDisease,
      },
      progressionFree: {
        months: pfsMonths,
        probability: 100 - avgRascore * 100,
      },
      resistanceFactors,
      keyFindings: [
        relevantMutations.some((m: any) => m.gene === "BRAF" && m.mutation === "V600E")
          ? "BRAF V600E mutation is highly responsive to targeted therapy"
          : "No BRAF V600E mutation detected",
        relevantMutations.some((m: any) => m.gene === "TP53")
          ? "Secondary TP53 mutation may reduce overall response"
          : "No TP53 mutations detected",
        avgRascore > 0.7
          ? "High RAScore indicates increased risk of treatment resistance"
          : "Moderate RAScore suggests standard response to therapy",
      ],
      recommendations: [
        selectedTreatment === "combo"
          ? "Combination therapy is optimal for this genomic profile"
          : "Consider combination therapy to delay resistance development",
        `Monthly monitoring recommended for the first ${Math.ceil(pfsMonths / 2)} months`,
        "Consider ctDNA testing to detect early resistance markers",
      ],
    }
  }

  // Format patient name
  const getPatientName = () => {
    if (patientInfo) {
      const name = patientInfo.name?.[0]
      if (name) {
        return `${name.given?.[0] || ""} ${name.family || ""}`.trim()
      }
    }
    return selectedPatient
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Digital Twin</h2>
          <p className="text-muted-foreground">Genomic-driven patient-specific modeling</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PT-10045">PT-10045 (John Doe)</SelectItem>
              <SelectItem value="PT-10046">PT-10046 (Jane Smith)</SelectItem>
              <SelectItem value="PT-10047">PT-10047 (Robert Johnson)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runSimulation} disabled={simulationRunning}>
            {simulationRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Simulating...
              </>
            ) : (
              "Run New Simulation"
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Brain className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="genomic">
            <Dna className="mr-2 h-4 w-4" />
            Genomic Profile
          </TabsTrigger>
          <TabsTrigger value="simulation">
            <BarChart className="mr-2 h-4 w-4" />
            Simulation Results
          </TabsTrigger>
          <TabsTrigger value="3d-models">
            <Dna className="mr-2 h-4 w-4" />
            3D Models
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 dark:border-slate-700">
              <CardHeader>
                <CardTitle>Digital Twin Visualization</CardTitle>
                <CardDescription>
                  3D model of patient's genomic profile and predicted treatment response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md border bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900 dark:border-slate-700 flex items-center justify-center">
                  {isLoadingPatient || isClientLoading ? (
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 mx-auto text-primary animate-spin" />
                      <p className="mt-4 text-sm text-muted-foreground">Loading patient data...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Brain className="h-24 w-24 mx-auto text-primary animate-pulse" />
                      <h3 className="mt-4 text-lg font-medium">
                        {selectedPatient} Digital Twin
                        {patientInfo && ` (${getPatientName()})`}
                      </h3>
                      <p className="text-sm text-muted-foreground">Genomic profile-based simulation model</p>

                      {simulationResults && (
                        <div className="mt-6 flex justify-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {Math.round(simulationResults.overallResponse)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Treatment Response</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                              {Math.round(simulationResults.progressionFree.probability)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Progression-Free</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {simulationResults.progressionFree.months.toFixed(1)}
                            </div>
                            <p className="text-xs text-muted-foreground">Median PFS (months)</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:border-slate-700">
              <CardHeader>
                <CardTitle>Simulation Controls</CardTitle>
                <CardDescription>Configure and run digital twin simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-id">Patient ID</Label>
                    <Input id="patient-id" value={selectedPatient} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="simulation-type">Simulation Type</Label>
                    <Select value={simulationType} onValueChange={setSimulationType}>
                      <SelectTrigger id="simulation-type">
                        <SelectValue placeholder="Select simulation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="treatment">Treatment Response</SelectItem>
                        <SelectItem value="progression">Disease Progression</SelectItem>
                        <SelectItem value="resistance">Resistance Development</SelectItem>
                        <SelectItem value="combination">Combination Therapy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatment">Treatment</Label>
                    <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                      <SelectTrigger id="treatment">
                        <SelectValue placeholder="Select treatment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vemurafenib">Vemurafenib</SelectItem>
                        <SelectItem value="dabrafenib">Dabrafenib</SelectItem>
                        <SelectItem value="trametinib">Trametinib</SelectItem>
                        <SelectItem value="combo">Dabrafenib + Trametinib</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Simulation Timeframe</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {simulationRunning && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Simulation Progress</Label>
                        <span className="text-xs text-muted-foreground">{simulationProgress}%</span>
                      </div>
                      <Progress value={simulationProgress} />
                    </div>
                  )}

                  <Button className="w-full" onClick={runSimulation} disabled={simulationRunning}>
                    {simulationRunning ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      "Run Simulation"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="genomic" className="mt-6">
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Patient Genomic Profile</CardTitle>
              <CardDescription>Genomic mutations and their clinical significance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPatient || isClientLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
                  <span>Loading genomic data...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-md border dark:border-slate-700">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Gene</TableHead>
                          <TableHead>Mutation</TableHead>
                          <TableHead>Chromosome</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-right">RAScore</TableHead>
                          <TableHead>Stability</TableHead>
                          <TableHead>Clinical Significance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {genomicData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No genomic data available.
                            </TableCell>
                          </TableRow>
                        ) : (
                          genomicData.map((mutation: any) => (
                            <TableRow key={mutation.id}>
                              <TableCell className="font-medium">{mutation.gene}</TableCell>
                              <TableCell>{mutation.mutation}</TableCell>
                              <TableCell>{mutation.chromosome}</TableCell>
                              <TableCell>{mutation.position}</TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant="outline"
                                  className={
                                    mutation.rascore > 0.8
                                      ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                                      : mutation.rascore > 0.6
                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                        : "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  }
                                >
                                  {mutation.rascore.toFixed(2)}
                                </Badge>
                              </TableCell>
                              <TableCell>{mutation.stability}</TableCell>
                              <TableCell>{mutation.clinicalSignificance}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-md border p-4 dark:border-slate-700">
                      <h3 className="text-sm font-medium">Associated Cancer Types</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Array.from(new Set(genomicData.flatMap((m: any) => m.cancerTypes || []))).map(
                          (cancer: string) => (
                            <Badge key={cancer} variant="secondary">
                              {cancer}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="rounded-md border p-4 dark:border-slate-700">
                      <h3 className="text-sm font-medium">Recommended Therapies</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Array.from(new Set(genomicData.flatMap((m: any) => m.drugs || []))).map((drug: string) => (
                          <Badge
                            key={drug}
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            {drug}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="mt-6">
          {!simulationResults ? (
            <Card className="dark:border-slate-700">
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
                <CardDescription>Run a simulation to see results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-40 items-center justify-center">
                  <div className="text-center">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4">No simulation results available. Run a simulation to see results.</p>
                    <Button className="mt-4" onClick={runSimulation} disabled={simulationRunning}>
                      {simulationRunning ? "Simulating..." : "Run Simulation"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Treatment Response Prediction</CardTitle>
                    <CardDescription>AI-predicted response to selected therapy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Response Probability</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {Math.round(simulationResults.overallResponse)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${simulationResults.overallResponse}%` }}
                        ></div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Complete Response</span>
                            <span>{Math.round(simulationResults.responseDistribution.completeResponse)}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full rounded-full bg-green-600"
                              style={{ width: `${simulationResults.responseDistribution.completeResponse}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Partial Response</span>
                            <span>{Math.round(simulationResults.responseDistribution.partialResponse)}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{ width: `${simulationResults.responseDistribution.partialResponse}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Stable Disease</span>
                            <span>{Math.round(simulationResults.responseDistribution.stableDisease)}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{ width: `${simulationResults.responseDistribution.stableDisease}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Progressive Disease</span>
                            <span>{Math.round(simulationResults.responseDistribution.progressiveDisease)}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full rounded-full bg-red-500"
                              style={{ width: `${simulationResults.responseDistribution.progressiveDisease}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md bg-muted p-3 dark:bg-slate-800">
                        <h4 className="text-sm font-medium">Key Factors</h4>
                        <ul className="mt-2 space-y-1 text-xs">
                          {simulationResults.keyFindings.map((finding: string, index: number) => (
                            <li key={index} className="flex items-start gap-1">
                              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:border-slate-700">
                  <CardHeader>
                    <CardTitle>Resistance Development</CardTitle>
                    <CardDescription>Predicted timeline for treatment resistance</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Median Time to Progression</span>
                        <span className="font-bold">{simulationResults.progressionFree.months.toFixed(1)} months</span>
                      </div>

                      <div className="relative pt-6">
                        <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>6</span>
                          <span>12</span>
                          <span>18</span>
                          <span>24 months</span>
                        </div>

                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(simulationResults.progressionFree.months / 24) * 100}%` }}
                          ></div>
                        </div>

                        <div
                          className="absolute top-6 h-4 w-0.5 bg-primary"
                          style={{ left: `${(simulationResults.progressionFree.months / 24) * 100}%` }}
                        ></div>
                        <div
                          className="absolute top-10 transform -translate-x-1/2 text-xs font-medium text-primary"
                          style={{ left: `${(simulationResults.progressionFree.months / 24) * 100}%` }}
                        >
                          {simulationResults.progressionFree.months.toFixed(1)} months
                        </div>
                      </div>

                      <div className="mt-10 space-y-3">
                        {simulationResults.resistanceFactors.map((factor: any, index: number) => (
                          <div key={index}>
                            <div className="flex items-center justify-between text-sm">
                              <span>{factor.name}</span>
                              <span>{factor.risk > 70 ? "High" : factor.risk > 40 ? "Medium" : "Low"} Risk</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`h-full rounded-full ${
                                  factor.risk > 70 ? "bg-red-500" : factor.risk > 40 ? "bg-amber-500" : "bg-green-500"
                                }`}
                                style={{ width: `${factor.risk}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{factor.description}</p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-md bg-muted p-3 dark:bg-slate-800">
                        <h4 className="text-sm font-medium">Resistance Mitigation</h4>
                        <ul className="mt-2 space-y-1 text-xs">
                          {simulationResults.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-1">
                              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6 dark:border-slate-700">
                <CardHeader>
                  <CardTitle>Simulation Summary</CardTitle>
                  <CardDescription>
                    {selectedTreatment === "combo"
                      ? "Dabrafenib + Trametinib"
                      : selectedTreatment.charAt(0).toUpperCase() + selectedTreatment.slice(1)}
                    treatment simulation over {timeframe} months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Based on the patient's genomic profile, the digital twin simulation predicts an overall response
                      rate of {Math.round(simulationResults.overallResponse)}% to
                      {selectedTreatment === "combo"
                        ? " combination therapy with Dabrafenib + Trametinib"
                        : ` ${selectedTreatment.charAt(0).toUpperCase() + selectedTreatment.slice(1)}`}
                      . The median progression-free survival is estimated at{" "}
                      {simulationResults.progressionFree.months.toFixed(1)} months.
                    </p>

                    <p className="text-sm">
                      The simulation indicates that{" "}
                      {Math.round(
                        simulationResults.responseDistribution.completeResponse +
                          simulationResults.responseDistribution.partialResponse,
                      )}
                      % of patients with this genomic profile would experience either complete or partial response,
                      while {Math.round(simulationResults.responseDistribution.stableDisease)}% would have stable
                      disease and {Math.round(simulationResults.responseDistribution.progressiveDisease)}% would
                      experience progressive disease despite treatment.
                    </p>

                    <p className="text-sm">
                      The primary resistance mechanism is predicted to be {simulationResults.resistanceFactors[0].name},
                      with a {simulationResults.resistanceFactors[0].risk > 70 ? "high" : "moderate"} risk of
                      development.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button onClick={runSimulation} disabled={simulationRunning}>
                    {simulationRunning ? "Simulating..." : "Run New Simulation"}
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
        <TabsContent value="3d-models" className="mt-6">
          <DigitalBioModelsGallery mutations={genomicData} patientId={selectedPatient} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { DigitalTwin }
