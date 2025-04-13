import { parseCommand } from "./command-parser"
import type { CommandResult } from "./types"
import { getCommandRegistry } from "./command-registry"

// Function to log command to API
async function logCommand(commandString: string, result: CommandResult, mode: string) {
  try {
    await fetch("/api/terminal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: commandString,
        output: result.output,
        mode,
      }),
    })
  } catch (error) {
    console.error("Failed to log command:", error)
    // Don't throw - this is a non-critical operation
  }
}

export async function executeCommand(commandString: string, mode: string): Promise<CommandResult> {
  try {
    // Parse the command
    const { command, args, options } = parseCommand(commandString)

    if (!command) {
      return {
        output: "",
        status: "success",
      }
    }

    // Get the command registry for the current mode
    const registry = await getCommandRegistry(mode)

    // Check if the command exists
    if (command in registry) {
      // Execute the command
      const result = await registry[command].execute(args, options)
      // Log the command
      await logCommand(commandString, result, mode)
      return result
    } else if (command === "help") {
      // Special case for help command
      if (args.length > 0 && args[0] in registry) {
        // Help for a specific command
        const cmd = registry[args[0]]
        const result = {
          output: `
Command: ${args[0]}
Description: ${cmd.description}
Usage: ${cmd.usage}
Examples:
${cmd.examples.map((ex) => `  ${ex}`).join("\n")}
`,
          status: "info",
        }
        await logCommand(commandString, result, mode)
        return result
      } else {
        // General help
        const commands = Object.keys(registry).sort()
        const result = {
          output: `
Available commands for ${mode.replace(/-/g, " ")} mode:
${commands.map((cmd) => `  ${cmd.padEnd(15)} - ${registry[cmd].description}`).join("\n")}

Type 'help <command>' for more information about a specific command.
`,
          status: "info",
        }
        await logCommand(commandString, result, mode)
        return result
      }
    } else if (command === "clear") {
      // Special case for clear command - handled by the terminal component
      const result = {
        output: "",
        status: "success",
      }
      await logCommand(commandString, result, mode)
      return result
    } else if (command === "mode") {
      // Display current mode
      const result = {
        output: `Current mode: ${mode.replace(/-/g, " ")}`,
        status: "info",
      }
      await logCommand(commandString, result, mode)
      return result
    } else {
      // Command not found
      const result = {
        output: `Command not found: ${command}. Type 'help' to see available commands.`,
        status: "error",
      }
      await logCommand(commandString, result, mode)
      return result
    }
  } catch (error) {
    console.error("Command execution error:", error)
    return {
      output: error instanceof Error ? error.message : "An unknown error occurred",
      status: "error",
    }
  }
}
