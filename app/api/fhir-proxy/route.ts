import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the path from query parameters
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 })
    }

    // Get authorization header from the request
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 })
    }

    // Construct the full URL
    const baseUrl = process.env.EPIC_FHIR_BASE_URL || "https://fhir.epic.com/Sandbox/api/FHIR/R4"

    // Handle both absolute and relative paths
    const url = path.startsWith("http") ? path : `${baseUrl}/${path}`

    console.log(`Proxying FHIR request to: ${url}`)

    // Forward the request to the FHIR server
    const response = await fetch(url, {
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Non-JSON response from FHIR endpoint:", text)
      return NextResponse.json({ error: "Invalid response from FHIR server", details: text }, { status: 502 })
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("FHIR request error:", errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in FHIR proxy:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
