import type { CommandRegistry } from "./types"
import { generalCommands } from "./commands/general"
import { redTeamingCommands } from "./commands/red-teaming"
import { reverseEngineeringCommands } from "./commands/reverse-engineering"
import { businessAdminCommands } from "./commands/business-admin"
import { webDevelopmentCommands } from "./commands/web-development"
import { appDevelopmentCommands } from "./commands/app-development"
import { physicsResearchCommands } from "./commands/physics-research"

// Cache for command registries to avoid reloading
const registryCache: Record<string, CommandRegistry> = {}

export async function getCommandRegistry(mode: string): Promise<CommandRegistry> {
  // Return from cache if available
  if (registryCache[mode]) {
    return registryCache[mode]
  }

  // Base commands available in all modes
  let registry: CommandRegistry = { ...generalCommands }

  // Add mode-specific commands
  switch (mode) {
    case "red-teaming":
      registry = { ...registry, ...redTeamingCommands }
      break
    case "reverse-engineering":
      registry = { ...registry, ...reverseEngineeringCommands }
      break
    case "business-admin":
      registry = { ...registry, ...businessAdminCommands }
      break
    case "web-development":
      registry = { ...registry, ...webDevelopmentCommands }
      break
    case "app-development":
      registry = { ...registry, ...appDevelopmentCommands }
      break
    case "physics-research":
      registry = { ...registry, ...physicsResearchCommands }
      break
    default:
      // General mode only has base commands
      break
  }

  // Cache the registry
  registryCache[mode] = registry

  return registry
}
