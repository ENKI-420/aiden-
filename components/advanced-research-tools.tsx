"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, FileDown, Play } from "lucide-react"

function AdvancedResearchTools() {
  const [activeTab, setActiveTab] = useState("ml-models")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Research Tools</h2>
          <p className="text-muted-foreground">Specialized tools for genomic research</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ml-models">ML Models</TabsTrigger>
          <TabsTrigger value="data-mining">Data Mining</TabsTrigger>
          <TabsTrigger value="pathway-analysis">Pathway Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="ml-models">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Machine Learning Models</CardTitle>
                <CardDescription>Train and deploy custom ML models for genomic analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">RAScore Prediction Model</h3>
                    </div>
                    <p className="mt-2 text-sm">
                      Deep learning model for predicting pathogenicity scores (RAScores) for novel mutations.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Train Model</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Treatment Response Predictor</h3>
                    </div>
                    <p className="mt-2 text-sm">
                      Ensemble model for predicting patient response to targeted therapies based on genomic profile.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Train Model</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Survival Analysis Model</h3>
                    </div>
                    <p className="mt-2 text-sm">
                      Cox proportional hazards model for predicting patient survival based on genomic alterations and
                      clinical factors.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Train Model</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Training</CardTitle>
                <CardDescription>Configure and train custom models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-type">Model Type</Label>
                    <select id="model-type" className="w-full rounded-md border p-2">
                      <option value="rascore">RAScore Prediction</option>
                      <option value="treatment">Treatment Response</option>
                      <option value="survival">Survival Analysis</option>
                      <option value="custom">Custom Model</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="training-data">Training Dataset</Label>
                    <select id="training-data" className="w-full rounded-md border p-2">
                      <option value="tcga">TCGA Pan-Cancer</option>
                      <option value="ccle">Cancer Cell Line Encyclopedia</option>
                      <option value="cptac">CPTAC</option>
                      <option value="custom">Custom Dataset</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model-params">Model Parameters</Label>
                    <Input id="model-params" placeholder="Enter parameters as JSON" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="epochs">Training Epochs</Label>
                    <Input id="epochs" type="number" defaultValue={100} />
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="data-mining">
          <Card>
            <CardHeader>
              <CardTitle>Genomic Data Mining</CardTitle>
              <CardDescription>Extract insights from large genomic datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="data-source">Data Source</Label>
                    <select id="data-source" className="w-full rounded-md border p-2">
                      <option value="tcga">TCGA</option>
                      <option value="icgc">ICGC</option>
                      <option value="gdc">GDC Data Portal</option>
                      <option value="local">Local Database</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancer-type">Cancer Type</Label>
                    <select id="cancer-type" className="w-full rounded-md border p-2">
                      <option value="all">All Cancer Types</option>
                      <option value="brca">Breast Cancer</option>
                      <option value="luad">Lung Adenocarcinoma</option>
                      <option value="skcm">Melanoma</option>
                      <option value="coad">Colorectal Adenocarcinoma</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query">Query</Label>
                  <textarea
                    id="query"
                    className="h-32 w-full rounded-md border p-2"
                    placeholder="Enter SQL-like query or natural language query"
                    defaultValue="SELECT gene, mutation, COUNT(*) as frequency FROM mutations WHERE cancer_type = 'SKCM' GROUP BY gene, mutation ORDER BY frequency DESC LIMIT 10"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Run Query
                  </Button>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Sample Results</h3>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-2 py-1 text-left">Gene</th>
                          <th className="px-2 py-1 text-left">Mutation</th>
                          <th className="px-2 py-1 text-left">Frequency</th>
                          <th className="px-2 py-1 text-left">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-2 py-1">BRAF</td>
                          <td className="px-2 py-1">V600E</td>
                          <td className="px-2 py-1">219</td>
                          <td className="px-2 py-1">45.2%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">NRAS</td>
                          <td className="px-2 py-1">Q61K</td>
                          <td className="px-2 py-1">55</td>
                          <td className="px-2 py-1">11.3%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">NRAS</td>
                          <td className="px-2 py-1">Q61R</td>
                          <td className="px-2 py-1">53</td>
                          <td className="px-2 py-1">10.9%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-2 py-1">TP53</td>
                          <td className="px-2 py-1">R248Q</td>
                          <td className="px-2 py-1">12</td>
                          <td className="px-2 py-1">2.5%</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1">CDKN2A</td>
                          <td className="px-2 py-1">P114L</td>
                          <td className="px-2 py-1">9</td>
                          <td className="px-2 py-1">1.9%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pathway-analysis">
          <Card>
            <CardHeader>
              <CardTitle>Pathway Analysis</CardTitle>
              <CardDescription>Analyze biological pathways affected by genomic alterations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pathway-db">Pathway Database</Label>
                    <select id="pathway-db" className="w-full rounded-md border p-2">
                      <option value="kegg">KEGG</option>
                      <option value="reactome">Reactome</option>
                      <option value="go">Gene Ontology</option>
                      <option value="biocarta">BioCarta</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analysis-type">Analysis Type</Label>
                    <select id="analysis-type" className="w-full rounded-md border p-2">
                      <option value="enrichment">Enrichment Analysis</option>
                      <option value="gsea">Gene Set Enrichment Analysis</option>
                      <option value="impact">Pathway Impact Analysis</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gene-list">Gene List</Label>
                  <textarea
                    id="gene-list"
                    className="h-32 w-full rounded-md border p-2"
                    placeholder="Enter gene list (one gene per line)"
                    defaultValue="BRAF
NRAS
MAP2K1
PTEN
TP53
CDKN2A
AKT1
PIK3CA"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </Button>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Sample Results</h3>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">MAPK Signaling Pathway</h4>
                        <span className="text-sm font-medium text-green-600">p-value: 1.2e-8</span>
                      </div>
                      <p className="mt-1 text-sm">Genes: BRAF, NRAS, MAP2K1 (3/8 genes, 37.5%)</p>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">PI3K-Akt Signaling Pathway</h4>
                        <span className="text-sm font-medium text-green-600">p-value: 3.4e-6</span>
                      </div>
                      <p className="mt-1 text-sm">Genes: PTEN, AKT1, PIK3CA (3/8 genes, 37.5%)</p>
                    </div>

                    <div className="rounded-md bg-muted p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Cell Cycle Regulation</h4>
                        <span className="text-sm font-medium text-green-600">p-value: 5.7e-5</span>
                      </div>
                      <p className="mt-1 text-sm">Genes: TP53, CDKN2A (2/8 genes, 25%)</p>
                    </div>
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
export { AdvancedResearchTools }
export default AdvancedResearchTools
