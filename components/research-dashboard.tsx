"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileDown, FileUp, Users, BookOpen, Microscope, Database } from "lucide-react"

function ResearchDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Research Dashboard</h2>
          <p className="text-muted-foreground">Manage and track research projects and collaborations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileUp className="h-4 w-4" />
            <span>Import Data</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Current research initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 high priority</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("projects")}>
                    View Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Publications</CardTitle>
                <CardDescription>Research papers and preprints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">4 in the last 6 months</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("publications")}>
                    View Publications
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Collaborations</CardTitle>
                <CardDescription>Research partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 international</p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("collaborations")}>
                    View Collaborations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Research Metrics</CardTitle>
                <CardDescription>Key performance indicators for research activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-medium">Publication Impact</h3>
                    <div className="h-40 w-full rounded-md border bg-muted flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Total Citations</div>
                        <div>487</div>
                      </div>
                      <div>
                        <div className="font-medium">h-index</div>
                        <div>14</div>
                      </div>
                      <div>
                        <div className="font-medium">i10-index</div>
                        <div>18</div>
                      </div>
                      <div>
                        <div className="font-medium">Avg. Impact Factor</div>
                        <div>5.8</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Research Funding</h3>
                    <div className="h-40 w-full rounded-md border bg-muted flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Active Grants</div>
                        <div>4</div>
                      </div>
                      <div>
                        <div className="font-medium">Total Funding</div>
                        <div>$2.4M</div>
                      </div>
                      <div>
                        <div className="font-medium">Pending Proposals</div>
                        <div>3</div>
                      </div>
                      <div>
                        <div className="font-medium">Funding Success Rate</div>
                        <div>32%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Research Projects</CardTitle>
              <CardDescription>Active and completed research initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">BRAF Inhibitor Resistance Mechanisms</h3>
                      <p className="text-sm text-muted-foreground">Started: Jan 2023 • Duration: 24 months</p>
                    </div>
                    <Badge>High Priority</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">PI:</span> Dr. Sarah Chen
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Team:</span> 6 researchers
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Funding:</span> NIH R01
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Status:</span> Active
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Progress Report
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Genomic Predictors of Immunotherapy Response</h3>
                      <p className="text-sm text-muted-foreground">Started: Mar 2023 • Duration: 36 months</p>
                    </div>
                    <Badge>High Priority</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">PI:</span> Dr. Michael Johnson
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Team:</span> 8 researchers
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Funding:</span> NCI U01
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Status:</span> Active
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Progress Report
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">AI-Driven Mutation Effect Prediction</h3>
                      <p className="text-sm text-muted-foreground">Started: Jun 2023 • Duration: 18 months</p>
                    </div>
                    <Badge>Medium Priority</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">PI:</span> Dr. Lisa Wong
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Team:</span> 4 researchers
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Funding:</span> Internal
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Status:</span> Active
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Progress Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="publications">
          <Card>
            <CardHeader>
              <CardTitle>Publications</CardTitle>
              <CardDescription>Research papers, preprints, and conference proceedings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Genomic and Transcriptomic Predictors of Response to BRAF/MEK Inhibition in Melanoma
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Journal of Clinical Oncology • Published: Mar 2023
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Published
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Authors:</span> Chen S, Johnson M, Wong L, et al.
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Impact Factor:</span> 44.5 •{" "}
                    <span className="font-medium">Citations:</span> 18
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Publication
                    </Button>
                    <Button size="sm" variant="outline">
                      Download PDF
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Deep Learning Approach for Predicting Functional Impact of Novel Genomic Variants
                      </h3>
                      <p className="text-sm text-muted-foreground">Nature Biotechnology • Published: Jun 2023</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Published
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Authors:</span> Wong L, Chen S, Smith R, et al.
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Impact Factor:</span> 54.9 •{" "}
                    <span className="font-medium">Citations:</span> 12
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Publication
                    </Button>
                    <Button size="sm" variant="outline">
                      Download PDF
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Single-cell Analysis Reveals Mechanisms of Acquired Resistance to Targeted Therapy
                      </h3>
                      <p className="text-sm text-muted-foreground">bioRxiv • Preprint: Sep 2023</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Preprint
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Authors:</span> Johnson M, Chen S, Garcia T, et al.
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Status:</span> Under review at Cancer Cell
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Preprint
                    </Button>
                    <Button size="sm" variant="outline">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="collaborations">
          <Card>
            <CardHeader>
              <CardTitle>Research Collaborations</CardTitle>
              <CardDescription>Active research partnerships and consortia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Melanoma Genomics Consortium</h3>
                      <p className="text-sm text-muted-foreground">Started: Jan 2022 • Duration: Ongoing</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Partners:</span> 8 institutions
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Samples:</span> 1,248
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Publications:</span> 5
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      View Members
                    </Button>
                    <Button size="sm" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Access Data
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">International Cancer AI Network</h3>
                      <p className="text-sm text-muted-foreground">Started: Mar 2023 • Duration: 5 years</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Partners:</span> 12 institutions
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Countries:</span> 8
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Projects:</span> 4
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      View Members
                    </Button>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Projects
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Pharmaceutical Industry Partnership</h3>
                      <p className="text-sm text-muted-foreground">Started: Jun 2023 • Duration: 3 years</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Partners:</span> 3 companies
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Funding:</span> $1.8M
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Focus:</span> Drug discovery
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Microscope className="h-4 w-4 mr-2" />
                      View Projects
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileDown className="h-4 w-4 mr-2" />
                      Progress Report
                    </Button>
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
export { ResearchDashboard }
export default ResearchDashboard
