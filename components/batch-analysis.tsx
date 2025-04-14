"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Beaker, FileUp, Download, Play, Loader2 } from "lucide-react"

function BatchAnalysis() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("queue")

  const handleStartBatch = () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate batch processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 5
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Batch Analysis</h2>
          <p className="text-muted-foreground">Process multiple genomic samples in parallel</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileUp className="h-4 w-4" />
            <span>Upload Samples</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export Results</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Batch Queue</CardTitle>
              <CardDescription>Samples waiting to be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Melanoma Cohort - BRAF Analysis</h3>
                      <p className="text-sm text-muted-foreground">48 samples • Added 2 hours ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">High Priority</Badge>
                      <Button size="sm" onClick={handleStartBatch} disabled={isProcessing}>
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Lung Cancer Panel - EGFR Mutations</h3>
                      <p className="text-sm text-muted-foreground">36 samples • Added 5 hours ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Normal Priority</Badge>
                      <Button size="sm" disabled={isProcessing}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Colorectal Cancer - MSI Analysis</h3>
                      <p className="text-sm text-muted-foreground">24 samples • Added 1 day ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Low Priority</Badge>
                      <Button size="sm" disabled={isProcessing}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Processing</CardTitle>
              <CardDescription>Currently running batch analyses</CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Melanoma Cohort - BRAF Analysis</h3>
                        <p className="text-sm text-muted-foreground">48 samples • Started just now</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        In Progress
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress: {progress}%</span>
                        <span>{Math.floor((progress / 100) * 48)} / 48 samples</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Beaker className="h-3 w-3" />
                        <span>Estimated time remaining: {Math.ceil((100 - progress) / 5) * 0.5} minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No batch analyses currently running</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>Finished batch analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Breast Cancer - HER2 Analysis</h3>
                      <p className="text-sm text-muted-foreground">72 samples • Completed 1 day ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Complete
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Summary:</span> 18 HER2+ samples identified (25%)
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Prostate Cancer - AR-V7 Screening</h3>
                      <p className="text-sm text-muted-foreground">54 samples • Completed 3 days ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Complete
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Summary:</span> 12 AR-V7+ samples identified (22%)
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Lung Cancer - ALK Fusion Analysis</h3>
                      <p className="text-sm text-muted-foreground">42 samples • Completed 1 week ago</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Complete
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Summary:</span> 5 ALK fusion samples identified (12%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add both named export and default export
export { BatchAnalysis }
export default BatchAnalysis
