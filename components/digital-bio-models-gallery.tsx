"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, Filter } from "lucide-react"
import { digitalBioApi, type DigitalBioModel } from "@/lib/digital-bio-api"
import DigitalBioModelViewer from "./digital-bio-model-viewer"

interface DigitalBioModelsGalleryProps {
  patientId: string
  mutations?: any[]
}

export default function DigitalBioModelsGallery({ patientId, mutations = [] }: DigitalBioModelsGalleryProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [models, setModels] = useState<DigitalBioModel[]>([])
  const [filteredModels, setFilteredModels] = useState<DigitalBioModel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedModel, setSelectedModel] = useState<DigitalBioModel | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  // Load models when component mounts or mutations change
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true)
      try {
        // If mutations are provided, use them to fetch relevant models
        if (mutations && mutations.length > 0) {
          const modelsData = await digitalBioApi.getModelsForPatient(patientId, mutations)
          setModels(modelsData)
          setFilteredModels(modelsData)
        } else {
          // Otherwise, fetch all models
          const modelsData = await digitalBioApi.searchModels({})
          setModels(modelsData)
          setFilteredModels(modelsData)
        }
      } catch (error) {
        console.error("Error loading models:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()
  }, [patientId, mutations])

  // Filter models when search query or active tab changes
  useEffect(() => {
    let filtered = models

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.metadata.gene?.toLowerCase().includes(query) ||
          model.metadata.mutation?.toLowerCase().includes(query),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((model) => model.type === activeTab)
    }

    setFilteredModels(filtered)
  }, [searchQuery, activeTab, models])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect above
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  return (
    <>
      {fullscreen && selectedModel ? (
        <DigitalBioModelViewer model={selectedModel} fullscreen={true} onToggleFullscreen={toggleFullscreen} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">3D Biological Models</h2>
              <p className="text-muted-foreground">Interactive 3D models of genes, proteins, and mutations</p>
            </div>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search models..."
                  className="w-[200px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Models</TabsTrigger>
              <TabsTrigger value="protein">Proteins</TabsTrigger>
              <TabsTrigger value="mutation">Mutations</TabsTrigger>
              <TabsTrigger value="pathway">Pathways</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading 3D models...</span>
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No models found. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredModels.map((model) => (
                    <Card
                      key={model.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedModel(model)}
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-t-md bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
                        <img
                          src={model.thumbnailUrl || "/placeholder.svg"}
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <Badge>{model.type}</Badge>
                        </div>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {model.metadata.gene && <Badge variant="outline">{model.metadata.gene}</Badge>}
                          {model.metadata.mutation && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              {model.metadata.mutation}
                            </Badge>
                          )}
                          {model.metadata.clinicalSignificance && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                            >
                              {model.metadata.clinicalSignificance}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {selectedModel && !fullscreen && (
            <div className="mt-6">
              <DigitalBioModelViewer model={selectedModel} fullscreen={false} onToggleFullscreen={toggleFullscreen} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
