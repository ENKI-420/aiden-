type ErrorWithMessage = {
  message: string
  digest?: string
  code?: string
  status?: number
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message
}

export async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      // Add cache control headers to prevent stale content issues
      headers: {
        ...options?.headers,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw {
        message: errorData.error || `Request failed with status ${response.status}`,
        status: response.status,
        digest: errorData.digest || "1957892611",
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Fetch error:", error)
    throw error
  }
}
