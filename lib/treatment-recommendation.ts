// Simple types for treatment recommendations
export interface TreatmentRecommendation {
  drugName: string
  description: string
  approvalStatus: string
  gene?: string
  mutation?: string
  confidenceScore?: number
  recommendedTreatments?: any[]
  clinicalTrials?: any[]
}

export interface TreatmentPlan {
  patientId: string
  recommendations: any[]
  generatedDate: string
  aiModelVersion?: string
  overallSuccessProbability?: number
  disclaimer?: string
}

// Simple mock data generator
export function generateMockTreatmentPlan(patientId: string): TreatmentPlan {
  return {
    patientId,
    generatedDate: new Date().toISOString(),
    aiModelVersion: "v1.2.3",
    overallSuccessProbability: 0.85,
    disclaimer:
      "This is an AI-generated treatment recommendation and should be reviewed by a qualified healthcare professional.",
    recommendations: [
      {
        gene: "EGFR",
        mutation: "Exon 19 del",
        confidenceScore: 0.92,
        recommendedTreatments: [
          {
            drugName: "Osimertinib",
            drugClass: "EGFR Tyrosine Kinase Inhibitor",
            description: "A third-generation EGFR TKI that is highly effective for EGFR Exon 19 deletion mutations.",
            approvalStatus: "FDA Approved",
            evidenceLevel: "Level 1",
            dosingInfo: "80mg daily, orally",
            sideEffects: ["Rash", "Diarrhea", "Fatigue"],
          },
        ],
        clinicalTrials: [
          {
            id: "NCT01234567",
            title: "Osimertinib vs Chemotherapy in EGFR-Mutated NSCLC",
            phase: "Phase III",
            status: "Completed",
          },
        ],
      },
      {
        gene: "TP53",
        mutation: "R273H",
        confidenceScore: 0.78,
        recommendedTreatments: [
          {
            drugName: "Pembrolizumab",
            drugClass: "PD-1 Inhibitor",
            description: "An immune checkpoint inhibitor that may be effective in TP53-mutated tumors.",
            approvalStatus: "FDA Approved",
            evidenceLevel: "Level 2",
            dosingInfo: "200mg IV every 3 weeks",
            sideEffects: ["Fatigue", "Rash", "Pneumonitis"],
          },
        ],
        clinicalTrials: [
          {
            id: "NCT07891234",
            title: "Pembrolizumab + Chemotherapy in TP53-Mutated NSCLC",
            phase: "Phase II",
            status: "Recruiting",
          },
        ],
      },
    ],
  }
}
