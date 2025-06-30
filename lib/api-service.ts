import axios from "axios"

// Create custom axios instances for different APIs
export const indianKanoonApiClient = axios.create({
  baseURL: "https://api.indiankanoon.org/search/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export const supremeCourtApiClient = axios.create({
  baseURL: "https://api.supremecourt.gov.in/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export const highCourtApiClient = axios.create({
  baseURL: "https://api.highcourt.gov.in/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export const itatApiClient = axios.create({
  baseURL: "https://api.itat.gov.in/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export const incomeTaxApiClient = axios.create({
  baseURL: "https://api.incometaxindia.gov.in/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Create a custom axios instance for the PDF service
export const pdfApiClient = axios.create({
  baseURL: "https://api.pdfendpoint.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Types for the API responses
export interface CaseLawSearchResult {
  id: string
  title: string
  court: string
  date: string
  snippet: string
  documentType: string
  url: string
  pdfUrl?: string
  source: string
}

export interface CaseLawDetail {
  id: string
  title: string
  court: string
  date: string
  fullText: string
  bench: string
  appellant: string
  respondent: string
  appealNo: string
  section: string
  assessmentYear: string
  orderResult: string
  documentType: string
  url: string
  pdfUrl?: string
  citations: string[]
  source: string
}

// API Source definitions
export interface ApiSource {
  id: string
  name: string
  description: string
  enabled: boolean
  apiClient: any
  logo?: string
  website?: string
}

export const apiSources: ApiSource[] = [
  {
    id: "indian-kanoon",
    name: "Indian Kanoon",
    description: "Comprehensive database of Indian case law",
    enabled: true,
    apiClient: indianKanoonApiClient,
    logo: "/logos/indian-kanoon.png",
    website: "https://indiankanoon.org/",
  },
  {
    id: "supreme-court",
    name: "Supreme Court of India",
    description: "Official judgments from the Supreme Court of India",
    enabled: true,
    apiClient: supremeCourtApiClient,
    logo: "/logos/supreme-court.png",
    website: "https://main.sci.gov.in/",
  },
  {
    id: "high-courts",
    name: "High Courts",
    description: "Judgments from various High Courts across India",
    enabled: true,
    apiClient: highCourtApiClient,
    logo: "/logos/high-court.png",
    website: "https://highcourtchd.gov.in/",
  },
  {
    id: "itat",
    name: "Income Tax Appellate Tribunal",
    description: "Orders from the Income Tax Appellate Tribunal",
    enabled: true,
    apiClient: itatApiClient,
    logo: "/logos/itat.png",
    website: "https://itat.gov.in/",
  },
  {
    id: "income-tax-dept",
    name: "Income Tax Department",
    description: "Circulars, notifications and orders from the Income Tax Department",
    enabled: true,
    apiClient: incomeTaxApiClient,
    logo: "/logos/income-tax.png",
    website: "https://www.incometaxindia.gov.in/",
  },
]

// Mock data for development (when API is not available)
const mockCaseLawData: CaseLawDetail[] = [
  {
    id: "itat-001",
    title: "XYZ Ltd. vs. Commissioner of Income Tax",
    court: "ITAT Delhi",
    date: "2023-05-15",
    fullText:
      "This is a case regarding the disallowance under section 14A of the Income Tax Act, 1961. The assessee claimed that no expenditure was incurred for earning exempt income, but the Assessing Officer made disallowance under Rule 8D. The ITAT held that when no exempt income is earned during the year, no disallowance under section 14A can be made.",
    bench: "Delhi",
    appellant: "XYZ Ltd.",
    respondent: "Commissioner of Income Tax",
    appealNo: "ITA 1234/DEL/2023",
    section: "14A",
    assessmentYear: "2022-23",
    orderResult: "Allowed",
    documentType: "ITAT",
    url: "https://example.com/case/itat-001",
    pdfUrl: "/api/pdf/itat-001", // Local API endpoint
    citations: ["(2023) 123 ITD 456 (Delhi)"],
    source: "itat",
  },
  {
    id: "itat-002",
    title: "ABC Pvt. Ltd. vs. DCIT",
    court: "ITAT Mumbai",
    date: "2023-06-20",
    fullText:
      "This case deals with the addition made by the AO on account of unexplained cash credits under section 68 of the Income Tax Act. The assessee failed to prove the creditworthiness of the investors who had subscribed to its share capital. The ITAT confirmed the addition made by the AO.",
    bench: "Mumbai",
    appellant: "ABC Pvt. Ltd.",
    respondent: "Deputy Commissioner of Income Tax",
    appealNo: "ITA 5678/MUM/2023",
    section: "68",
    assessmentYear: "2021-22",
    orderResult: "Dismissed",
    documentType: "ITAT",
    url: "https://example.com/case/itat-002",
    pdfUrl: "/api/pdf/itat-002", // Local API endpoint
    citations: ["(2023) 145 ITD 789 (Mumbai)"],
    source: "itat",
  },
  {
    id: "cit-001",
    title: "PQR Ltd. vs. ITO",
    court: "CIT(A) Delhi",
    date: "2023-07-10",
    fullText:
      "This appeal pertains to the disallowance of business expenditure under section 37(1) of the Income Tax Act. The CIT(A) held that the expenditure was incurred wholly and exclusively for the purpose of business and deleted the disallowance made by the AO.",
    bench: "Delhi",
    appellant: "PQR Ltd.",
    respondent: "Income Tax Officer",
    appealNo: "ITA 9012/CIT(A)/DEL/2023",
    section: "37(1)",
    assessmentYear: "2020-21",
    orderResult: "Allowed",
    documentType: "CIT(A)",
    url: "https://example.com/case/cit-001",
    pdfUrl: "/api/pdf/cit-001", // Local API endpoint
    citations: [],
    source: "income-tax-dept",
  },
  {
    id: "ao-001",
    title: "Assessment Order - LMN Industries Ltd.",
    court: "ITO Ward 1(1), Delhi",
    date: "2023-04-05",
    fullText:
      "Assessment order under section 143(3) of the Income Tax Act. The AO made additions on account of bogus purchases, disallowance of depreciation, and disallowance under section 14A.",
    bench: "Delhi",
    appellant: "LMN Industries Ltd.",
    respondent: "Income Tax Department",
    appealNo: "N/A",
    section: "143(3)",
    assessmentYear: "2019-20",
    orderResult: "Assessment Completed",
    documentType: "AO Order",
    url: "https://example.com/case/ao-001",
    pdfUrl: "/api/pdf/ao-001", // Local API endpoint
    citations: [],
    source: "income-tax-dept",
  },
  {
    id: "corp-001",
    title: "MNO Ltd. vs. Registrar of Companies",
    court: "NCLT Delhi",
    date: "2023-08-15",
    fullText:
      "This case involves a dispute regarding the appointment of directors and compliance with the Companies Act, 2013. The NCLT ruled in favor of the petitioner and directed the Registrar of Companies to make necessary changes in the records.",
    bench: "Delhi",
    appellant: "MNO Ltd.",
    respondent: "Registrar of Companies",
    appealNo: "CP No. 123/NCLT/DEL/2023",
    section: "Section 242",
    assessmentYear: "N/A",
    orderResult: "Allowed",
    documentType: "Corporate Law",
    url: "https://example.com/case/corp-001",
    pdfUrl: "/api/pdf/corp-001", // Local API endpoint
    citations: [],
    source: "indian-kanoon",
  },
  {
    id: "crim-001",
    title: "State vs. John Doe",
    court: "Sessions Court, Delhi",
    date: "2023-09-20",
    fullText:
      "Criminal case involving charges under section 420 of the Indian Penal Code. The accused was found guilty of cheating and sentenced to imprisonment for 2 years.",
    bench: "Delhi",
    appellant: "State",
    respondent: "John Doe",
    appealNo: "Sessions Case No. 456/2023",
    section: "420 IPC",
    assessmentYear: "N/A",
    orderResult: "Convicted",
    documentType: "Criminal Law",
    url: "https://example.com/case/crim-001",
    pdfUrl: "/api/pdf/crim-001", // Local API endpoint
    citations: [],
    source: "indian-kanoon",
  },
  // Supreme Court cases
  {
    id: "sc-001",
    title: "Union of India vs. Azadi Bachao Andolan",
    court: "Supreme Court of India",
    date: "2003-10-07",
    fullText:
      "This landmark case deals with the validity of the Circular issued by the CBDT regarding the applicability of the Indo-Mauritius Double Taxation Avoidance Agreement. The Supreme Court upheld the validity of the Circular and held that treaty shopping is not illegal.",
    bench: "Constitutional Bench",
    appellant: "Union of India",
    respondent: "Azadi Bachao Andolan",
    appealNo: "Civil Appeal No. 8161-8162 of 2003",
    section: "DTAA",
    assessmentYear: "N/A",
    orderResult: "Allowed",
    documentType: "Supreme Court",
    url: "https://example.com/case/sc-001",
    pdfUrl: "/api/pdf/sc-001", // Local API endpoint
    citations: ["(2004) 10 SCC 1"],
    source: "supreme-court",
  },
  {
    id: "sc-002",
    title: "Commissioner of Income Tax vs. Calcutta Knitwears",
    court: "Supreme Court of India",
    date: "2014-02-19",
    fullText:
      "This case deals with the interpretation of Section 147/148 of the Income Tax Act regarding reopening of assessment. The Supreme Court laid down the principles for reopening of assessment beyond four years.",
    bench: "Division Bench",
    appellant: "Commissioner of Income Tax",
    respondent: "Calcutta Knitwears",
    appealNo: "Civil Appeal No. 3958 of 2014",
    section: "147/148",
    assessmentYear: "2002-03",
    orderResult: "Dismissed",
    documentType: "Supreme Court",
    url: "https://example.com/case/sc-002",
    pdfUrl: "/api/pdf/sc-002", // Local API endpoint
    citations: ["(2014) 6 SCC 444"],
    source: "supreme-court",
  },
  // High Court cases
  {
    id: "hc-001",
    title: "CIT vs. Sesa Goa Ltd.",
    court: "Bombay High Court",
    date: "2020-01-15",
    fullText:
      "This case deals with the allowability of expenditure under section 37(1) of the Income Tax Act. The High Court held that the expenditure incurred for CSR activities is allowable as business expenditure if it is incurred for the purpose of business.",
    bench: "Division Bench",
    appellant: "Commissioner of Income Tax",
    respondent: "Sesa Goa Ltd.",
    appealNo: "ITA No. 123 of 2019",
    section: "37(1)",
    assessmentYear: "2015-16",
    orderResult: "Dismissed",
    documentType: "High Court",
    url: "https://example.com/case/hc-001",
    pdfUrl: "/api/pdf/hc-001", // Local API endpoint
    citations: ["(2020) 420 ITR 169 (Bombay)"],
    source: "high-courts",
  },
  {
    id: "hc-002",
    title: "Vodafone India Services Pvt. Ltd. vs. Union of India",
    court: "Delhi High Court",
    date: "2018-11-02",
    fullText:
      "This case deals with the issue of transfer pricing adjustment on issue of shares to the parent company. The High Court held that the issue of shares is a capital account transaction and not an income transaction, hence transfer pricing provisions are not applicable.",
    bench: "Division Bench",
    appellant: "Vodafone India Services Pvt. Ltd.",
    respondent: "Union of India",
    appealNo: "W.P.(C) 5578/2015",
    section: "92 to 92F",
    assessmentYear: "2013-14",
    orderResult: "Allowed",
    documentType: "High Court",
    url: "https://example.com/case/hc-002",
    pdfUrl: "/api/pdf/hc-002", // Local API endpoint
    citations: ["(2018) 408 ITR 1 (Delhi)"],
    source: "high-courts",
  },
]

// Additional mock data for Income Tax Department circulars and notifications
const mockIncomeTaxCirculars: CaseLawDetail[] = [
  {
    id: "circular-001",
    title: "Circular No. 10/2023: Clarification regarding TDS on salaries",
    court: "CBDT",
    date: "2023-06-15",
    fullText:
      "This circular provides clarification regarding the deduction of tax at source (TDS) from salaries under section 192 of the Income Tax Act, 1961 for the Financial Year 2023-24.",
    bench: "N/A",
    appellant: "N/A",
    respondent: "N/A",
    appealNo: "Circular No. 10/2023",
    section: "192",
    assessmentYear: "2023-24",
    orderResult: "N/A",
    documentType: "Circular",
    url: "https://example.com/circular/001",
    pdfUrl: "/api/pdf/circular-001", // Local API endpoint
    citations: [],
    source: "income-tax-dept",
  },
  {
    id: "notification-001",
    title: "Notification No. 56/2023: Amendment to Rule 12 of Income Tax Rules",
    court: "CBDT",
    date: "2023-07-20",
    fullText:
      "This notification amends Rule 12 of the Income Tax Rules, 1962 to prescribe the forms for filing Income Tax Returns for Assessment Year 2023-24.",
    bench: "N/A",
    appellant: "N/A",
    respondent: "N/A",
    appealNo: "Notification No. 56/2023",
    section: "Rule 12",
    assessmentYear: "2023-24",
    orderResult: "N/A",
    documentType: "Notification",
    url: "https://example.com/notification/001",
    pdfUrl: "/api/pdf/notification-001", // Local API endpoint
    citations: [],
    source: "income-tax-dept",
  },
]

// Combine all mock data
const allMockData = [...mockCaseLawData, ...mockIncomeTaxCirculars]

// This file already exists, so I'll just add the necessary imports for the citation network
import { buildCitationNetwork, type CitationNetwork } from "@/lib/citation-network"

// Add this function to the existing api-service.ts file
export async function getCitationNetwork(): Promise<CitationNetwork> {
  try {
    // In a real implementation, this would fetch all cases and build the network
    // For now, we'll use the mock data
    const cases = allMockData
    return buildCitationNetwork(cases)
  } catch (error) {
    console.error("Error getting citation network:", error)
    throw error
  }
}

// Get enabled API sources
export function getEnabledApiSources(): ApiSource[] {
  if (typeof window === "undefined") {
    return apiSources // Return default sources on server-side
  }

  try {
    // In a real implementation, this would fetch from user preferences or localStorage
    const storedSources = localStorage.getItem("elibrary_api_sources")
    if (storedSources) {
      const parsedSources = JSON.parse(storedSources)
      return apiSources.map((source) => ({
        ...source,
        enabled: parsedSources.find((s: any) => s.id === source.id)?.enabled ?? source.enabled,
      }))
    }
  } catch (error) {
    console.error("Error getting enabled API sources:", error)
  }
  return apiSources
}

// Save API source preferences
export function saveApiSourcePreferences(sources: Partial<ApiSource>[]): void {
  if (typeof window === "undefined") {
    return // Don't attempt to use localStorage on server-side
  }

  try {
    localStorage.setItem("elibrary_api_sources", JSON.stringify(sources))
  } catch (error) {
    console.error("Error saving API source preferences:", error)
  }
}

// API functions
export async function searchCaseLaw(
  query: string,
  filters: Record<string, string> = {},
  sources: string[] = [],
): Promise<CaseLawSearchResult[]> {
  try {
    // Get enabled sources if none specified
    const enabledSources =
      sources.length > 0
        ? sources
        : getEnabledApiSources()
            .filter((s) => s.enabled)
            .map((s) => s.id)

    // For now, filter mock data by query, filters, and sources
    const filteredData = allMockData.filter((item) => {
      // Check if the source is enabled
      if (!enabledSources.includes(item.source)) {
        return false
      }

      // Check if the item matches the query
      const matchesQuery = query
        ? item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.fullText.toLowerCase().includes(query.toLowerCase())
        : true

      // Apply filters
      let matchesFilters = true
      for (const [key, value] of Object.entries(filters)) {
        if (value && item[key as keyof CaseLawDetail] !== value) {
          matchesFilters = false
          break
        }
      }

      return matchesQuery && matchesFilters
    })

    // Convert to search results format
    return filteredData.map((item) => ({
      id: item.id,
      title: item.title,
      court: item.court,
      date: item.date,
      snippet: item.fullText.substring(0, 150) + "...",
      documentType: item.documentType,
      url: item.url,
      pdfUrl: item.pdfUrl,
      source: item.source,
    }))
  } catch (error) {
    console.error("Error searching case law:", error)
    throw error
  }
}

export async function getCaseLawDetail(id: string): Promise<CaseLawDetail> {
  try {
    // For now, return mock data
    const caseDetail = allMockData.find((item) => item.id === id)
    if (!caseDetail) {
      throw new Error(`Case with ID ${id} not found`)
    }
    return caseDetail
  } catch (error) {
    console.error("Error getting case law detail:", error)
    throw error
  }
}

export async function fetchPdf(url: string): Promise<Blob> {
  try {
    // For local API endpoints, use a direct fetch
    if (url.startsWith("/api/")) {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.blob()
    }

    // For external URLs, use axios
    const response = await axios.get(url, {
      responseType: "blob",
    })
    return response.data
  } catch (error) {
    console.error("Error fetching PDF:", error)

    // Create a simple text-based PDF as a fallback
    const placeholderText = "PDF could not be loaded. Please try downloading the document instead."
    return createPlaceholderPdf(placeholderText)
  }
}

// Helper function to create a simple placeholder PDF
function createPlaceholderPdf(text: string): Blob {
  // This is a minimal valid PDF structure
  return new Blob(
    [
      `%PDF-1.7
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000102 00000 n

trailer<</Size 4/Root 1 0 R>>
startxref
149
%%EOF`,
    ],
    { type: "application/pdf" },
  )
}

// Function to get case law by category
export async function getCaseLawByCategory(category: string, sources: string[] = []): Promise<CaseLawSearchResult[]> {
  try {
    // Get enabled sources if none specified
    const enabledSources =
      sources.length > 0
        ? sources
        : getEnabledApiSources()
            .filter((s) => s.enabled)
            .map((s) => s.id)

    // For now, filter mock data by category and sources
    let documentType: string
    switch (category.toLowerCase()) {
      case "tax law":
        documentType = "ITAT"
        break
      case "corporate law":
        documentType = "Corporate Law"
        break
      case "criminal law":
        documentType = "Criminal Law"
        break
      default:
        documentType = category
    }

    const filteredData = allMockData.filter((item) => {
      // Check if the source is enabled
      if (!enabledSources.includes(item.source)) {
        return false
      }

      // Check if the item matches the category
      return (
        item.documentType.toLowerCase() === documentType.toLowerCase() ||
        (documentType === "ITAT" && (item.documentType === "CIT(A)" || item.documentType === "AO Order"))
      )
    })

    // Convert to search results format
    return filteredData.map((item) => ({
      id: item.id,
      title: item.title,
      court: item.court,
      date: item.date,
      snippet: item.fullText.substring(0, 150) + "...",
      documentType: item.documentType,
      url: item.url,
      pdfUrl: item.pdfUrl,
      source: item.source,
    }))
  } catch (error) {
    console.error(`Error getting case law for category ${category}:`, error)
    throw error
  }
}

// Function to get statistics about available case law
export async function getCaseLawStatistics(sources: string[] = []): Promise<Record<string, any>> {
  try {
    // Get enabled sources if none specified
    const enabledSources =
      sources.length > 0
        ? sources
        : getEnabledApiSources()
            .filter((s) => s.enabled)
            .map((s) => s.id)

    // For now, generate statistics from mock data
    const filteredData = allMockData.filter((item) => enabledSources.includes(item.source))

    // Count by source
    const countBySource = enabledSources.reduce(
      (acc, sourceId) => ({
        ...acc,
        [sourceId]: filteredData.filter((item) => item.source === sourceId).length,
      }),
      {},
    )

    // Count by document type
    const documentTypes = [...new Set(filteredData.map((item) => item.documentType))]
    const countByDocumentType = documentTypes.reduce(
      (acc, type) => ({
        ...acc,
        [type]: filteredData.filter((item) => item.documentType === type).length,
      }),
      {},
    )

    // Count by year
    const years = [...new Set(filteredData.map((item) => new Date(item.date).getFullYear()))]
    const countByYear = years.reduce(
      (acc, year) => ({
        ...acc,
        [year]: filteredData.filter((item) => new Date(item.date).getFullYear() === year).length,
      }),
      {},
    )

    return {
      total: filteredData.length,
      bySource: countBySource,
      byDocumentType: countByDocumentType,
      byYear: countByYear,
    }
  } catch (error) {
    console.error("Error getting case law statistics:", error)
    throw error
  }
}
