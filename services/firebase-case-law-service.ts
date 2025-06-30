"use client"

import { useState, useEffect } from "react"
import { useFirebase } from "@/hooks/use-firebase"

export interface CaseLaw {
  id: string
  title: string
  court: string
  section: string
  subSection?: string
  panNumber?: string
  gstin?: string
  appealNumber?: string
  decisionDate: Date
  groundOfAppeal: string
  decision: "Allowed" | "Dismissed" | "Partly Allowed"
  summary: string
  fullText: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CaseLawSearchFilters {
  section?: string
  subSection?: string
  court?: string
  panNumber?: string
  gstin?: string
  appealNumber?: string
  decision?: string
  groundOfAppeal?: string
  dateFrom?: Date
  dateTo?: Date
  searchQuery?: string
}

export function useCaseLawService() {
  const { db, loading: firebaseLoading } = useFirebase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!firebaseLoading) {
      setLoading(false)
    }
  }, [firebaseLoading])

  // Get sample case laws for preview (free users)
  const getSampleCaseLaws = (): CaseLaw[] => {
    return [
      {
        id: "sample-1",
        title: "ABC Pvt Ltd vs DCIT - Section 68 Addition",
        court: "ITAT Mumbai",
        section: "68",
        subSection: "1",
        panNumber: "AABCA1234B",
        gstin: "27AABCA1234B1Z5",
        appealNumber: "ITA No. 1234/Mum/2023",
        decisionDate: new Date("2023-12-15"),
        groundOfAppeal: "Addition under Section 68 - Cash Credits",
        decision: "Allowed",
        summary:
          "ITAT deleted the addition made under Section 68 as the assessee provided sufficient evidence to prove the genuineness of cash credits.",
        fullText: "The assessee challenged the addition made by the AO under Section 68 of the Income Tax Act...",
        tags: ["Section 68", "Cash Credits", "ITAT Mumbai", "Allowed"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sample-2",
        title: "XYZ Ltd vs ACIT - GST Input Credit Denial",
        court: "High Court Delhi",
        section: "16",
        subSection: "2",
        panNumber: "AABCX5678Y",
        gstin: "07AABCX5678Y1Z2",
        appealNumber: "GST Appeal No. 567/Del/2023",
        decisionDate: new Date("2023-11-20"),
        groundOfAppeal: "Denial of Input Tax Credit",
        decision: "Partly Allowed",
        summary: "High Court allowed partial input credit where proper documentation was available.",
        fullText: "The appellant challenged the denial of input tax credit by the GST authorities...",
        tags: ["GST", "Input Credit", "High Court", "Partly Allowed"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sample-3",
        title: "PQR Industries vs DGFT - Export Incentive",
        court: "Supreme Court",
        section: "Export",
        subSection: "Incentive",
        panNumber: "AABCP9876Q",
        gstin: "29AABCP9876Q1Z8",
        appealNumber: "Civil Appeal No. 890/2023",
        decisionDate: new Date("2023-10-10"),
        groundOfAppeal: "Denial of Export Incentive Benefits",
        decision: "Dismissed",
        summary:
          "Supreme Court upheld the denial of export incentive due to non-compliance with prescribed conditions.",
        fullText: "The appellant sought export incentive benefits which were denied by DGFT...",
        tags: ["Export", "Incentive", "Supreme Court", "Dismissed"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }

  // Search case laws with filters
  const searchCaseLaws = async (filters: CaseLawSearchFilters, isPremium = false) => {
    try {
      // For now, just return sample data
      const sampleData = getSampleCaseLaws()
      let filteredData = sampleData

      // Apply basic filtering to sample data
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredData = sampleData.filter(
          (caseLaw) =>
            caseLaw.title.toLowerCase().includes(query) ||
            caseLaw.summary.toLowerCase().includes(query) ||
            caseLaw.court.toLowerCase().includes(query) ||
            caseLaw.section.toLowerCase().includes(query),
        )
      }

      if (filters.section) {
        filteredData = filteredData.filter((caseLaw) => caseLaw.section === filters.section)
      }

      if (filters.court) {
        filteredData = filteredData.filter((caseLaw) =>
          caseLaw.court.toLowerCase().includes(filters.court!.toLowerCase()),
        )
      }

      if (filters.decision) {
        filteredData = filteredData.filter((caseLaw) => caseLaw.decision === filters.decision)
      }

      return {
        caseLaws: filteredData,
        totalCount: filteredData.length,
        hasMore: false,
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to search case laws"))
      return {
        caseLaws: [],
        totalCount: 0,
        hasMore: false,
      }
    }
  }

  // Get filter options
  const getFilterOptions = () => {
    const sampleData = getSampleCaseLaws()
    return {
      sections: [...new Set(sampleData.map((c) => c.section))],
      courts: [...new Set(sampleData.map((c) => c.court))],
      decisions: [...new Set(sampleData.map((c) => c.decision))],
      groundsOfAppeal: [...new Set(sampleData.map((c) => c.groundOfAppeal))],
    }
  }

  return {
    loading: loading || firebaseLoading,
    error,
    getSampleCaseLaws,
    searchCaseLaws,
    getFilterOptions,
  }
}
