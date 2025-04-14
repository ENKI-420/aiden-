"use client"

import { useState, useEffect } from "react"

export const EPIC_SANDBOX_URI = "https://fhir.epic.com/Sandbox/api/FHIR/R4"

// Types for FHIR resources
export interface FHIRPatient {
  id: string
  resourceType: "Patient"
  name: { given: string[]; family: string }[]
  gender?: string
  birthDate?: string
  identifier?: { system: string; value: string }[]
  telecom?: { system: string; value: string; use?: string }[]
  address?: { line: string[]; city: string; state: string; postalCode: string }[]
}

export interface FHIRObservation {
  id: string
  resourceType: "Observation"
  status: string
  code: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  subject: {
    reference: string
  }
  effectiveDateTime: string
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
  }
  valueString?: string
  valueCodeableConcept?: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  component?: {
    code: {
      coding: {
        system: string
        code: string
        display: string
      }[]
    }
    valueQuantity?: {
      value: number
      unit: string
      system: string
      code: string
    }
    valueString?: string
  }[]
}

export interface FHIRCondition {
  id: string
  resourceType: "Condition"
  clinicalStatus: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  verificationStatus: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  category: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }[]
  code: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  subject: {
    reference: string
  }
  onsetDateTime?: string
  recordedDate?: string
}

export interface FHIRMedicationRequest {
  id: string
  resourceType: "MedicationRequest"
  status: string
  intent: string
  medicationCodeableConcept: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  subject: {
    reference: string
  }
  authoredOn: string
  requester: {
    reference: string
  }
  dosageInstruction?: {
    text: string
    timing?: {
      repeat?: {
        frequency: number
        period: number
        periodUnit: string
      }
    }
    doseAndRate?: {
      doseQuantity?: {
        value: number
        unit: string
      }
    }[]
  }[]
}

export interface FHIRBundle {
  resourceType: "Bundle"
  type: string
  total: number
  entry: any[]
}

// Mock genomic data generator
const generateMockGenomicData = (patientId: string) => {
  // Use patient ID as seed for deterministic randomness
  // Changed from const to let to allow modification
  let seedValue = patientId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (min: number, max: number) => {
    const x = Math.sin(seedValue++) * 10000
    return min + (x - Math.floor(x)) * (max - min)
  }

  // Generate RAScore based on patient ID (deterministic)
  const generateRAScore = (gene: string) => {
    const geneSeed = gene.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return 0.5 + Math.sin(seedValue + geneSeed) * 0.5
  }

  // Common mutations
  const mutations = [
    { gene: "BRAF", mutation: "V600E", chromosome: "7", position: "140453136" },
    { gene: "KRAS", mutation: "G12D", chromosome: "12", position: "25398284" },
    { gene: "EGFR", mutation: "T790M", chromosome: "7", position: "55249071" },
    { gene: "TP53", mutation: "R175H", chromosome: "17", position: "7578406" },
    { gene: "PIK3CA", mutation: "E545K", chromosome: "3", position: "178936091" },
    { gene: "NRAS", mutation: "Q61R", chromosome: "1", position: "115256530" },
  ]

  // Select 2-4 mutations based on patient ID
  const numMutations = Math.floor(random(2, 5))
  const selectedMutations = []

  for (let i = 0; i < numMutations; i++) {
    const index = Math.floor(random(0, mutations.length))
    const mutation = mutations[index]

    selectedMutations.push({
      id: `mut-${patientId}-${i}`,
      gene: mutation.gene,
      mutation: mutation.mutation,
      chromosome: mutation.chromosome,
      position: mutation.position,
      rascore: generateRAScore(mutation.gene),
      stability: random(0, 1) > 0.5 ? "High" : random(0, 1) > 0.5 ? "Medium" : "Low",
      drugs: getDrugsForGene(mutation.gene),
      clinicalSignificance: "Pathogenic",
      cancerTypes: getCancerTypesForGene(mutation.gene),
    })
  }

  return selectedMutations
}

// Helper functions for mock data
const getDrugsForGene = (gene: string) => {
  const drugMap: Record<string, string[]> = {
    BRAF: ["Vemurafenib", "Dabrafenib", "Encorafenib"],
    KRAS: ["Sotorasib", "Adagrasib"],
    EGFR: ["Osimertinib", "Gefitinib", "Erlotinib"],
    TP53: ["APR-246", "COTI-2"],
    PIK3CA: ["Alpelisib", "Taselisib"],
    NRAS: ["Binimetinib", "Trametinib"],
  }

  return drugMap[gene] || []
}

const getCancerTypesForGene = (gene: string) => {
  const cancerMap: Record<string, string[]> = {
    BRAF: ["Melanoma", "Colorectal", "NSCLC"],
    KRAS: ["Pancreatic", "Colorectal", "NSCLC"],
    EGFR: ["NSCLC", "Glioblastoma"],
    TP53: ["Multiple"],
    PIK3CA: ["Breast", "Colorectal"],
    NRAS: ["Melanoma", "Thyroid"],
  }

  return cancerMap[gene] || []
}

