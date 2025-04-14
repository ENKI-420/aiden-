/**
 * Test script for the AIDEN API
 * Run with: node scripts/test-aiden-api.js
 */

async function testAidenApi() {
  const API_URL = process.argv[2] || "http://localhost:3000/api/aiden"
  const METHOD = (process.argv[3] || "POST").toUpperCase()

  console.log(`Testing AIDEN API at ${API_URL} with ${METHOD} method...`)

  try {
    const options = {
      method: METHOD,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (METHOD === "POST") {
      options.body = JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Hello, this is a test message",
          },
        ],
      })
    }

    const response = await fetch(API_URL, options)

    console.log(`Response status: ${response.status} ${response.statusText}`)
    console.log(`Response headers:`, response.headers)

    const contentType = response.headers.get("content-type")
    console.log(`Content-Type: ${contentType}`)

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      console.log("Response data:", JSON.stringify(data, null, 2))
    } else {
      const text = await response.text()
      console.log("Response text:", text.substring(0, 500) + (text.length > 500 ? "..." : ""))
    }

    console.log("Test completed successfully")
  } catch (error) {
    console.error("Error testing API:", error)
  }
}

testAidenApi()
