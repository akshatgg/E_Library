"use client"

// Types for topic modeling
export interface CitationTopic {
  id: string
  label: string
  keywords: string[]
  color: string
  cases: string[] // Case IDs belonging to this topic
}

// Types for citation network
export interface CitationNode {
  id: string
  title: string
  court: string
  year: number
  citationCount: number
  pdfUrl?: string
  summary?: string
  influence: number
  topicId?: string
  topicLabel?: string
  topicColor?: string
}

export interface CitationLink {
  source: string
  target: string
  type: "followed" | "distinguished" | "overruled" | "referred"
}

export interface CitationNetwork {
  nodes: CitationNode[]
  links: CitationLink[]
}

export interface CitationNetworkData {
  nodes: CitationNode[]
  links: CitationLink[]
  topics?: CitationTopic[]
}

// Mock data for development
const mockCases = [
  {
    id: "case1",
    title: "Smith v. Jones - Tax Evasion Case",
    court: "Supreme Court",
    date: "2020-01-15",
    judgment:
      "This case involves tax evasion through offshore accounts. The court found that the defendant intentionally concealed income to avoid taxation.",
    pdfUrl: "https://example.com/case1.pdf",
  },
  {
    id: "case2",
    title: "Brown v. State - Criminal Procedure",
    court: "High Court",
    date: "2019-05-20",
    judgment:
      "This case examines the proper procedures for search and seizure in criminal investigations. The court established new guidelines for police conduct.",
    pdfUrl: "https://example.com/case2.pdf",
  },
  {
    id: "case3",
    title: "Johnson Corp v. Tax Authority - Corporate Tax",
    court: "ITAT",
    date: "2021-03-10",
    judgment:
      "This case addresses corporate tax deductions for research and development expenses. The tribunal allowed the deductions based on documented evidence.",
    pdfUrl: "https://example.com/case3.pdf",
  },
  {
    id: "case4",
    title: "Wilson v. Department of Revenue - Income Tax Assessment",
    court: "CIT(A)",
    date: "2018-11-05",
    judgment:
      "This case involves the assessment of income from foreign sources. The commissioner ruled that the income was taxable in India under DTAA provisions.",
    pdfUrl: "https://example.com/case4.pdf",
  },
  {
    id: "case5",
    title: "Green Enterprises v. ITO - Business Expense Deductions",
    court: "ITAT",
    date: "2022-02-18",
    judgment:
      "This case examines the deductibility of business promotion expenses. The tribunal allowed partial deduction based on the nature of expenditure.",
    pdfUrl: "https://example.com/case5.pdf",
  },
  {
    id: "case6",
    title: "Public Interest Foundation v. Union - Constitutional Validity",
    court: "Supreme Court",
    date: "2017-09-25",
    judgment:
      "This case challenges the constitutional validity of certain tax provisions. The court upheld the provisions as within legislative competence.",
    pdfUrl: "https://example.com/case6.pdf",
  },
  {
    id: "case7",
    title: "Martinez v. State - Criminal Evidence",
    court: "High Court",
    date: "2020-07-12",
    judgment:
      "This case addresses the admissibility of digital evidence in criminal proceedings. The court established standards for authentication of digital records.",
    pdfUrl: "https://example.com/case7.pdf",
  },
  {
    id: "case8",
    title: "Tech Solutions Ltd v. CIT - Transfer Pricing",
    court: "ITAT",
    date: "2019-12-03",
    judgment:
      "This case involves transfer pricing adjustments for international transactions. The tribunal applied the arm's length principle to determine appropriate pricing.",
    pdfUrl: "https://example.com/case8.pdf",
  },
  {
    id: "case9",
    title: "Thompson v. Revenue Department - Tax Penalties",
    court: "CIT(A)",
    date: "2021-06-30",
    judgment:
      "This case examines the imposition of penalties for tax filing delays. The commissioner reduced penalties based on reasonable cause shown by the taxpayer.",
    pdfUrl: "https://example.com/case9.pdf",
  },
  {
    id: "case10",
    title: "Global Imports v. Customs - Import Duty Classification",
    court: "Tribunal",
    date: "2018-04-15",
    judgment:
      "This case addresses the classification of imported goods for customs duty purposes. The tribunal applied the harmonized system of nomenclature.",
    pdfUrl: "https://example.com/case10.pdf",
  },
]

