"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { DownloadIcon, PlusCircleIcon, ArrowUpDown, ExternalLinkIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Genomic3DViewer from "./genomic-3d-viewer"

// Types for our genomic data
type AlterationType = "mutation" | "amplification" | "deletion" | "none"

interface GeneAlteration {
  type: AlterationType
  patientId: string
  details?: string
}

interface GeneData {
  name: string
  alterations: GeneAlteration[]
  mutationRate: number
}

// Sample data based on the image
const sampleGeneData: GeneData[] = [
  {
    name: "KRAS",
    mutationRate: 43,
    alterations: [
      ...Array(42).fill({ type: "mutation", patientId: "TCGA-XX-XXXX" }),
      { type: "amplification", patientId: "TCGA-XX-XXXX" },
      ...Array(57).fill({ type: "none", patientId: "TCGA-XX-XXXX" }),
    ],
  },
  {
    name: "NRAS",
    mutationRate: 10,
    alterations: [
      ...Array(10).fill({ type: "mutation", patientId: "TCGA-XX-XXXX" }),
      ...Array(90).fill({ type: "none", patientId: "TCGA-XX-XXXX" }),
    ],
  },
  {
    name: "BRAF",
    mutationRate: 3,
    alterations: [
      ...Array(3).fill({ type: "mutation", patientId: "TCGA-XX-XXXX" }),
      ...Array(97).fill({ type: "none", patientId: "TCGA-XX-XXXX" }),
    ],
  },
]

// Color mapping for different alteration types
const alterationColors = {
  mutation: "bg-green-500",
  amplification: "bg-red-500",
  deletion: "bg-blue-500",
  none: "bg-gray-200",
}

// Create the component as a function
function GenomicViewerComponent() {
  const [geneData, setGeneData] = useState<GeneData[]>(sampleGeneData)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Function to sort genes by mutation rate
  const sortByMutationRate = () => {
    const sorted = [...geneData].sort((a, b) => b.mutationRate - a.mutationRate)
    setGeneData(sorted)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Genomic Viewer</h2>
          <p className="text-muted-foreground">Interactive 3D genomic visualization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="3d-view">
        <TabsList>
          <TabsTrigger value="3d-view">3D View</TabsTrigger>
          <TabsTrigger value="linear-view">Linear View</TabsTrigger>
          <TabsTrigger value="sequence">Sequence</TabsTrigger>
          <TabsTrigger value="table-view">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="3d-view">
          <Genomic3DViewer />
        </TabsContent>
        <TabsContent value="linear-view">
          <Card>
            <CardHeader>
              <CardTitle>Linear Genomic View</CardTitle>
              <CardDescription>Linear representation of the genomic structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full rounded-md border bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Linear view placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sequence">
          <Card>
            <CardHeader>
              <CardTitle>Sequence View</CardTitle>
              <CardDescription>Nucleotide sequence with annotations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full rounded-md border bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Sequence view placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table-view">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Genomic Alterations</CardTitle>
                  <CardDescription>Visualizing genetic mutations across patient samples</CardDescription>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <PlusCircleIcon className="h-4 w-4 mr-2" />
                          Clinical Tracks
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add clinical data tracks</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <PlusCircleIcon className="h-4 w-4 mr-2" />
                          Heatmap Tracks
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add heatmap visualization</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button variant="outline" size="sm" onClick={sortByMutationRate}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>PDF</DropdownMenuItem>
                      <DropdownMenuItem>PNG</DropdownMenuItem>
                      <DropdownMenuItem>SVG</DropdownMenuItem>
                      <DropdownMenuItem>Data</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2 w-24">Gene</th>
                      <th className="text-left p-2 w-24">% Altered</th>
                      <th className="text-left p-2">Genetic Alterations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geneData.map((gene) => (
                      <tr key={gene.name} className="border-t">
                        <td className="p-2 font-medium">{gene.name}</td>
                        <td className="p-2">{gene.mutationRate}%</td>
                        <td className="p-2">
                          <div className="flex h-6">
                            {gene.alterations.map((alteration, index) => (
                              <div
                                key={index}
                                className={`${alterationColors[alteration.type]} h-full w-1`}
                                title={`${alteration.type === "none" ? "No alteration" : alteration.type} - Patient ${alteration.patientId}`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <div className={`${alterationColors.mutation} h-4 w-4 mr-2`}></div>
                    <span>Mutation</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${alterationColors.amplification} h-4 w-4 mr-2`}></div>
                    <span>Amplification</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`${alterationColors.deletion} h-4 w-4 mr-2`}></div>
                    <span>Deletion</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="ml-auto">
                Open in Oncoprinter
                <ExternalLinkIcon className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Export as both named and default export
export { GenomicViewerComponent as GenomicViewer }
export default GenomicViewerComponent
