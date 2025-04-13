export interface CommandResult {
  output: string
  status: "success" | "error" | "warning" | "info"
  data?: any
}

export interface TerminalHistory {
  type: "command" | "output" | "error"
  content: string
  timestamp: string
  status?: "success" | "error" | "warning" | "info"
  data?: any
}

export interface CommandHandler {
  execute: (args: string[], options: Record<string, string>) => Promise<CommandResult>
  help: string
  description: string
  usage: string
  examples: string[]
}

export interface CommandRegistry {
  [command: string]: CommandHandler
}