// Mock citation links
const mockLinks = [
  { source: "case1", target: "case3", type: "followed" as const },
  { source: "case2", target: "case7", type: "followed" as const },
  { source: "case3", target: "case5", type: "distinguished" as const },
  { source: "case4", target: "case1", type: "referred" as const },
  { source: "case5", target: "case8", type: "followed" as const },
  { source: "case6", target: "case1", type: "overruled" as const },
  { source: "case7", target: "case2", type: "referred" as const },
  { source: "case8", target: "case3", type: "followed" as const },
  { source: "case9", target: "case4", type: "distinguished" as const },
  { source: "case10", target: "case5", type: "referred" as const },
  { source: "case3", target: "case1", type: "followed" as const },
  { source: "case5", target: "case3", type: "referred" as const },
  { source: "case7", target: "case6", type: "distinguished" as const },
  { source: "case9", target: "case8", type: "followed" as const },
  { source: "case10", target: "case9", type: "referred" as const },
]

export function buildCitationNetwork(cases: any[]): CitationNetworkData {
  // Create nodes from cases
  const nodes: CitationNode[] = cases.map((c) => ({
    id: c.id,
    title: c.title,
    court: c.court,
    year: new Date(c.date).getFullYear(),
    citationCount: 0, // Initialize citation count
    pdfUrl: c.pdfUrl,
    summary: c.judgment,
    influence: 0, // Initialize influence
    topicId: "",
    topicLabel: "",
    topicColor: "",
  }))

  const links: CitationLink[] = []

  // In a real implementation, this would analyze the full text of each case
  // and identify citations to other cases. For now, we'll just create some
  // dummy links based on the mock data.
  if (cases.length > 0) {
    // Use mockLinks if we have cases
    mockLinks.forEach((link) => {
      // Only add links if both source and target exist in our nodes
      if (nodes.some((n) => n.id === link.source) && nodes.some((n) => n.id === link.target)) {
        links.push(link)
      }
    })
  }

  // Update citation counts
  links.forEach((link) => {
    const targetNode = nodes.find((node) => node.id === link.target)
    if (targetNode) {
      targetNode.citationCount += 1
    }
  })

  // Calculate influence scores
  nodes.forEach((node) => {
    node.influence = links.filter((link) => link.target === node.id).length
  })

  return { nodes, links }
}

export function getMostInfluentialCases(network: CitationNetwork, count: number): CitationNode[] {
  const sortedNodes = [...network.nodes].sort((a, b) => b.influence - a.influence)
  return sortedNodes.slice(0, count)
}

export function getCitingCases(network: CitationNetwork, caseId: string): CitationNode[] {
  const citingLinks = network.links.filter((link) => link.target === caseId)
  return citingLinks.map((link) => network.nodes.find((node) => node.id === link.source)!).filter(Boolean)
}

export function getCitedCases(network: CitationNetwork, caseId: string): CitationNode[] {
  const citedLinks = network.links.filter((link) => link.source === caseId)
  return citedLinks.map((link) => network.nodes.find((node) => node.id === link.target)!).filter(Boolean)
}

export function getCasesByTopic(network: CitationNetworkData, topicId: string): CitationNode[] {
  return network.nodes.filter((node) => node.topicId === topicId)
}

export async function getCitationNetwork(): Promise<CitationNetwork> {
  try {
    // In a real implementation, this would fetch all cases and build the network
    // For now, we'll use the mock data
    const cases = mockCases
    return buildCitationNetwork(cases)
  } catch (error) {
    console.error("Error getting citation network:", error)
    throw error
  }
}
