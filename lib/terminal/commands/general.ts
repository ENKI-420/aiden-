import type { CommandRegistry, CommandResult } from "../types"

export const generalCommands: CommandRegistry = {
  echo: {
    execute: async (args, options): Promise<CommandResult> => {
      return {
        output: args.join(" "),
        status: "success",
      }
    },
    help: "echo [text...]",
    description: "Display a line of text",
    usage: "echo [text...]",
    examples: ["echo Hello, world!", 'echo "This is a quoted string"'],
  },

  date: {
    execute: async (args, options): Promise<CommandResult> => {
      const now = new Date()
      return {
        output: now.toString(),
        status: "success",
      }
    },
    help: "date",
    description: "Display the current date and time",
    usage: "date",
    examples: ["date"],
  },

  whoami: {
    execute: async (args, options): Promise<CommandResult> => {
      return {
        output: "AIDEN Terminal User",
        status: "success",
      }
    },
    help: "whoami",
    description: "Display the current user",
    usage: "whoami",
    examples: ["whoami"],
  },

  ls: {
    execute: async (args, options): Promise<CommandResult> => {
      // Simulate a file listing
      const files = ["documents/", "projects/", "tools/", "README.md", "config.json"]

      return {
        output: files.join("\n"),
        status: "success",
      }
    },
    help: "ls",
    description: "List directory contents",
    usage: "ls",
    examples: ["ls"],
  },

  pwd: {
    execute: async (args, options): Promise<CommandResult> => {
      return {
        output: "/home/aiden",
        status: "success",
      }
    },
    help: "pwd",
    description: "Print working directory",
    usage: "pwd",
    examples: ["pwd"],
  },

  version: {
    execute: async (args, options): Promise<CommandResult> => {
      return {
        output: "AIDEN Terminal v1.0.0",
        status: "success",
      }
    },
    help: "version",
    description: "Display terminal version",
    usage: "version",
    examples: ["version"],
  },

  about: {
    execute: async (args, options): Promise<CommandResult> => {
      return {
        output: `AIDEN Terminal
Version: 1.0.0
A sophisticated terminal interface for executing specialized functions
tailored to different operational modes.`,
        status: "info",
      }
    },
    help: "about",
    description: "Display information about the terminal",
    usage: "about",
    examples: ["about"],
  },
}
