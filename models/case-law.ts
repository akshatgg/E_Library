export interface CaseLaw {
  id: string
  title: string
  court: string
  caseNumber: string
  date: string
  category: "ITAT" | "GST" | "INCOME_TAX"
  summary: string
  fullText: string
  citations: string[]
  keywords: string[]
  judgeName: string
  parties: {
    appellant: string
    respondent: string
  }
  outcome: "allowed" | "dismissed" | "partly_allowed"
  legalPoints: string[]
  relevantSections: string[]
  url?: string
}

export interface CaseLawFilter {
  category?: "ITAT" | "GST" | "INCOME_TAX"
  year?: string
  court?: string
  keywords?: string[]
  outcome?: "allowed" | "dismissed" | "partly_allowed"
  dateRange?: {
    start: string
    end: string
  }
}

export interface CaseLawSearchResult {
  cases: CaseLaw[]
  total: number
  page: number
  limit: number
}
