"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CuboidIcon, Clock, Calendar, Lock } from "lucide-react"

interface DigitalTwin {
  id: string
  name: string
  type: string
  lastAccessed: string
  createdAt: string
  status: "active" | "processing" | "archived"
  accessLevel: "full" | "limited" | "view-only"
}

export default function DigitalTwinSelectorPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [twins, setTwins] = useState<DigitalTwin[]>([])
  const [loadingTwins, setLoadingTwins] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    // Simulate fetching digital twins
    const fetchDigitalTwins = async () => {
      // In a real app, this would fetch from an API
      setTimeout(() => {
        setTwins([
          {
            id: "dt-001",
            name: "Primary Digital Twin",
            type: "Full Body Model",
            lastAccessed: "2023-04-15T10:30:00",
            createdAt: "2022-11-22T09:15:00",
            status: "active",
            accessLevel: "full",
          },
          {
            id: "dt-002",
            name: "Cardiac System",
            type: "Specialized Model",
            lastAccessed: "2023-04-10T14:45:00",
            createdAt: "2023-01-05T11:20:00",
            status: "active",
            accessLevel: "full",
          },
          {
            id: "dt-003",
            name: "Neurological System",
            type: "Specialized Model",
            lastAccessed: "2023-03-28T09:15:00",
            createdAt: "2023-02-17T16:30:00",
            status: "processing",
            accessLevel: "limited",
          },
        ])
        setLoadingTwins(false)
      }, 1500)
    }

    if (isAuthenticated) {
      fetchDigitalTwins()
    }
  }, [isAuthenticated])

  const handleTwinSelection = (twinId: string) => {
    router.push(`/dashboard/digital-twin/${twinId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-[400px] w-[600px] rounded-xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Your Digital Twins</h1>
      <p className="text-muted-foreground mb-8">
        Select a digital twin to view and interact with your personalized health models
      </p>

      <Tabs defaultValue="my-twins" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="my-twins">My Digital Twins</TabsTrigger>
          <TabsTrigger value="shared">Shared With Me</TabsTrigger>
        </TabsList>

        <TabsContent value="my-twins">
          {loadingTwins ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[220px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {twins.map((twin) => (
                <Card key={twin.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{twin.name}</CardTitle>
                      <Badge
                        variant={
                          twin.status === "active" ? "default" : twin.status === "processing" ? "outline" : "secondary"
                        }
                      >
                        {twin.status === "active" ? "Active" : twin.status === "processing" ? "Processing" : "Archived"}
                      </Badge>
                    </div>
                    <CardDescription>{twin.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Clock className="mr-2 h-4 w-4" />
                      Last accessed: {new Date(twin.lastAccessed).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Created: {new Date(twin.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Lock className="mr-2 h-4 w-4" />
                      Access level: {twin.accessLevel}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleTwinSelection(twin.id)}
                      disabled={twin.status === "processing"}
                    >
                      <CuboidIcon className="mr-2 h-4 w-4" />
                      {twin.status === "active" ? "Access Digital Twin" : "View Details"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CuboidIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Shared Digital Twins</h3>
            <p className="text-muted-foreground max-w-md">
              Digital twins shared with you by healthcare providers or researchers will appear here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
