export interface EnhancedCaseLaw {
  id: string
  title: string
  caseNumber: string
  appealNumber?: string
  panNumber?: string
  gstinNumber?: string

  // Court Information
  court: "ITO" | "Commissioner" | "Commissioner_Appeal" | "ITAT" | "High_Court" | "Supreme_Court"
  courtLocation: string
  bench?: string

  // Tax Categories
  taxType: "Income_Tax" | "GST" | "Corporate_Tax" | "Service_Tax" | "Customs" | "Excise"

  // Legal Sections
  section: string
  subSection?: string
  rule?: string

  // Case Details
  appellant: string
  respondent: string
  dateOfOrder: string
  dateOfHearing?: string

  // Decision
  decision: "Won" | "Lost" | "Partly_Allowed" | "Remanded" | "Dismissed"
  groundOfAppeal: string[]

  // Content
  summary: string
  fullText?: string
  keyPoints: string[]
  precedentValue: "High" | "Medium" | "Low"

  // Additional Info
  tags: string[]
  citations: string[]
  relatedCases?: string[]

  // Metadata
  createdAt: string
  updatedAt: string
  viewCount: number
  downloadCount: number
  isBookmarked: boolean
}

export interface CaseLawFilters {
  search?: string
  court?: string
  taxType?: string
  section?: string
  subSection?: string
  decision?: string
  dateFrom?: string
  dateTo?: string
  panNumber?: string
  appealNumber?: string
  gstinNumber?: string
  groundOfAppeal?: string
}
