/**
 * Test script for the AIDEN API endpoint
 * Run with: npx tsx lib/test-aiden-api.ts
 */

async function testAidenAPI() {
  try {
    console.log("Testing AIDEN API endpoint...")

    const response = await fetch("http://localhost:3000/api/aiden", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Tell me about BRAF V600E mutation",
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error(`❌ API request failed with status: ${response.status} ${response.statusText}`)
      try {
        const errorData = await response.json()
        console.error("Error details:", errorData)
      } catch (e) {
        console.error("Could not parse error response as JSON")
      }
      return
    }

    const data = await response.json()
    console.log("✅ API Response received:")
    console.log("-----------------------------------")
    console.log(data.message ? data.message.substring(0, 150) + "..." : "No message in response")
    console.log("-----------------------------------")

    if (data.message) {
      console.log("✅ API endpoint is working correctly!")
    } else {
      console.log("❌ API returned unexpected response format")
    }
  } catch (error) {
    console.error("❌ Error testing API endpoint:", error)
  }
}

// Run the test
testAidenAPI()
