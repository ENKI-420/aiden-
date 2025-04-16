import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { generateChatCompletion, type ChatMessage } from "@/lib/ai-chat"

// Define types for better type safety
interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface RequestBody {
  messages: Message[]
  mutationData?: any[]
  user?: {
    id: string
    role: string
  }
}

// Rate limiter for API requests
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per interval
})

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  "Access-Control-Max-Age": "86400",
}

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

// Handle GET requests (health check)
export async function GET() {
  return NextResponse.json({ status: "ok", message: "AIDEN API is operational" }, { headers: corsHeaders })
}

// Main API handler for POST requests
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous"

    // Apply rate limiting
    try {
      await limiter.check(10, ip) // 10 requests per minute per IP
    } catch (error) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: corsHeaders },
      )
    }

    // Parse request body
    let body: RequestBody
    try {
      body = await request.json()
    } catch (error) {
      logger.error({
        action: "aiden_request_parse_error",
        error: error instanceof Error ? error.message : String(error),
      })
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400, headers: corsHeaders })
    }

    // Validate request
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Messages array is required." },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get API key from environment or request header
    const apiKey = process.env.OPENAI_API_KEY || request.headers.get("x-api-key")

    if (!apiKey) {
      logger.warn("No API key provided for AI service")
      // Fall back to mock response if no API key
      return NextResponse.json(
        { message: generateMockResponse(body.messages[body.messages.length - 1].content, body.mutationData) },
        { headers: corsHeaders },
      )
    }

    // Log request (excluding sensitive data)
    logger.info({
      action: "aiden_request",
      messageCount: body.messages.length,
      hasMutationData: !!body.mutationData,
      hasUser: !!body.user,
      userRole: body.user?.role,
    })

    // Prepare messages for the AI service
    const messages = [
      {
        role: "system",
        content: `You are AIDEN (Advanced Intelligent Digital Entity for Nucleotide analysis), an AI assistant for Norton Cancer Institute. 
        You specialize in genomic analysis, mutation interpretation, and providing information about cancer treatments and Norton Healthcare services.
        Be professional, accurate, and compassionate in your responses. When discussing medical information, acknowledge that you are providing general information and not medical advice.
        Always maintain HIPAA compliance and patient privacy.`,
      },
      ...body.messages,
    ]

    // Call OpenAI API
    try {
      // Use our simplified implementation instead of calling OpenAI API
      const response = await generateChatCompletion({
        messages: messages as ChatMessage[],
        temperature: 0.7,
        max_tokens: 2000,
      })

      // Log successful response
      logger.info({
        action: "aiden_response",
        status: "success",
      })

      return NextResponse.json({ message: response }, { headers: corsHeaders })
    } catch (error) {
      logger.error({
        action: "aiden_openai_fetch_error",
        error: error instanceof Error ? error.message : String(error),
      })

      // Fall back to mock response on network error
      return NextResponse.json(
        { message: generateMockResponse(body.messages[body.messages.length - 1].content, body.mutationData) },
        { headers: corsHeaders },
      )
    }
  } catch (error) {
    // Log unexpected errors
    logger.error({
      action: "aiden_unexpected_error",
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500, headers: corsHeaders },
    )
  }
}

// Helper function to generate mock responses when the API is unavailable
function generateMockResponse(input: string, mutationData?: any[]): string {
  const inputLower = input.toLowerCase()

  // Check for mutation analysis requests
  if (inputLower.includes("braf") && inputLower.includes("v600e")) {
    return `The BRAF V600E mutation is a missense mutation that substitutes valine (V) with glutamic acid (E) at position 600 in the BRAF protein. This mutation:

1. Constitutively activates the MAPK signaling pathway
2. Is commonly found in melanoma (~50% of cases), colorectal cancer, and some lung cancers
3. Has a RAScore of 0.89, indicating high likelihood of treatment resistance over time

Recommended treatments include BRAF inhibitors (vemurafenib, dabrafenib, encorafenib), often in combination with MEK inhibitors (trametinib, cobimetinib) to delay resistance development.

Would you like me to provide more detailed information about resistance mechanisms or clinical trial data?`
  }

  // Check for Norton Cancer Institute locations
  if (inputLower.includes("norton") && (inputLower.includes("location") || inputLower.includes("center"))) {
    return `Norton Cancer Institute has multiple locations throughout Kentucky and Southern Indiana to provide convenient access to cancer care:

1. Norton Cancer Institute - Downtown
   676 S. Floyd St., Louisville, KY 40202

2. Norton Cancer Institute - St. Matthews
   4123 Dutchmans Lane, Louisville, KY 40207

3. Norton Cancer Institute - Brownsboro
   4955 Norton Healthcare Blvd., Louisville, KY 40241

4. Norton Cancer Institute Women's Cancer Center
   4123 Dutchmans Lane, Louisville, KY 40207

5. Norton Cancer Institute Radiation Center - St. Matthews
   4123 Dutchmans Lane, Louisville, KY 40207

6. Norton Cancer Institute Radiation Center - Downtown
   676 S. Floyd St., Louisville, KY 40202

7. Norton Cancer Institute Radiation Center - Northeast
   3711 Chamberlain Lane, Louisville, KY 40241

8. Norton Cancer Institute - Madison
   1373 East State Road 62, Madison, IN 47250

Would you like information about specific services available at any of these locations?`
  }

  // Default response
  return `Thank you for your question. I'm here to help with genomic analysis, mutation interpretation, and information about Norton Cancer Institute services.

Based on your query, I can provide information about:
- Cancer mutations and their clinical significance
- Treatment options and recommendations
- Norton Cancer Institute locations and services
- Research and clinical trials
- Educational resources for patients and caregivers

Please let me know if you'd like more specific information about any of these topics.`
}
