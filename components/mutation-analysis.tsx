"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Filter } from "lucide-react"

// Sample mutation data
const sampleMutations = [
  {
    id: "MUT001",
    gene: "BRAF",
    mutation: "V600E",
    type: "Missense",
    pathogenicity: "Pathogenic",
    frequency: 0.42,
    raScore: 0.89,
    clinicalSignificance: "Tier I - Strong Clinical Significance",
  },
  {
    id: "MUT002",
    gene: "KRAS",
    mutation: "G12D",
    type: "Missense",
    pathogenicity: "Pathogenic",
    frequency: 0.18,
    raScore: 0.76,
    clinicalSignificance: "Tier I - Strong Clinical Significance",
  },
  {
    id: "MUT003",
    gene: "TP53",
    mutation: "R175H",
    type: "Missense",
    pathogenicity: "Pathogenic",
    frequency: 0.12,
    raScore: 0.82,
    clinicalSignificance: "Tier I - Strong Clinical Significance",
  },
  {
    id: "MUT004",
    gene: "EGFR",
    mutation: "T790M",
    type: "Missense",
    pathogenicity: "Pathogenic",
    frequency: 0.08,
    raScore: 0.71,
    clinicalSignificance: "Tier II - Potential Clinical Significance",
  },
  {
    id: "MUT005",
    gene: "PIK3CA",
    mutation: "E545K",
    type: "Missense",
    pathogenicity: "Pathogenic",
    frequency: 0.06,
    raScore: 0.68,
    clinicalSignificance: "Tier II - Potential Clinical Significance",
  },
]

interface MutationAnalysisProps {
  onDataUpdate?: (data: any[]) => void
}

function MutationAnalysis({ onDataUpdate }: MutationAnalysisProps) {
  const [mutations, setMutations] = useState<any[]>([])
  const [selectedMutation, setSelectedMutation] = useState<any | null>(null)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setMutations(sampleMutations)
      if (onDataUpdate) {
        onDataUpdate(sampleMutations)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [onDataUpdate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mutation Analysis</h2>
          <p className="text-muted-foreground">AI-powered mutation analysis and interpretation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Detected Mutations</CardTitle>
            <CardDescription>Sorted by RAScore</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mutations.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading mutations...</p>
                </div>
              ) : (
                mutations.map((mutation) => (
                  <div
                    key={mutation.id}
                    className={`rounded-md border p-3 cursor-pointer transition-colors ${
                      selectedMutation?.id === mutation.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedMutation(mutation)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {mutation.gene} {mutation.mutation}
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          mutation.raScore > 0.8
                            ? "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : mutation.raScore > 0.6
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }
                      >
                        {mutation.raScore.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{mutation.type}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedMutation ? (
                <>
                  {selectedMutation.gene} {selectedMutation.mutation}
                </>
              ) : (
                "Mutation Details"
              )}
            </CardTitle>
            <CardDescription>
              {selectedMutation
                ? `${selectedMutation.type} mutation with RAScore ${selectedMutation.raScore.toFixed(2)}`
                : "Select a mutation to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedMutation ? (
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="clinical">Clinical</TabsTrigger>
                  <TabsTrigger value="genomic">Genomic</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Mutation Type</div>
                        <div className="rounded-md bg-muted p-2">{selectedMutation.type}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Pathogenicity</div>
                        <div className="rounded-md bg-muted p-2">{selectedMutation.pathogenicity}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Frequency</div>
                        <div className="rounded-md bg-muted p-2">{selectedMutation.frequency * 100}%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">RAScore</div>
                        <div className="rounded-md bg-muted p-2">{selectedMutation.raScore.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Clinical Significance</div>
                      <div className="rounded-md bg-muted p-2">{selectedMutation.clinicalSignificance}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">AI Interpretation</div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm">
                          This {selectedMutation.gene} {selectedMutation.mutation} mutation is a well-characterized
                          alteration with strong evidence for pathogenicity. It is commonly found in melanoma and
                          colorectal cancer, and is associated with activation of the MAPK pathway.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="clinical">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Treatment Implications</div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm">
                          Patients with {selectedMutation.gene} {selectedMutation.mutation} mutations may benefit from
                          targeted therapies such as BRAF inhibitors (e.g., vemurafenib, dabrafenib) and MEK inhibitors
                          (e.g., trametinib).
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Clinical Trials</div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm">3 active clinical trials found for this mutation:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• NCT04256473: Phase 2 study of BRAF/MEK inhibition</li>
                          <li>• NCT03843775: Combination immunotherapy trial</li>
                          <li>• NCT04294160: Targeted therapy resistance study</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Prognostic Significance</div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm">
                          This mutation is generally associated with a poorer prognosis in the absence of targeted
                          therapy, but patients typically respond well to appropriate targeted treatments.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="genomic">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Genomic Context</div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm">
                          This mutation occurs in exon 15 of the {selectedMutation.gene} gene, resulting in a valine to
                          glutamic acid substitution at position 600.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Functional Impact</div>
                      <div className="rounded-md bg-muted p-2">
                        <p className="text-sm">
                          The mutation leads to constitutive activation of the BRAF kinase, resulting in hyperactivation
                          of the MAPK signaling pathway and promoting cell proliferation and survival.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Mutation Visualization</div>
                      <div className="h-40 rounded-md border bg-muted flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Select a mutation from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Add both named export and default export
export { MutationAnalysis }
export default MutationAnalysis
