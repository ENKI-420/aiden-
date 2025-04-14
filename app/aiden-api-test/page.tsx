"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AidenApiTestPage() {
  const [testResult, setTestResult] = useState<string>("No test run yet")
  const [isLoading, setIsLoading] = useState(false)
  const [testEndpoint, setTestEndpoint] = useState("/api/aiden-test")

  const runTest = async (method: "GET" | "POST") => {
    setIsLoading(true)
    setTestResult("Running test...")

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (method === "POST") {
        options.body = JSON.stringify({
          messages: [{ role: "user", content: "Hello, this is a test message" }],
        })
      }

      const response = await fetch(testEndpoint, options)

      if (!response.ok) {
        setTestResult(`Error: ${response.status} ${response.statusText}`)
        return
      }

      const data = await response.json()
      setTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>AIDEN API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-2">API Endpoint:</label>
            <input
              type="text"
              value={testEndpoint}
              onChange={(e) => setTestEndpoint(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <Button onClick={() => runTest("GET")} disabled={isLoading}>
              Test GET
            </Button>
            <Button onClick={() => runTest("POST")} disabled={isLoading}>
              Test POST
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Test Result:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 dark:bg-gray-800">{testResult}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
