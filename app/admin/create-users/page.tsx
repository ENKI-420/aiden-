"use client"

import { useState } from "react"
import { createUsers } from "@/app/actions/create-users"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function CreateUsersPage() {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const usersToCreate = [
    { email: "devin@agiledefensesystems.com", password: "redox123", role: "admin" },
    { email: "lukebonney@gmail.com", password: "redox123", role: "user" },
    { email: "clarkdownum@redoxengine.com", password: "redox123", role: "user" },
    { email: "tedd.pollard@agiledefensesystems.com", password: "redox123", role: "admin" },
    { email: "jake@agiledefensesystems.com", password: "redox123", role: "admin" },
  ]

  const handleCreateUsers = async () => {
    setIsLoading(true)
    setResults([])
    setIsComplete(false)

    try {
      const creationResults = await createUsers(usersToCreate)
      setResults(creationResults)
      setIsComplete(true)
    } catch (error) {
      console.error("Error creating users:", error)
      setResults([
        {
          email: "all",
          success: false,
          message: error instanceof Error ? error.message : "Unknown error occurred",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create User Accounts</CardTitle>
          <CardDescription>Create the specified user accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Users to be created:</h3>
              <ul className="space-y-2">
                {usersToCreate.map((user) => (
                  <li key={user.email} className="text-sm">
                    <span className="font-medium">{user.email}</span> - Role: {user.role}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-2">All accounts will use the password: redox123</p>
            </div>

            {results.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="font-medium">Results:</h3>
                {results.map((result, index) => (
                  <Alert key={index} variant={result.success ? "default" : "destructive"}>
                    {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>{result.email}</AlertTitle>
                    <AlertDescription>{result.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateUsers} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Users...
              </>
            ) : isComplete ? (
              "Create Users Again"
            ) : (
              "Create Users"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
