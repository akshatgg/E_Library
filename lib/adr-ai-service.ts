export interface ADRSuggestion {
  method: string
  suitability: number
  description: string
  pros: string[]
  cons: string[]
  process: string[]
  timeframe: string
  cost: string
  requirements: string[]
}

export interface CaseAnalysis {
  caseType: string
  complexity: "Low" | "Medium" | "High"
  disputeValue: string
  urgency: "Low" | "Medium" | "High"
  relationshipImportance: "Low" | "Medium" | "High"
}

// Mock AI service without external dependencies
export class ADRAIService {
  static async analyzeCaseForADR(caseDetails: string, analysis: CaseAnalysis): Promise<ADRSuggestion[]> {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const suggestions: ADRSuggestion[] = [
      {
        method: "Mediation",
        suitability: this.calculateMediationSuitability(analysis),
        description:
          "A voluntary process where a neutral third party helps parties reach a mutually acceptable solution.",
        pros: ["Cost-effective", "Confidential", "Preserves relationships", "Quick resolution"],
        cons: ["No binding decision", "Requires cooperation", "May not work for complex cases"],
        process: ["Select mediator", "Initial meeting", "Joint sessions", "Private caucuses", "Agreement drafting"],
        timeframe: "2-6 months",
        cost: "₹25,000 - ₹1,00,000",
        requirements: ["Willingness to negotiate", "Good faith participation", "Confidentiality agreement"],
      },
      {
        method: "Arbitration",
        suitability: this.calculateArbitrationSuitability(analysis),
        description: "A binding process where disputes are resolved by one or more arbitrators outside of court.",
        pros: ["Binding decision", "Expert arbitrators", "Faster than court", "Private process"],
        cons: ["Higher cost than mediation", "Limited appeal options", "Formal process"],
        process: ["Arbitrator selection", "Preliminary hearing", "Evidence submission", "Final hearing", "Award"],
        timeframe: "6-18 months",
        cost: "₹2,00,000 - ₹10,00,000",
        requirements: ["Arbitration clause/agreement", "Legal representation recommended", "Evidence preparation"],
      },
      {
        method: "Conciliation",
        suitability: this.calculateConciliationSuitability(analysis),
        description: "A process where a conciliator assists parties in reaching an amicable settlement.",
        pros: ["Flexible process", "Conciliator can suggest solutions", "Cost-effective", "Confidential"],
        cons: ["Non-binding unless agreed", "Depends on conciliator skill", "May take time"],
        process: [
          "Conciliator appointment",
          "Statement of facts",
          "Joint meetings",
          "Separate meetings",
          "Settlement agreement",
        ],
        timeframe: "3-9 months",
        cost: "₹50,000 - ₹3,00,000",
        requirements: ["Mutual consent", "Good faith participation", "Disclosure of relevant facts"],
      },
      {
        method: "Lok Adalat",
        suitability: this.calculateLokAdaltSuitability(analysis),
        description: "A forum where disputes are settled through compromise with the help of retired judges.",
        pros: ["No court fee", "Quick disposal", "Amicable settlement", "No appeal"],
        cons: ["Limited to certain cases", "Compromise required", "No binding precedent"],
        process: ["Case referral", "Notice to parties", "Lok Adalat sitting", "Settlement discussion", "Award"],
        timeframe: "1-3 months",
        cost: "Minimal (₹500 - ₹5,000)",
        requirements: ["Eligible case type", "Willingness to compromise", "Attendance at proceedings"],
      },
      {
        method: "Online Dispute Resolution (ODR)",
        suitability: this.calculateODRSuitability(analysis),
        description: "Technology-enabled dispute resolution conducted entirely online.",
        pros: ["Convenient", "Cost-effective", "Quick process", "Accessible remotely"],
        cons: ["Technology dependent", "Limited to certain disputes", "Digital divide issues"],
        process: [
          "Platform registration",
          "Case filing",
          "Online mediation/arbitration",
          "Digital agreement",
          "Enforcement",
        ],
        timeframe: "1-4 months",
        cost: "₹10,000 - ₹1,00,000",
        requirements: ["Internet access", "Digital literacy", "Electronic evidence", "Online payment"],
      },
    ]

    return suggestions.sort((a, b) => b.suitability - a.suitability)
  }

  private static calculateMediationSuitability(analysis: CaseAnalysis): number {
    let score = 60 // Base score

    if (analysis.relationshipImportance === "High") score += 20
    if (analysis.complexity === "Low") score += 15
    if (analysis.urgency === "High") score += 10
    if (analysis.caseType.includes("Commercial") || analysis.caseType.includes("Family")) score += 10

    return Math.min(score, 95)
  }

  private static calculateArbitrationSuitability(analysis: CaseAnalysis): number {
    let score = 70 // Base score

    if (analysis.complexity === "High") score += 15
    if (analysis.disputeValue.includes("High") || analysis.disputeValue.includes("Crore")) score += 15
    if (analysis.caseType.includes("Commercial") || analysis.caseType.includes("Contract")) score += 10

    return Math.min(score, 95)
  }

  private static calculateConciliationSuitability(analysis: CaseAnalysis): number {
    let score = 65 // Base score

    if (analysis.complexity === "Medium") score += 10
    if (analysis.relationshipImportance === "Medium") score += 10
    if (analysis.caseType.includes("Employment") || analysis.caseType.includes("Consumer")) score += 15

    return Math.min(score, 90)
  }

  private static calculateLokAdaltSuitability(analysis: CaseAnalysis): number {
    let score = 50 // Base score

    if (analysis.disputeValue.includes("Low") || analysis.disputeValue.includes("Lakh")) score += 20
    if (analysis.caseType.includes("Motor Accident") || analysis.caseType.includes("Public Utility")) score += 25
    if (analysis.complexity === "Low") score += 10

    return Math.min(score, 95)
  }

  private static calculateODRSuitability(analysis: CaseAnalysis): number {
    let score = 55 // Base score

    if (analysis.disputeValue.includes("Low") || analysis.disputeValue.includes("Lakh")) score += 15
    if (analysis.caseType.includes("E-commerce") || analysis.caseType.includes("Online")) score += 25
    if (analysis.urgency === "High") score += 15

    return Math.min(score, 90)
  }
}
