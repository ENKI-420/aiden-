/**
 * Service for interacting with the DigitalBio API
 * This service provides methods for fetching 3D biological models
 */

// Types for the DigitalBio API
export interface DigitalBioModel {
  id: string
  name: string
  description: string
  type: "protein" | "gene" | "mutation" | "pathway"
  modelUrl: string
  thumbnailUrl: string
  metadata: {
    gene?: string
    mutation?: string
    chromosome?: string
    position?: string
    pdbId?: string
    uniprotId?: string
    clinicalSignificance?: string
    source?: string
  }
  annotations?: {
    id: string
    label: string
    description: string
    position: [number, number, number]
    color?: string
  }[]
}

export interface ModelSearchParams {
  gene?: string
  mutation?: string
  type?: "protein" | "gene" | "mutation" | "pathway"
  patientId?: string
  limit?: number
}

class DigitalBioApiService {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.DIGITAL_BIO_API_URL || "https://api.digitalbio.org/v1"
    this.apiKey = process.env.DIGITAL_BIO_API_KEY || ""
  }

  /**
   * Search for 3D models based on parameters
   */
  async searchModels(params: ModelSearchParams): Promise<DigitalBioModel[]> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll return mock data
      return this.getMockModels(params)
    } catch (error) {
      console.error("Error searching models:", error)
      throw error
    }
  }

  /**
   * Get a specific model by ID
   */
  async getModel(id: string): Promise<DigitalBioModel> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll return mock data
      const mockModels = this.getMockModels({})
      const model = mockModels.find((m) => m.id === id)

      if (!model) {
        throw new Error(`Model with ID ${id} not found`)
      }

      return model
    } catch (error) {
      console.error("Error getting model:", error)
      throw error
    }
  }

  /**
   * Get models related to a specific mutation
   */
  async getModelsForMutation(gene: string, mutation: string): Promise<DigitalBioModel[]> {
    return this.searchModels({ gene, mutation })
  }

  /**
   * Get models for a patient based on their genomic data
   */
  async getModelsForPatient(patientId: string, mutations: any[]): Promise<DigitalBioModel[]> {
    // In a real implementation, this would use the mutations to find relevant models
    // For now, we'll return mock data based on the mutations
    const models: DigitalBioModel[] = []

    for (const mutation of mutations) {
      const mutationModels = await this.getModelsForMutation(mutation.gene, mutation.mutation)
      models.push(...mutationModels)
    }

    return models
  }

  /**
   * Generate mock models for development and testing
   */
  private getMockModels(params: ModelSearchParams): DigitalBioModel[] {
    // Common genes and their associated models
    const geneModels: Record<string, DigitalBioModel[]> = {
      BRAF: [
        {
          id: "model-braf-protein",
          name: "BRAF Protein Structure",
          description: "3D model of the BRAF protein showing the kinase domain",
          type: "protein",
          modelUrl: "/assets/3d/duck.glb", // Using duck as placeholder
          thumbnailUrl: "/BRAF-kinase-domain.png",
          metadata: {
            gene: "BRAF",
            pdbId: "4MNE",
            uniprotId: "P15056",
            source: "PDB",
          },
          annotations: [
            {
              id: "anno-braf-1",
              label: "V600E Mutation Site",
              description: "Common mutation site that substitutes valine with glutamic acid",
              position: [0, 1, 0],
              color: "#ff0000",
            },
            {
              id: "anno-braf-2",
              label: "ATP Binding Site",
              description: "Site where ATP binds to the kinase domain",
              position: [1, 0, 0],
              color: "#00ff00",
            },
          ],
        },
        {
          id: "model-braf-v600e",
          name: "BRAF V600E Mutation",
          description: "3D model showing the structural changes caused by the V600E mutation",
          type: "mutation",
          modelUrl: "/assets/3d/duck.glb", // Using duck as placeholder
          thumbnailUrl: "/BRAF-V600E-Mutation-Visualization.png",
          metadata: {
            gene: "BRAF",
            mutation: "V600E",
            chromosome: "7",
            position: "140453136",
            clinicalSignificance: "Pathogenic",
            source: "COSMIC",
          },
          annotations: [
            {
              id: "anno-v600e-1",
              label: "V600E Mutation",
              description: "Substitution of valine with glutamic acid at position 600",
              position: [0, 0, 1],
              color: "#ff0000",
            },
          ],
        },
      ],
      EGFR: [
        {
          id: "model-egfr-protein",
          name: "EGFR Protein Structure",
          description: "3D model of the EGFR protein showing the tyrosine kinase domain",
          type: "protein",
          modelUrl: "/assets/3d/duck.glb", // Using duck as placeholder
          thumbnailUrl: "/EGFR-Structure.png",
          metadata: {
            gene: "EGFR",
            pdbId: "3W2S",
            uniprotId: "P00533",
            source: "PDB",
          },
          annotations: [
            {
              id: "anno-egfr-1",
              label: "T790M Mutation Site",
              description: "Common mutation site associated with resistance to TKIs",
              position: [0, 1, 0],
              color: "#ff0000",
            },
          ],
        },
        {
          id: "model-egfr-t790m",
          name: "EGFR T790M Mutation",
          description: "3D model showing the structural changes caused by the T790M mutation",
          type: "mutation",
          modelUrl: "/assets/3d/duck.glb", // Using duck as placeholder
          thumbnailUrl: "/EGFR-T790M-Mutation.png",
          metadata: {
            gene: "EGFR",
            mutation: "T790M",
            chromosome: "7",
            position: "55249071",
            clinicalSignificance: "Pathogenic",
            source: "COSMIC",
          },
          annotations: [
            {
              id: "anno-t790m-1",
              label: "T790M Mutation",
              description: "Substitution of threonine with methionine at position 790",
              position: [0, 0, 1],
              color: "#ff0000",
            },
          ],
        },
      ],
      KRAS: [
        {
          id: "model-kras-protein",
          name: "KRAS Protein Structure",
          description: "3D model of the KRAS protein showing the GTPase domain",
          type: "protein",
          modelUrl: "/assets/3d/duck.glb", // Using duck as placeholder
          thumbnailUrl: "/KRAS-protein-ribbon.png",
          metadata: {
            gene: "KRAS",
            pdbId: "4DSN",
            uniprotId: "P01116",
            source: "PDB",
          },
          annotations: [
            {
              id: "anno-kras-1",
              label: "G12D Mutation Site",
              description: "Common mutation site that substitutes glycine with aspartic acid",
              position: [0, 1, 0],
              color: "#ff0000",
            },
          ],
        },
        {
          id: "model-kras-g12d",
          name: "KRAS G12D Mutation",
          description: "3D model showing the structural changes caused by the G12D mutation",
          type: "mutation",
          modelUrl: "/assets/3d/duck.glb", // Using duck as placeholder
          thumbnailUrl: "/placeholder.svg?height=200&width=200&query=KRAS G12D mutation",
          metadata: {
            gene: "KRAS",
            mutation: "G12D",
            chromosome: "12",
            position: "25398284",
            clinicalSignificance: "Pathogenic",
            source: "COSMIC",
          },
          annotations: [
            {
              id: "anno-g12d-1",
              label: "G12D Mutation",
              description: "Substitution of glycine with aspartic acid at position 12",
              position: [0, 0, 1],
              color: "#ff0000",
            },
          ],
        },
      ],
    }

    // Filter models based on search parameters
    let filteredModels: DigitalBioModel[] = []

    // If gene is specified, return models for that gene
    if (params.gene) {
      filteredModels = geneModels[params.gene] || []

      // If mutation is also specified, filter further
      if (params.mutation && filteredModels.length > 0) {
        filteredModels = filteredModels.filter((model) => model.metadata.mutation === params.mutation)
      }
    } else {
      // If no gene specified, return all models
      Object.values(geneModels).forEach((models) => {
        filteredModels.push(...models)
      })
    }

    // Filter by type if specified
    if (params.type) {
      filteredModels = filteredModels.filter((model) => model.type === params.type)
    }

    // Apply limit if specified
    if (params.limit && params.limit > 0 && filteredModels.length > params.limit) {
      filteredModels = filteredModels.slice(0, params.limit)
    }

    return filteredModels
  }
}

// Export a singleton instance
export const digitalBioApi = new DigitalBioApiService()
