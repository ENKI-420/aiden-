"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, FileUp, Database } from "lucide-react"

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setSelectedFile(null)
      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded and is being processed.`,
      })
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Data Upload</h1>
      <p className="text-muted-foreground">Upload data from various sources for visualization and analysis</p>

      <Tabs defaultValue="file" className="space-y-4">
        <TabsList>
          <TabsTrigger value="file">
            <FileUp className="mr-2 h-4 w-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="api">
            <Database className="mr-2 h-4 w-4" />
            API Connection
          </TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Upload Data File</CardTitle>
              <CardDescription>Upload CSV, JSON, or FHIR data files for processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Data Source</Label>
                <Select defaultValue="epic">
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="redox">Redox</SelectItem>
                    <SelectItem value="fhir">FHIR</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataType">Data Type</Label>
                <Select defaultValue="patient">
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient Records</SelectItem>
                    <SelectItem value="lab">Lab Results</SelectItem>
                    <SelectItem value="medication">Medications</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="notes">Clinical Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <div className="flex items-center gap-2">
                  <Input id="file" type="file" accept=".csv,.json,.xml" onChange={handleFileChange} />
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Connection</CardTitle>
              <CardDescription>Connect directly to Epic or Redox APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiSource">API Source</Label>
                <Select defaultValue="epic">
                  <SelectTrigger>
                    <SelectValue placeholder="Select API source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic">Epic FHIR API</SelectItem>
                    <SelectItem value="redox">Redox API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input id="endpoint" placeholder="https://api.example.com/fhir/Patient" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" type="password" placeholder="Enter your API key" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Database className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
