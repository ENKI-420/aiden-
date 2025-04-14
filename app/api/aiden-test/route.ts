import { type NextRequest, NextResponse } from "next/server"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: "ok",
      message: "AIDEN API test endpoint is working",
      method: "GET",
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders },
  )
}

export async function POST(request: NextRequest) {
  let body
  try {
    body = await request.json()
  } catch (e) {
    body = "Could not parse JSON body"
  }

  return NextResponse.json(
    {
      status: "ok",
      message: "AIDEN API test endpoint received POST request",
      method: "POST",
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      body,
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}
