import { type CaseLaw, CourtType } from "@/models/case-law"
import { itatService } from "@/services/itat-service"
import { gstService } from "@/services/gst-service"
import { incomeTaxService } from "@/services/income-tax-service"

export class CaseLawController {
  async searchCaseLaws(query: string, court?: CourtType, year?: string): Promise<CaseLaw[]> {
    try {
      const results: CaseLaw[] = []

      // Search ITAT cases
      if (!court || court === CourtType.ITAT) {
        const itatCases = await itatService.searchCases(query, year)
        results.push(...itatCases)
      }

      // Search GST cases
      if (!court || court === CourtType.CESTAT) {
        const gstCases = await gstService.searchCases(query, year)
        results.push(...gstCases)
      }

      // Search Income Tax Commissioner Appeals
      if (!court || court === CourtType.COMMISSIONER_APPEALS) {
        const itCases = await incomeTaxService.searchCases(query, year)
        results.push(...itCases)
      }

      return results.sort((a, b) => new Date(b.dateOfJudgment).getTime() - new Date(a.dateOfJudgment).getTime())
    } catch (error) {
      console.error("Error searching case laws:", error)
      throw new Error("Failed to search case laws")
    }
  }

  async getCaseById(id: string): Promise<CaseLaw | null> {
    try {
      // Try each service to find the case
      const services = [itatService, gstService, incomeTaxService]

      for (const service of services) {
        const caseData = await service.getCaseById(id)
        if (caseData) return caseData
      }

      return null
    } catch (error) {
      console.error("Error fetching case:", error)
      return null
    }
  }

  async getRecentCases(limit = 10): Promise<CaseLaw[]> {
    try {
      const [itatCases, gstCases, itCases] = await Promise.all([
        itatService.getRecentCases(limit),
        gstService.getRecentCases(limit),
        incomeTaxService.getRecentCases(limit),
      ])

      return [...itatCases, ...gstCases, ...itCases]
        .sort((a, b) => new Date(b.dateOfJudgment).getTime() - new Date(a.dateOfJudgment).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error("Error fetching recent cases:", error)
      return []
    }
  }
}

export const caseLawController = new CaseLawController()
