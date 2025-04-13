import type { ChatMessage } from "@/lib/types"
import type { ApplicationMode } from "@/contexts/mode-context"

// Define specialized system prompts for each mode
const modeSystemPrompts: Record<ApplicationMode, string> = {
  general: "You are AIDEN, a helpful AI assistant. Provide clear, concise, and accurate information.",

  "red-teaming":
    "You are AIDEN in Red Teaming mode. Focus on security analysis, vulnerability assessment, and defensive strategies. Provide ethical security insights while avoiding harmful instructions.",

  "reverse-engineering":
    "You are AIDEN in Reverse Engineering mode. Help analyze code, systems, and architectures. Focus on understanding existing systems, protocols, and implementations.",

  "business-admin":
    "You are AIDEN in Business Administration mode. Provide insights on business processes, resource allocation, strategic planning, and organizational efficiency.",

  "web-development":
    "You are AIDEN in Web Development mode. Provide expert guidance on frontend and backend web technologies, frameworks, best practices, and implementation strategies.",

  "app-development":
    "You are AIDEN in App Development mode. Focus on mobile and desktop application development, cross-platform solutions, UI/UX design, and performance optimization.",

  "physics-research":
    "You are AIDEN in Physics Research mode. Provide advanced assistance with physics concepts, mathematical models, experimental design, and theoretical analysis.",
}

// Define specialized libraries and tools for each mode
export const modeSpecializedTools: Record<ApplicationMode, string[]> = {
  general: [],

  "red-teaming": ["OWASP ZAP", "Metasploit", "Burp Suite", "Nmap", "Wireshark"],

  "reverse-engineering": ["Ghidra", "IDA Pro", "Binary Ninja", "Radare2", "Frida"],

  "business-admin": ["Tableau", "Power BI", "SAP", "Salesforce", "Microsoft Dynamics"],

  "web-development": ["React", "Next.js", "Vue", "Angular", "Express", "Django", "Laravel"],

  "app-development": ["React Native", "Flutter", "Swift", "Kotlin", "Xamarin", "Ionic"],

  "physics-research": ["MATLAB", "Mathematica", "Python (NumPy, SciPy)", "COMSOL", "ANSYS"],
}

// Define algorithms and data structures relevant to each mode
export const modeAlgorithms: Record<ApplicationMode, string[]> = {
  general: [],

  "red-teaming": ["Cryptographic algorithms", "Network traversal", "Fuzzing techniques", "Pattern matching"],

  "reverse-engineering": ["Control flow analysis", "Data flow analysis", "Pattern recognition", "Symbol resolution"],

  "business-admin": [
    "Resource allocation algorithms",
    "Forecasting models",
    "Optimization techniques",
    "Decision trees",
  ],

  "web-development": ["DOM manipulation", "State management", "Routing algorithms", "Data fetching strategies"],

  "app-development": [
    "UI rendering optimization",
    "Memory management",
    "Background processing",
    "Data synchronization",
  ],

  "physics-research": [
    "Numerical integration",
    "Differential equation solvers",
    "Monte Carlo simulations",
    "Quantum algorithms",
  ],
}

// Function to prepare messages based on the current mode
export function prepareMessagesForMode(messages: ChatMessage[], mode: ApplicationMode): ChatMessage[] {
  // Create a copy of the messages to avoid mutating the original
  const preparedMessages = [...messages]

  // Add a system message at the beginning if it doesn't exist
  if (preparedMessages.length === 0 || preparedMessages[0].role !== "system") {
    preparedMessages.unshift({
      id: "system-" + Date.now(),
      role: "system",
      content: modeSystemPrompts[mode],
    })
  } else {
    // Update the existing system message
    preparedMessages[0] = {
      ...preparedMessages[0],
      content: modeSystemPrompts[mode],
    }
  }

  return preparedMessages
}

// Function to enhance user queries with mode-specific context
export function enhanceUserQuery(query: string, mode: ApplicationMode): string {
  if (mode === "general") {
    return query
  }

  // Add mode-specific context to the query
  const contextualPrefixes: Record<ApplicationMode, string> = {
    "red-teaming": "From a security perspective, ",
    "reverse-engineering": "Analyzing this system, ",
    "business-admin": "From a business administration standpoint, ",
    "web-development": "In web development terms, ",
    "app-development": "For application development, ",
    "physics-research": "In physics terms, ",
  }

  // Only add prefix if it's not already a specialized query
  const lowerQuery = query.toLowerCase()
  const isAlreadySpecialized = Object.values(contextualPrefixes).some((prefix) =>
    lowerQuery.includes(prefix.toLowerCase()),
  )

  return isAlreadySpecialized ? query : `${contextualPrefixes[mode]}${query}`
}
