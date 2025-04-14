// Simple logger implementation
// In production, this should be replaced with a more robust logging solution

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message?: string
  [key: string]: any
}

class Logger {
  private logToConsole(level: LogLevel, data: any) {
    const timestamp = new Date().toISOString()
    const logEntry: LogEntry = {
      timestamp,
      level,
      ...data,
    }

    // In production, this would send logs to a proper logging service
    // For now, we just log to console with appropriate level
    switch (level) {
      case "debug":
        console.debug(JSON.stringify(logEntry))
        break
      case "info":
        console.info(JSON.stringify(logEntry))
        break
      case "warn":
        console.warn(JSON.stringify(logEntry))
        break
      case "error":
        console.error(JSON.stringify(logEntry))
        break
    }

    // In production, you might also want to:
    // 1. Send logs to a service like Datadog, New Relic, etc.
    // 2. Store logs in a database for audit purposes
    // 3. Trigger alerts for certain error conditions
  }

  debug(data: any) {
    this.logToConsole("debug", data)
  }

  info(data: any) {
    this.logToConsole("info", data)
  }

  warn(data: any) {
    this.logToConsole("warn", data)
  }

  error(data: any) {
    this.logToConsole("error", data)
  }
}

export const logger = new Logger()