export class FHIRClient {
  private baseUrl: string
  private authToken: string | null = null
  private useMockData: boolean

  constructor(baseUrl: string = EPIC_SANDBOX_URI, useMockData = false) {
    this.baseUrl = baseUrl
    this.useMockData = useMockData
  }

  async getAuthToken(clientId: string, clientSecret: string): Promise<string> {
    try {
      if (this.useMockData) {
        return "mock-auth-token"
      }

      const response = await fetch("/api/epic-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, clientSecret }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get auth token: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      this.authToken = data.access_token
      return this.authToken
    } catch (error) {
      console.error("Error getting auth token:", error)
      throw error
    }
  }

  async getPatient(patientId: string): Promise<FHIRPatient> {
    if (this.useMockData) {
      return {
        id: patientId,
        resourceType: "Patient",
        name: [{ given: ["John"], family: "Doe" }],
        gender: "male",
        birthDate: "1970-01-01",
        identifier: [{ system: "urn:oid:1.2.840.114350.1.13.0.1.7.5.737384.0", value: patientId }],
      }
    }

    const response = await this.fetchResource(`Patient/${patientId}`)
    return response as FHIRPatient
  }

  async searchPatients(searchParams: Record<string, string>): Promise<FHIRPatient[]> {
    if (this.useMockData) {
      return [
        {
          id: "patient-1",
          resourceType: "Patient",
          name: [{ given: ["John"], family: "Doe" }],
          gender: "male",
          birthDate: "1970-01-01",
        },
        {
          id: "patient-2",
          resourceType: "Patient",
          name: [{ given: ["Jane"], family: "Smith" }],
          gender: "female",
          birthDate: "1980-05-15",
        },
      ]
    }

    const queryString = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")

    const response = await this.fetchResource(`Patient?${queryString}`)
    return response.entry?.map((entry: any) => entry.resource) || []
  }

  async getObservations(patientId: string, code?: string): Promise<FHIRObservation[]> {
    if (this.useMockData) {
      // For mock data, we'll simulate genomic observations
      const mockObservations: FHIRObservation[] = [
        {
          id: `obs-${patientId}-1`,
          resourceType: "Observation",
          status: "final",
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "81247-9",
                display: "Master HL7 genetic variant reporting panel",
              },
            ],
          },
          subject: {
            reference: `Patient/${patientId}`,
          },
          effectiveDateTime: "2023-01-15T08:30:00Z",
          valueString: "Genomic variant analysis completed",
          component: [
            {
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "48018-6",
                    display: "Gene studied [ID]",
                  },
                ],
              },
              valueString: "BRAF, KRAS, EGFR, TP53, PIK3CA, NRAS",
            },
          ],
        },
      ]

      // Generate genomic data based on patient ID
      const genomicData = generateMockGenomicData(patientId)

      // Add observations for each mutation
      genomicData.forEach((mutation, index) => {
        mockObservations.push({
          id: `obs-${patientId}-gene-${index}`,
          resourceType: "Observation",
          status: "final",
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "69548-6",
                display: "Genetic variant assessment",
              },
            ],
          },
          subject: {
            reference: `Patient/${patientId}`,
          },
          effectiveDateTime: "2023-01-15T08:30:00Z",
          valueCodeableConcept: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "10828004",
                display: "Positive",
              },
            ],
          },
          component: [
            {
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "48018-6",
                    display: "Gene studied [ID]",
                  },
                ],
              },
              valueString: mutation.gene,
            },
            {
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "81252-9",
                    display: "Discrete genetic variant",
                  },
                ],
              },
              valueString: `${mutation.gene} ${mutation.mutation}`,
            },
            {
              code: {
                coding: [
                  {
                    system: "http://loinc.org",
                    code: "48001-2",
                    display: "Cytogenetic location",
                  },
                ],
              },
              valueString: `chr${mutation.chromosome}:${mutation.position}`,
            },
          ],
        })
      })

      return mockObservations
    }

    let url = `Observation?patient=${patientId}`
    if (code) {
      url += `&code=${code}`
    }

    const response = await this.fetchResource(url)
    return response.entry?.map((entry: any) => entry.resource) || []
  }

  async getConditions(patientId: string): Promise<FHIRCondition[]> {
    if (this.useMockData) {
      return [
        {
          id: `cond-${patientId}-1`,
          resourceType: "Condition",
          clinicalStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active",
                display: "Active",
              },
            ],
          },
          verificationStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-ver-status",
                code: "confirmed",
                display: "Confirmed",
              },
            ],
          },
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/condition-category",
                  code: "problem-list-item",
                  display: "Problem List Item",
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "254837009",
                display: "Malignant melanoma",
              },
            ],
          },
          subject: {
            reference: `Patient/${patientId}`,
          },
          onsetDateTime: "2022-11-30",
          recordedDate: "2022-12-05",
        },
      ]
    }

    const response = await this.fetchResource(`Condition?patient=${patientId}`)
    return response.entry?.map((entry: any) => entry.resource) || []
  }

  async getMedicationRequests(patientId: string): Promise<FHIRMedicationRequest[]> {
    if (this.useMockData) {
      // Get genomic data to determine appropriate medications
      const genomicData = generateMockGenomicData(patientId)
      const medications: FHIRMedicationRequest[] = []

      // Create medication requests based on mutations
      genomicData.forEach((mutation, index) => {
        if (mutation.drugs.length > 0) {
          const drug = mutation.drugs[0] // Take first recommended drug

          medications.push({
            id: `med-${patientId}-${index}`,
            resourceType: "MedicationRequest",
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
              coding: [
                {
                  system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                  code: "1000000", // Placeholder code
                  display: drug,
                },
              ],
            },
            subject: {
              reference: `Patient/${patientId}`,
            },
            authoredOn: "2023-02-01",
            requester: {
              reference: "Practitioner/123",
            },
            dosageInstruction: [
              {
                text: `Take as directed for ${mutation.gene} ${mutation.mutation} mutation`,
                timing: {
                  repeat: {
                    frequency: 1,
                    period: 1,
                    periodUnit: "d",
                  },
                },
                doseAndRate: [
                  {
                    doseQuantity: {
                      value: 1,
                      unit: "tablet",
                    },
                  },
                ],
              },
            ],
          })
        }
      })

      return medications
    }

    const response = await this.fetchResource(`MedicationRequest?patient=${patientId}`)
    return response.entry?.map((entry: any) => entry.resource) || []
  }

  async getGenomicData(patientId: string): Promise<any[]> {
    try {
      // In a real implementation, this would extract genomic data from observations
      // For now, we'll use our mock generator
      if (this.useMockData) {
        return generateMockGenomicData(patientId)
      }

      // In a real implementation, we would:
      // 1. Get genomic observations
      const observations = await this.getObservations(patientId, "81247-9,69548-6")

      // 2. Extract genomic data from observations
      // This is a simplified example - real implementation would be more complex
      const genomicData: any[] = []

      observations.forEach((obs) => {
        if (obs.component) {
          // Extract gene information
          const geneComponent = obs.component.find((c) => c.code.coding.some((coding) => coding.code === "48018-6"))

          // Extract variant information
          const variantComponent = obs.component.find((c) => c.code.coding.some((coding) => coding.code === "81252-9"))

          // Extract location information
          const locationComponent = obs.component.find((c) => c.code.coding.some((coding) => coding.code === "48001-2"))

          if (geneComponent?.valueString && variantComponent?.valueString) {
            const gene = geneComponent.valueString
            const fullVariant = variantComponent.valueString
            const mutation = fullVariant.replace(gene, "").trim()

            // Parse chromosome and position from location
            let chromosome = ""
            let position = ""

            if (locationComponent?.valueString) {
              const locationMatch = locationComponent.valueString.match(/chr(\w+):(\d+)/)
              if (locationMatch) {
                chromosome = locationMatch[1]
                position = locationMatch[2]
              }
            }

            genomicData.push({
              id: `mut-${obs.id}`,
              gene,
              mutation,
              chromosome,
              position,
              rascore: 0.75, // Would need a real algorithm to calculate this
              stability: "Medium",
              drugs: getDrugsForGene(gene),
              clinicalSignificance: "Pathogenic",
              cancerTypes: getCancerTypesForGene(gene),
            })
          }
        }
      })

      return genomicData
    } catch (error) {
      console.error("Error getting genomic data:", error)
      // Fall back to mock data if there's an error
      return generateMockGenomicData(patientId)
    }
  }

  private async fetchResource(path: string): Promise<any> {
    if (!this.authToken && !this.useMockData) {
      throw new Error("Authentication token not available. Call getAuthToken first.")
    }

    try {
      const response = await fetch(`/api/fhir-proxy?path=${encodeURIComponent(path)}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`FHIR request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching FHIR resource ${path}:`, error)
      throw error
    }
  }
}

// Hook for using the FHIR client
export function useFHIRClient(useMockData = false) {
  const [client, setClient] = useState<FHIRClient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initClient = async () => {
      try {
        // Check if we should use mock data from environment variable
        const shouldUseMockData = useMockData || process.env.USE_MOCK_EPIC === "true"

        const fhirClient = new FHIRClient(EPIC_SANDBOX_URI, shouldUseMockData)

        // If we're using mock data, we don't need to authenticate
        if (!shouldUseMockData) {
          // In a real app, these would come from environment variables or a secure store
          const clientId = process.env.AGILE_CLIENT_ID || ""
          const clientSecret = process.env.EPIC_SANDBOX_CLIENT_SECRET || ""

          if (!clientId || !clientSecret) {
            throw new Error("Missing EPIC API credentials")
          }

          await fhirClient.getAuthToken(clientId, clientSecret)
        }

        setClient(fhirClient)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to initialize FHIR client:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)

        // Create a mock client as fallback
        setClient(new FHIRClient(EPIC_SANDBOX_URI, true))
      }
    }

    initClient()
  }, [useMockData])

  return { client, isLoading, error }
}
