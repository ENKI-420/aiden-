export const aiProviders = {
  openai: {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  },
  azure: {
    apiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
    endpoint: process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || "",
  },
  gemini: {
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  },
  togetherai: {
    apiKey: process.env.NEXT_PUBLIC_TOGETHERAI_API_KEY || "",
  },
  codesral: {
    apiKey: process.env.NEXT_PUBLIC_CODESRAL_API_KEY || "",
  },
}
