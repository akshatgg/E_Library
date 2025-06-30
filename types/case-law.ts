export interface CaseLaw {
  id: string
  title: string
  court: string
  caseNumber: string
  dateOfJudgment: string
  category: "ITAT" | "GST" | "INCOME_TAX" | "HIGH_COURT" | "SUPREME_COURT"
  summary: string
  fullText?: string
  citations: string[]
  keywords: string[]
  parties: {
    appellant: string
    respondent: string
  }
  judgeName: string
  outcome: "allowed" | "dismissed" | "partly_allowed"
  relevantSections: string[]
  legalPoints: string[]
  precedentValue: "high" | "medium" | "low"
  url?: string
  pdfUrl?: string
}

export interface CaseLawFilter {
  category?: string
  court?: string
  year?: string
  outcome?: string
  keywords?: string[]
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
  hasMore: boolean
}
