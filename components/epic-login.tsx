"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Server, User } from "lucide-react"

interface EpicLoginProps {
  onLogin: (token: string) => void
  onError: (error: Error) => void
}

export default function EpicLogin({ onLogin, onError }: EpicLoginProps) {
  const [activeTab, setActiveTab] = useState("provider")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Provider login
  const [clientId, setClientId] = useState(process.env.AGILE_CLIENT_ID || "")
  const [clientSecret, setClientSecret] = useState(process.env.EPIC_SANDBOX_CLIENT_SECRET || "")

  // Patient login
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleProviderLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/epic-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, clientSecret }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Authentication failed")
      }

      const data = await response.json()
      onLogin(data.access_token)
    } catch (err) {
      console.error("Provider login error:", err)
      setError(err instanceof Error ? err.message : "Authentication failed")
      onError(err instanceof Error ? err : new Error("Authentication failed"))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePatientLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/epic-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, clientSecret, username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Authentication failed")
      }

      const data = await response.json()
      onLogin(data.access_token)
    } catch (err) {
      console.error("Patient login error:", err)
      setError(err instanceof Error ? err.message : "Authentication failed")
      onError(err instanceof Error ? err : new Error("Authentication failed"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = () => {
    if (activeTab === "provider") {
      handleProviderLogin()
    } else {
      handlePatientLogin()
    }
  }

  const handleUseMockData = () => {
    // Set environment variable to use mock data
    localStorage.setItem("USE_MOCK_EPIC", "true")

    // Create a mock token
    const mockToken = "mock-token-" + Date.now()
    onLogin(mockToken)
  }

  return (
    <Card className="w-full max-w-md mx-auto dark:border-slate-700">
      <CardHeader>
        <CardTitle>Epic FHIR Login</CardTitle>
        <CardDescription>Connect to Epic's FHIR API</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="provider">
              <Server className="mr-2 h-4 w-4" />
              Provider
            </TabsTrigger>
            <TabsTrigger value="patient">
              <User className="mr-2 h-4 w-4" />
              Patient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="provider" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter client ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-secret">Client Secret</Label>
              <Input
                id="client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter client secret"
              />
            </div>
          </TabsContent>

          <TabsContent value="patient" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect to Epic FHIR"}
        </Button>
        <Button variant="outline" className="w-full" onClick={handleUseMockData}>
          Use Mock Data
        </Button>
      </CardFooter>
    </Card>
  )
}
