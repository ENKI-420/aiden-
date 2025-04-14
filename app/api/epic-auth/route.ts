import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { clientId, clientSecret, username, password } = await request.json()

    // Determine which auth flow to use based on provided credentials
    let authFlow = "client_credentials"
    let body = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`

    // If username and password are provided, use password grant type
    if (username && password) {
      authFlow = "password"
      body = `grant_type=password&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    }

    // For non-production environments, use the non-prod client ID if available
    if (process.env.NODE_ENV !== "production" && process.env.AGILE_NON_PROD_CLIENT_ID) {
      body = body.replace(clientId, process.env.AGILE_NON_PROD_CLIENT_ID)
    }

    // Epic's OAuth token endpoint
    const tokenUrl = `${process.env.EPIC_FHIR_BASE_URL || "https://fhir.epic.com/Sandbox"}/oauth2/token`

    console.log(`Authenticating with Epic using ${authFlow} flow`)

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })

    // Check if response is JSON
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("Non-JSON response from Epic auth endpoint:", text)
      return NextResponse.json({ error: "Invalid response from authentication server", details: text }, { status: 502 })
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Epic auth error:", errorData)
      return NextResponse.json({ error: "Authentication failed", details: errorData }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Epic authentication:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
