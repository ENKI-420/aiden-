"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/error-handler"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  isContentLoadingError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      isContentLoadingError: false,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a content loading error
    const isContentLoadingError =
      error.message.includes("vusercontent.net") ||
      error.message.includes("dfg6dj4ud5wq8yd0m") ||
      error.message.includes("1957892611")

    return {
      hasError: true,
      error,
      isContentLoadingError,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo)
    this.setState({ errorInfo })

    // You can log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // Clear the cache if it's a content loading error
    if (this.state.isContentLoadingError) {
      // Clear browser cache for the problematic domain
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName)
        })
      })
    }

    // Call the onReset prop if provided
    if (this.props.onReset) {
      this.props.onReset()
    }

    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Content loading error fallback
      if (this.state.isContentLoadingError) {
        return (
          <div className="p-4 rounded-md bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Content Loading Error</h2>
            </div>
            <p className="text-sm text-amber-700 mb-4">
              We encountered an issue loading external content. This may be due to network connectivity or temporary
              service unavailability.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={this.handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-32">
                <p>Error: {getErrorMessage(this.state.error)}</p>
                <p>Digest: 1957892611</p>
              </div>
            )}
          </div>
        )
      }

      // Default error fallback
      return (
        this.props.fallback || (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-red-700 mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
            <Button variant="outline" onClick={this.handleReset}>
              Try again
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
