import { prisma } from "@/lib/db"

async function main() {
  console.log("Initializing database...")

  // Create sample memory threads
  const memories = [
    {
      title: "Project Spectra Overview",
      content:
        "Project Spectra is a genomic research initiative focused on identifying novel therapeutic targets for oncology applications. Current phase: 2. Completion: 87%. Next milestone: Integration testing scheduled for April 15th.",
      emotionalTuning: "neutral",
      accessLevel: "public",
      rolesAllowed: ["admin", "AIDEN", "clinician"],
    },
    {
      title: "Security Protocol Alpha",
      content:
        "Security Protocol Alpha includes multi-factor authentication, end-to-end encryption, and regular security audits. All team members must comply with these protocols when accessing sensitive data.",
      emotionalTuning: "strategic",
      accessLevel: "restricted",
      rolesAllowed: ["admin", "AIDEN"],
    },
    {
      title: "Genomic Sequencing Results",
      content:
        "The latest genomic sequencing results show promising markers for targeted therapy development. Key genes identified: BRCA1, TP53, and EGFR. Further analysis is required to confirm these findings.",
      emotionalTuning: "introspective",
      accessLevel: "private",
      rolesAllowed: ["admin", "AIDEN", "clinician"],
    },
  ]

  console.log("Creating sample memory threads...")

  for (const memory of memories) {
    await prisma.memoryThread.create({
      data: {
        title: memory.title,
        content: memory.content,
        emotionalTuning: memory.emotionalTuning as any,
        accessLevel: memory.accessLevel as any,
        rolesAllowed: memory.rolesAllowed,
      },
    })
  }

  console.log("Database initialization complete!")
}

main()
  .catch((e) => {
    console.error("Error during database initialization:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
