/**
 * Parses a command string into command, arguments, and options
 * Supports quoted arguments and various option formats
 */
export function parseCommand(commandString: string): {
  command: string
  args: string[]
  options: Record<string, string>
} {
  // Default return structure
  const result = {
    command: "",
    args: [] as string[],
    options: {} as Record<string, string>,
  }

  if (!commandString.trim()) {
    return result
  }

  // Split the command string by spaces, but respect quotes
  const parts: string[] = []
  let current = ""
  let inQuotes = false
  let quoteChar = ""

  for (let i = 0; i < commandString.length; i++) {
    const char = commandString[i]

    if ((char === '"' || char === "'") && (i === 0 || commandString[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true
        quoteChar = char
      } else if (char === quoteChar) {
        inQuotes = false
        quoteChar = ""
      } else {
        current += char
      }
    } else if (char === " " && !inQuotes) {
      if (current) {
        parts.push(current)
        current = ""
      }
    } else {
      current += char
    }
  }

  if (current) {
    parts.push(current)
  }

  // Extract command, args, and options
  if (parts.length > 0) {
    result.command = parts[0]

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i]

      // Check if it's an option (starts with - or --)
      if (part.startsWith("--")) {
        // Long option (--option=value or --option value)
        const optionParts = part.substring(2).split("=")
        const optionName = optionParts[0]

        if (optionParts.length > 1) {
          // --option=value format
          result.options[optionName] = optionParts[1]
        } else if (i + 1 < parts.length && !parts[i + 1].startsWith("-")) {
          // --option value format
          result.options[optionName] = parts[i + 1]
          i++ // Skip the next part as it's the value
        } else {
          // Flag option (--option)
          result.options[optionName] = "true"
        }
      } else if (part.startsWith("-") && part.length > 1 && !part.includes("=")) {
        // Short option(s) (-o or -abc)
        const flags = part.substring(1).split("")

        for (let j = 0; j < flags.length; j++) {
          const flag = flags[j]

          if (j === flags.length - 1 && i + 1 < parts.length && !parts[i + 1].startsWith("-")) {
            // Last flag might have a value (-o value)
            result.options[flag] = parts[i + 1]
            i++ // Skip the next part as it's the value
          } else {
            // Flag option (-o)
            result.options[flag] = "true"
          }
        }
      } else {
        // Regular argument
        result.args.push(part)
      }
    }
  }

  return result
}
